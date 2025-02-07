# IWAC Word Cloud Visualization

An interactive word cloud visualization tool built with D3.js that displays word frequencies across different countries. The visualization supports multiple languages (English and French), allows for dynamic word count adjustment, and includes PNG export functionality.

## Features

- 🌍 Multi-country word frequency visualization
- 🔄 Dynamic word count adjustment (10-150 words)
- 🎨 Interactive visualization with hover effects
- 💾 Export to PNG functionality
- 🌐 Multilingual support (English/French)
- 📱 Responsive design
- 🎯 Word size normalization based on frequency
- 🧩 Modular architecture with clear separation of concerns

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── wordcloud/
│   │   │   ├── WordCloud.js     # Main word cloud component
│   │   │   ├── DataManager.js   # Data loading and management
│   │   │   ├── LayoutManager.js # Layout calculation and sizing
│   │   │   └── Renderer.js      # SVG rendering and animations
│   │   ├── CountrySelector.js   # Country selection component
│   │   ├── WordCountSlider.js   # Word count control
│   │   ├── SaveButton.js        # Export functionality
│   │   ├── Menu.js             # Control panel component
│   │   └── Tooltip.js          # Interactive tooltips
│   ├── utils/
│   │   ├── dataProcessor.js    # Data processing utilities
│   │   ├── translations.js     # Language translations
│   │   └── saveUtils.js        # PNG export functionality
│   ├── config/
│   │   └── settings.js         # Centralized configuration
│   ├── styles/
│   │   ├── modules/           # CSS modules for components
│   │   │   ├── button.css
│   │   │   ├── controls.css
│   │   │   ├── layout.css
│   │   │   ├── reset.css
│   │   │   ├── responsive.css
│   │   │   ├── slider.css
│   │   │   └── tooltip.css
│   │   └── main.css           # Main stylesheet
│   └── main.js                # Application entry point
├── data/
│   ├── combined_word_frequencies.json
│   ├── bénin_word_frequencies.json
│   ├── burkina_faso_word_frequencies.json
│   └── togo_word_frequencies.json
└── index.html                 # Main HTML file
```

## Architecture

The project follows a modular architecture with clear separation of concerns:

### Core Components

1. **WordCloud Module**
   - `WordCloud.js`: Main component orchestrating the visualization
   - `DataManager.js`: Handles data loading and processing
   - `LayoutManager.js`: Manages layout calculations and word positioning
   - `Renderer.js`: Handles SVG rendering and animations

2. **UI Components**
   - `Menu.js`: Control panel with all user interface elements
   - `CountrySelector.js`: Country selection dropdown
   - `WordCountSlider.js`: Word count adjustment slider
   - `SaveButton.js`: PNG export functionality
   - `Tooltip.js`: Interactive tooltips for word information

3. **Utilities**
   - `dataProcessor.js`: Data transformation and normalization
   - `translations.js`: Internationalization support
   - `saveUtils.js`: Export utilities

4. **Styling**
   - Modular CSS architecture with separate files for each component
   - Responsive design support
   - Touch-friendly interactions

## Dependencies

- [D3.js](https://d3js.org/) (v7.8.5) - Data visualization library
- [d3-cloud](https://github.com/jasondavies/d3-cloud) (v1.2.5) - Word cloud layout

## Data Format

The word frequency data should be stored in JSON files with the following structure:

For individual country data:
```json
[
  {
    "text": "word",
    "size": 42
  }
]
```

For the combined view:
```json
{
  "country1": [
    {
      "text": "word",
      "size": 42
    }
  ]
}
```

## Configuration

The project configuration is centralized in `src/config/settings.js`:

- Word cloud settings (dimensions, font sizes, rotations)
- Data settings (min/max word counts)
- Country configurations
- File paths

## Component APIs

### WordCloud Component

```javascript
const wordCloud = new WordCloud('#container', options);
await wordCloud.update(country, wordCount);
```

### Menu Component

```javascript
const menu = new Menu('controls', updateCallback, options);
menu.getCountry();  // Get selected country
menu.getWordCount(); // Get selected word count
```

### DataManager Component

```javascript
const dataManager = new WordCloudDataManager();
const words = await dataManager.loadData(country, wordCount);
```

## Data Preparation

The project includes a Python script (`word_cloud.py`) that processes text content from an Omeka S database to generate the word frequency data used by the visualization.

### Script Features

- 🔄 Fetches content from Omeka S API with caching support
- 🧹 Advanced text preprocessing using spaCy and NLTK
- 🔤 Handles French language text processing
- 📊 Generates word frequencies for individual countries and combined view
- 💾 Caches processed data for improved performance

### Requirements

```bash
pip install spacy nltk requests python-dotenv tqdm
python -m spacy download fr_dep_news_trf
```

### Environment Setup

Create a `.env` file in the root directory with your Omeka S credentials:

```env
OMEKA_BASE_URL=your_omeka_url
OMEKA_KEY_IDENTITY=your_key_identity
OMEKA_KEY_CREDENTIAL=your_key_credential
```

### Processing Pipeline

1. **Data Fetching**
   - Connects to Omeka S API
   - Retrieves items from specified item sets
   - Implements caching to avoid redundant processing

2. **Text Processing**
   - Cleans and normalizes text
   - Removes stopwords and unwanted tokens
   - Performs lemmatization
   - Handles French-specific text features

3. **Output Generation**
   - Calculates word frequencies
   - Generates individual country JSON files
   - Creates combined frequency data
   - Stores results in the `data/` directory

### Running the Script

```bash
python word_cloud.py
```

The script will generate the following files in the `data/` directory:
- `bénin_word_frequencies.json`
- `burkina_faso_word_frequencies.json`
- `togo_word_frequencies.json`
- `combined_word_frequencies.json`

## Acknowledgments

- [D3.js](https://d3js.org/) for the visualization framework
- [Jason Davies](https://github.com/jasondavies/d3-cloud) for the word cloud layout algorithm
- IWAC project for the word frequency data