"""
This script generates word cloud data from text content stored in an Omeka S database.
It processes text content from different item sets grouped by country (Bénin, Burkina Faso, and Togo),
performs text preprocessing and cleaning, and outputs word frequency data in JSON format.

The script:
1. Connects to an Omeka S API to fetch item content
2. Processes text using NLP techniques (spaCy and NLTK)
3. Removes stopwords, punctuation, and unwanted tokens
4. Generates word frequencies for each country
5. Outputs both individual country files and a combined JSON file

Requirements:
- Python 3.x
- spaCy with French language model (fr_dep_news_trf)
- NLTK with French stopwords
- Environment variables for Omeka S API credentials
"""

import requests
from tqdm import tqdm
from nltk.corpus import stopwords
import nltk
import spacy
from collections import Counter
import json
import re
import os
from dotenv import load_dotenv
from datetime import datetime
import pytz

# Get the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
# Define data directory path
data_dir = os.path.join(script_dir, 'data')
# Define cache directory path
cache_dir = os.path.join(data_dir, 'cache')

# Ensure directories exist
os.makedirs(data_dir, exist_ok=True)
os.makedirs(cache_dir, exist_ok=True)

# Cache file paths
ITEMS_CACHE_FILE = os.path.join(cache_dir, 'items_cache.json')
PROCESSED_CACHE_FILE = os.path.join(cache_dir, 'processed_cache.json')

# Load environment variables from .env file in the root directory
root_dir = os.path.dirname(script_dir)
load_dotenv(os.path.join(root_dir, '.env'))

# Omeka S API configuration
API_URL = os.getenv('OMEKA_BASE_URL')
KEY_IDENTITY = os.getenv('OMEKA_KEY_IDENTITY')
KEY_CREDENTIAL = os.getenv('OMEKA_KEY_CREDENTIAL')

# Dictionary mapping countries to their respective item set IDs in Omeka S
ITEM_SETS = {
    'Bénin': [2185, 2185, 5502, 2186, 2188, 2187, 2191, 2190, 2189, 4922, 5501, 5500, 60638],
    'Burkina Faso': [2199, 2200, 23273, 5503, 2215, 2214, 2207, 2209, 2210, 2213, 2201],
    'Togo': [25304, 9458, 5498, 5499, 67399, 67407, 67460, 67430, 67456],
    'Côte d\'Ivoire': [62076, 31882, 48249, 57943, 61320, 15845, 61289, 45390, 61684, 57944],
    'Niger': [62021]
}

# Set up NLP tools and resources
nltk.download('stopwords')
french_stopwords = set(stopwords.words('french'))

# Extend stopwords with additional custom words and common French verbs
additional_stopwords = {'El', '000', '%', "être", "avoir", "faire", "dire", "aller", "voir", "savoir", 
                       "pouvoir", "falloir", "vouloir", "m."}
french_stopwords.update(additional_stopwords)

# Load French language model for spaCy
nlp = spacy.load('fr_dep_news_trf')

# Combine NLTK and spaCy stopwords
spacy_french_stopwords = nlp.Defaults.stop_words
french_stopwords.update(spacy_french_stopwords)
french_stopwords = set(word.lower() for word in french_stopwords)

# Add common French contractions to stopwords
contractions = {"d'", "l'", "n'", "qu'", "j'", "t'", "s'", "m'"}
french_stopwords.update(contractions)

# Compile regular expressions for text cleanup
newline_re = re.compile(r'\n')
apostrophe_re = re.compile(r"['']")  # Matches both curly and straight apostrophes
whitespace_re = re.compile(r'\s+')
oe_re = re.compile(r'œ')

# Add these constants near the top of the file, after other constants
MIN_FREQUENCY_THRESHOLD = 2  # Words must appear at least twice to be cached
MAX_WORDS_PER_COUNTRY = 1000  # Maximum number of words to store per country

def prune_counter(counter, max_words=MAX_WORDS_PER_COUNTRY, min_freq=MIN_FREQUENCY_THRESHOLD):
    """
    Prune a counter object to keep only significant words.
    
    Args:
        counter (Counter): Counter object with word frequencies
        max_words (int): Maximum number of words to keep
        min_freq (int): Minimum frequency threshold
    
    Returns:
        Counter: Pruned counter object
    """
    # First filter by minimum frequency
    filtered = Counter({word: freq for word, freq in counter.items() if freq >= min_freq})
    
    # Then take top N words if still too many
    if len(filtered) > max_words:
        return Counter(dict(filtered.most_common(max_words)))
    return filtered

def load_cache():
    """
    Load the cached items and their modification dates.
    
    Returns:
        tuple: (items_cache, processed_cache) containing cached data
    """
    items_cache = {}
    processed_cache = {}
    
    if os.path.exists(ITEMS_CACHE_FILE):
        with open(ITEMS_CACHE_FILE, 'r', encoding='utf-8') as f:
            items_cache = json.load(f)
    
    if os.path.exists(PROCESSED_CACHE_FILE):
        with open(PROCESSED_CACHE_FILE, 'r', encoding='utf-8') as f:
            processed_cache = json.load(f)
            
    return items_cache, processed_cache

def save_cache(items_cache, processed_cache):
    """
    Save the current cache to disk.
    
    Args:
        items_cache (dict): Cache of raw items and their modification dates
        processed_cache (dict): Cache of processed word frequencies
    """
    with open(ITEMS_CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(items_cache, f, ensure_ascii=False, indent=2)
    
    with open(PROCESSED_CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(processed_cache, f, ensure_ascii=False, indent=2)

def get_items_by_set(api_url, item_set_id, key_identity, key_credential, items_cache):
    """
    Retrieve all items from a specific Omeka S item set using pagination.
    Only fetch items that have been modified since their last cache.
    
    Args:
        api_url (str): Base URL of the Omeka S API
        item_set_id (int): ID of the item set to retrieve
        key_identity (str): API key identity
        key_credential (str): API key credential
        items_cache (dict): Cache of previously fetched items
    
    Returns:
        tuple: (List of items from the specified item set, Updated items cache)
    """
    items = []
    page = 1
    cache_key = str(item_set_id)
    
    while True:
        url = f"{api_url}/items?key_identity={key_identity}&key_credential={key_credential}&item_set_id={item_set_id}&page={page}"
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Failed to retrieve items for set {item_set_id}: {response.status_code} - {response.text}")
            break
            
        data = response.json()
        if not data:
            break
            
        for item in data:
            item_id = item.get('o:id')
            modified_date = item.get('o:modified', {}).get('@value')
            
            # Check if item needs processing
            cache_entry = items_cache.get(cache_key, {}).get(str(item_id))
            if not cache_entry or cache_entry['modified_date'] != modified_date:
                items.append(item)
                # Update cache
                if cache_key not in items_cache:
                    items_cache[cache_key] = {}
                items_cache[cache_key][str(item_id)] = {
                    'modified_date': modified_date,
                    'processed_date': datetime.now(pytz.UTC).isoformat()
                }
        
        page += 1
    
    return items, items_cache

def preprocess_texts(texts):
    """
    Clean and preprocess text data using NLP techniques.
    
    Processing steps:
    1. Basic text cleaning (newlines, apostrophes, whitespace)
    2. Tokenization using spaCy
    3. Lemmatization
    4. Removal of stopwords, punctuation, and unwanted tokens
    
    Args:
        texts (list): List of text strings to process
    
    Returns:
        list: Processed and cleaned tokens
    """
    processed_texts = []
    for text in tqdm(texts, desc="Preprocessing texts"):
        # Basic text normalization
        text = newline_re.sub(' ', text)
        text = apostrophe_re.sub("'", text)
        text = whitespace_re.sub(" ", text)
        text = oe_re.sub("oe", text)
        text = text.strip().lower()

        # Process text with spaCy NLP pipeline
        doc = nlp(text)
        tokens = []
        for token in doc:
            # Apply multiple filtering criteria
            if (token.lemma_.lower() not in french_stopwords 
                and not token.is_punct 
                and not token.is_space
                and len(token.lemma_) > 1
                and not token.is_stop
                and token.pos_ not in ['ADP', 'DET', 'PRON', 'AUX', 'SCONJ', 'CCONJ']
                and not token.is_digit
                and not token.like_num):
                
                # Skip contractions
                if token.text.lower() in contractions:
                    continue
                
                lemma = token.lemma_.lower()
                
                # Additional validation checks
                if (lemma not in french_stopwords 
                    and "'" not in lemma 
                    and not lemma.startswith("'") 
                    and not lemma.endswith("'")
                    and not lemma.isdigit()):
                    tokens.append(lemma)

        processed_texts.extend(tokens)
    return processed_texts

def get_word_frequencies(texts):
    """
    Calculate word frequencies from processed texts.
    
    Args:
        texts (list): List of processed tokens
    
    Returns:
        Counter: Counter object containing all word frequencies
    """
    return Counter(texts)

# Main execution block
# Load existing cache
items_cache, processed_cache = load_cache()

# Process each country's data and generate word frequencies
all_word_frequencies = {}
for country, sets in ITEM_SETS.items():
    country_texts = []
    cache_updated = False
    
    # Get existing frequencies from cache if available
    existing_frequencies = Counter()
    if country in processed_cache:
        existing_frequencies.update(processed_cache[country]['frequencies'])
    
    # Collect texts from all item sets for the current country
    for set_id in tqdm(sets, desc=f"Processing {country}"):
        items, items_cache = get_items_by_set(API_URL, set_id, KEY_IDENTITY, KEY_CREDENTIAL, items_cache)
        
        if items:  # Only process if there are new or modified items
            cache_updated = True
            for item in items:
                for value in item.get('bibo:content', []):
                    if value['type'] == 'literal':
                        country_texts.append(value['@value'])
    
    if cache_updated:
        # Process texts and get word frequencies for new/modified content
        preprocessed_texts = preprocess_texts(country_texts)
        new_frequencies = get_word_frequencies(preprocessed_texts)
        
        # Combine with existing frequencies
        combined_frequencies = existing_frequencies + new_frequencies
        
        # Prune the combined frequencies to keep cache size manageable
        pruned_frequencies = prune_counter(combined_frequencies)
        
        # Update processed cache with pruned frequencies
        processed_cache[country] = {
            'frequencies': dict(pruned_frequencies),
            'last_updated': datetime.now(pytz.UTC).isoformat()
        }
        
        all_word_frequencies[country] = pruned_frequencies
    else:
        # Use cached frequencies if available
        if country in processed_cache:
            all_word_frequencies[country] = Counter(processed_cache[country]['frequencies'])
            print(f"Using cached data for {country} from {processed_cache[country]['last_updated']}")
        else:
            print(f"No data available for {country}")

# Save updated cache
save_cache(items_cache, processed_cache)

# Generate individual JSON files for each country
for country, word_freq in all_word_frequencies.items():
    # Only take top 200 when generating output files
    top_words = word_freq.most_common(200)
    json_data = [{"text": word, "size": freq} for word, freq in top_words]
    
    filename = f"{country.lower().replace(' ', '_')}_word_frequencies.json"
    file_path = os.path.join(data_dir, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"Word frequencies for {country} saved to {file_path}")

# Generate combined JSON file containing data for all countries
combined_json_data = {country: [{"text": word, "size": freq} for word, freq in word_freq.most_common(200)] 
                      for country, word_freq in all_word_frequencies.items()}

combined_file_path = os.path.join(data_dir, "combined_word_frequencies.json")
with open(combined_file_path, 'w', encoding='utf-8') as f:
    json.dump(combined_json_data, f, ensure_ascii=False, indent=2)
print(f"Combined word frequencies saved to {combined_file_path}")