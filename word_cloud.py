"""Simplified word cloud data generator.

This refactored script no longer pulls raw text from an Omeka S instance nor performs
heavy NLP preprocessing. Instead, it leverages the public Hugging Face dataset:

    https://huggingface.co/datasets/fmadore/islam-west-africa-collection

Subset: "articles"

Relevant columns used:
    - lemma_nostop (string): spaCy lemmatized French text with stopwords removed
    - country       (string): Country of publication

Because the dataset already provides lemmatized text without French stopwords,
we simply need to:
    1. Load the dataset subset "articles"
    2. Iterate rows and split `lemma_nostop` into tokens (whitespace-separated)
    3. Accumulate word frequencies per country
    4. Produce individual JSON files (top 200 words per country)
    5. Produce a combined JSON file with all countries

Output format (same as previous version) for each country file:
    [ { "text": <word>, "size": <frequency> }, ... ]

Combined file structure:
    { "Country Name": [ { "text": <word>, "size": <frequency> }, ... ], ... }

Dependencies (see requirements.txt):
    datasets   (Hugging Face Datasets library)
    tqdm       (progress bar)

Run:
    python word_cloud.py
"""

from collections import Counter, defaultdict
from datasets import load_dataset
from tqdm import tqdm
import json
import os
from datetime import datetime, timezone

# --------------------------- Configuration ---------------------------------

DATASET_ID = "fmadore/islam-west-africa-collection"
DATASET_CONFIG = "articles"        # subset name provided by user
DATASET_SPLIT = None               # None => load all available splits & merge; else specify e.g. "train"

# Maximum words exported per country (output JSONs use top 200 as before)
EXPORT_TOP_N = 200

# Internal pruning (keep more if you wish); set None for unlimited
MAX_WORDS_PER_COUNTRY = 1000

# Exact country names (no variants)
VALID_COUNTRIES = {
    "Benin",
    "Burkina Faso",
    "Côte d'Ivoire",
    "Niger",
    "Togo"
}

# --------------------------- Paths -----------------------------------------

script_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(script_dir, 'data')
os.makedirs(data_dir, exist_ok=True)

# --------------------------- Helpers ---------------------------------------

def normalize_country(raw: str) -> str | None:
    """Return canonical country if value is in allowed set (case-insensitive)."""
    if not raw:
        return None
    candidate = raw.strip().replace("\u00a0", " ")
    return candidate if candidate in VALID_COUNTRIES else None


def country_slug(name: str) -> str:
    """Generate filename slug from canonical name.

    Keeps accents/apostrophes (front-end expects them for Côte d'Ivoire) but replaces spaces with underscores
    and lowercases.
    """
    return name.lower().replace(' ', '_')


def tokenize(lemma_nostop: str) -> list[str]:
    """Split the lemma_nostop string into tokens.

    The column already has stopwords removed, so we just perform basic cleanup.
    """
    if not lemma_nostop:
        return []
    # Simple whitespace split; filter out stray punctuation or empty tokens
    return [t for t in lemma_nostop.strip().split() if t and len(t) > 1]


def prune_counter(counter: Counter, max_words: int | None) -> Counter:
    if max_words is None or len(counter) <= max_words:
        return counter
    return Counter(dict(counter.most_common(max_words)))


def export_country_json(country: str, counter: Counter):
    top_words = counter.most_common(EXPORT_TOP_N)
    json_data = [{"text": w, "size": f} for w, f in top_words]
    filename = f"{country_slug(country)}_word_frequencies.json"
    path = os.path.join(data_dir, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"Saved {country}: {path} ({len(top_words)} words)")


def export_combined_json(country_counters: dict[str, Counter]):
    combined = {
        country: [{"text": w, "size": f} for w, f in counter.most_common(EXPORT_TOP_N)]
        for country, counter in country_counters.items()
    }
    path = os.path.join(data_dir, 'combined_word_frequencies.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
    print(f"Saved combined file: {path}")


def load_all_rows():
    """Load dataset rows across one or multiple splits.

    Returns an iterable (list) of dict rows containing at least
    'lemma_nostop' and 'country'.
    """
    if DATASET_SPLIT:
        ds = load_dataset(DATASET_ID, DATASET_CONFIG, split=DATASET_SPLIT)
        return ds
    # Load full dataset (all splits). Will return a DatasetDict.
    dsdict = load_dataset(DATASET_ID, DATASET_CONFIG)
    rows = []
    for split_name, split in dsdict.items():
        print(f"Loaded split '{split_name}' with {len(split)} rows")
        rows.extend(split)
    return rows


def main():
    print("Loading dataset ...")
    rows = load_all_rows()
    print(f"Total rows loaded: {len(rows):,}")

    country_counters: dict[str, Counter] = defaultdict(Counter)
    article_counts: dict[str, int] = defaultdict(int)
    skipped_countries: dict[str, int] = defaultdict(int)

    for row in tqdm(rows, desc="Processing rows"):
        lemma_text = row.get('lemma_nostop')
        country_raw = row.get('country')
        country = normalize_country(country_raw)
        if not country:
            if country_raw:
                skipped_countries[country_raw] += 1
            continue  # Skip unrecognized countries
        tokens = tokenize(lemma_text)
        if not tokens:
            continue
        country_counters[country].update(tokens)
        article_counts[country] += 1

    # Debug summary
    print("\nArticle counts by country (accepted):")
    for c, cnt in sorted(article_counts.items()):
        print(f"  {c}: {cnt}")
    if skipped_countries:
        print("\nSkipped (country not in VALID_COUNTRIES):")
        for c, cnt in sorted(skipped_countries.items(), key=lambda x: -x[1]):
            print(f"  {c}: {cnt}")

    # Prune & export per country
    timestamp = datetime.now(timezone.utc).isoformat()
    print(f"Counting complete at {timestamp}")

    pruned_country_counters: dict[str, Counter] = {}
    for country, counter in country_counters.items():
        pruned = prune_counter(counter, MAX_WORDS_PER_COUNTRY)
        pruned_country_counters[country] = pruned
        export_country_json(country, pruned)

    # Cleanup: remove legacy accented file if present
    legacy_accented = os.path.join(data_dir, "bénin_word_frequencies.json")
    if os.path.exists(legacy_accented):
        try:
            os.remove(legacy_accented)
            print("Removed legacy accented file: bénin_word_frequencies.json")
        except OSError as e:
            print(f"Could not remove legacy accented file: {e}")

    # Add combined as synthetic 'Combined' or keep same logic? Existing UI expects separate combined JSON file.
    export_combined_json(pruned_country_counters)

    print("Done.")


if __name__ == '__main__':
    main()
