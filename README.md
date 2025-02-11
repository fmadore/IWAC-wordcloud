# IWAC Word Cloud Visualization

An interactive word cloud visualization tool built with D3.js that displays word frequencies across different countries. The visualization supports multiple languages (English and French), allows for dynamic word count adjustment, and includes PNG export functionality.

## Features

- 🌍 Multi-country word frequency visualization
- 🔄 Dynamic word count adjustment (10-150 words)
- 🎨 Interactive visualization with hover effects
- 📋 Paginated word list with synchronized interactions
- 🔍 Bi-directional highlighting between cloud and list
- 💾 Export to PNG functionality
- 🌐 Multilingual support (English/French)
- 📱 Responsive design
- 🎯 Word size normalization based on frequency
- 🧩 Modular architecture with clear separation of concerns
- 🎭 Modern typography with Inter font system

## Project Structure

```
project/
├── src/
│   ├── assets/
│   │   └── fonts/              # Font files (Inter)
│   ├── components/
│   │   ├── wordcloud/
│   │   │   ├── WordCloud.js    # Main word cloud component
│   │   │   ├── DataManager.js  # Data loading and management
│   │   │   ├── LayoutManager.js # Layout calculation and sizing
│   │   │   └── Renderer.js     # SVG rendering and animations
│   │   ├── CountrySelector.js  # Country selection component
│   │   ├── WordCountSlider.js  # Word count control
│   │   ├── SaveButton.js       # Export functionality
│   │   ├── Menu.js            # Control panel component
│   │   ├── WordList.js        # Paginated word list component
│   │   └── Tooltip.js         # Interactive tooltips
│   ├── utils/
│   │   ├── dataProcessor.js   # Data processing utilities
│   │   ├── translations.js    # Language translations
│   │   ├── saveUtils.js      # PNG export functionality
│   │   ├── FontManager.js    # Font management and styling
│   │   ├── StyleManager.js   # Global style management
│   │   └── WordStyleManager.js # Word-specific styling
│   ├── config/
│   │   ├── settings.js       # Centralized configuration
│   │   └── ConfigManager.js  # Configuration management
│   ├── styles/
│   │   ├── modules/          # CSS modules for components
│   │   │   ├── button.css
│   │   │   ├── controls.css
│   │   │   ├── fonts.css    # Font declarations and variables
│   │   │   ├── layout.css
│   │   │   ├── reset.css
│   │   │   ├── responsive.css
│   │   │   ├── slider.css
│   │   │   ├── wordlist.css # Word list styles
│   │   │   └── tooltip.css
│   │   └── main.css         # Main stylesheet
│   └── main.js              # Application entry point
├── scripts/
│   └── download-fonts.ps1   # Font download utility
├── data/
│   ├── combined_word_frequencies.json
│   ├── bénin_word_frequencies.json
│   ├── burkina_faso_word_frequencies.json
│   └── togo_word_frequencies.json
└── index.html              # Main HTML file
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
   - `WordList.js`: Paginated list of words with frequencies
   - `Tooltip.js`: Interactive tooltips for word information

3. **Interactive Features**
   - Synchronized hover effects between word cloud and list
   - Automatic page navigation in word list when hovering cloud words
   - Visual highlighting of selected words in both views
   - Smooth scrolling to highlighted words
   - Interactive cursor feedback (pointer on hover)

4. **Typography System**
   - Modern typography using Inter font
   - Consistent font scale with CSS variables
   - Responsive font sizing
   - Font weights: 400 (normal), 500 (medium), 600 (semibold)
   - Fallback system fonts for optimal loading

5. **Style Management**
   - `FontManager.js`: Centralized font management
   - `StyleManager.js`: Global style utilities
   - CSS modules for component-specific styles
   - CSS variables for consistent theming
   - Responsive design support

## Component APIs

### WordCloud Component

```javascript
const wordCloud = new WordCloud('#container', options);
wordCloud.setWordList(wordList); // Connect word list for interactions
await wordCloud.update(country, wordCount);
```

### WordList Component

```javascript
const wordList = new WordList('#container');
wordList.updateWords(words); // Update list with new words
wordList.highlightWord(word); // Highlight specific word
wordList.goToPage(pageNumber); // Navigate to specific page
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