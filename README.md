# IWAC Word Cloud Visualization

An interactive word cloud visualization tool built with D3.js that displays word frequencies across different countries. The visualization supports multiple languages (English and French), allows for dynamic word count adjustment, and includes PNG export functionality.

## Features

- 🌍 Multi-country word frequency visualization
- 🔄 Dynamic word count adjustment (10-150 words)
- 🎨 Interactive visualization with hover effects
- 📋 Paginated word list with synchronized interactions
- 🔍 Bi-directional highlighting between cloud and list
- 💾 Export to PNG functionality
- 🌐 URL-based configuration and sharing
- 📱 Responsive design
- 🎯 Word size normalization based on frequency
- 🧩 Modular architecture with clear separation of concerns
- 🎭 Modern typography with Inter font system
- 🎨 Sophisticated color scheme system with multiple assignment strategies
- ✨ Advanced animations and transitions system

## URL Configuration

The application supports URL-based configuration for easy sharing and bookmarking:

### Language Selection
- English version: `https://fmadore.github.io/IWAC-wordcloud/en/index.html`
- French version: `https://fmadore.github.io/IWAC-wordcloud/fr/index.html`

### URL Parameters
You can configure the visualization using URL parameters:

- `country`: Select a specific country
  - Example: `?country=togo`
  - Available values: `combined`, `bénin`, `burkina_faso`, `côte_d'ivoire`, `niger`, `togo`

- `words`: Set the number of words to display
  - Example: `?words=50`
  - Range: 10-200 words

### Examples
- Show Togo's word cloud: `index.html?country=togo`
- Display 50 words: `index.html?words=50`
- Combine parameters: `index.html?country=benin&words=100`

The root URL (`https://fmadore.github.io/IWAC-wordcloud/`) automatically redirects to the English version.

## Project Structure

```
project/
├── en/                      # English version
│   └── index.html          # English interface
├── fr/                      # French version
│   └── index.html          # French interface
├── src/
│   ├── assets/
│   │   └── fonts/          # Font files (Inter)
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
│   │   ├── ElementClassManager.js   # DOM element class management
│   │   ├── ColorManager.js   # Color scheme management
│   │   ├── AnimationManager.js # Animation system
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
│   │   │   ├── variables.css # Global variables (colors, typography, layout)
│   │   │   ├── wordlist.css # Word list styles
│   │   │   └── tooltip.css
│   │   └── main.css         # Main stylesheet
│   ├── ElementClassManager.js   # DOM element class management
│   └── main.js              # Application entry point
├── scripts/
│   └── download-fonts.ps1   # Font download utility
├── data/
│   ├── combined_word_frequencies.json
│   ├── bénin_word_frequencies.json
│   ├── burkina_faso_word_frequencies.json
│   └── togo_word_frequencies.json
└── index.html              # Root file with language redirection
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

4. **Style Management**
   - `ColorManager.js`: Sophisticated color scheme management
   - `FontManager.js`: Centralized font management
   - `ElementClassManager.js`: DOM element class management
   - CSS modules for component-specific styles
   - CSS variables for consistent theming
   - Responsive design support

5. **Color System**
   - Centralized color scheme definitions in CSS variables
   - Multiple color assignment strategies:
     - Frequency-based: Colors assigned based on word frequency
     - Random: Random color selection from scheme
     - Fixed: Consistent color assignment by position
   - Interactive color effects:
     - Smooth transitions between states
     - Hover opacity changes
     - Consistent color palette across components
   - Semantic color variables for maintainability
   - Accessible color combinations with good contrast

6. **Typography System**
   - Modern typography using Inter font
   - Consistent font scale with CSS variables
   - Responsive font sizing
   - Font weights: 400 (normal), 500 (medium), 600 (semibold)
   - Fallback system fonts for optimal loading

7. **CSS Architecture**
   - Modular CSS organization with clear separation of concerns:
     ```
     styles/
     ├── modules/
     │   ├── variables.css   # Global variables and configuration (colors, typography, layout, etc.)
     │   ├── reset.css       # CSS reset and normalization
     │   ├── fonts.css       # Typography system and font declarations
     │   ├── layout.css      # Core layout and structure
     │   ├── controls.css    # Form controls and input elements
     │   ├── slider.css      # Range slider component
     │   ├── button.css      # Button styles and states
     │   ├── wordcloud.css   # Word cloud visualization styles
     │   ├── wordlist.css    # Word list component and interactions
     │   ├── tooltip.css     # Tooltip component
     │   └── responsive.css  # Media queries and breakpoints
     └── main.css           # Main stylesheet with module imports
     ```
   
   - **Global Variables System**
     - Centralized configuration in `variables.css`:
       - Color System
         - Base colors (--color-primary, --color-white)
         - Neutral palette (--color-gray-50 to --color-gray-700)
         - Word cloud specific colors (--wordcloud-scheme-1 to --wordcloud-scheme-10)
         - Semantic mappings (--color-text-primary, --color-border)
         - Alpha variations for shadows and overlays
       - Typography
         - Font families and fallbacks
         - Font size scale (--font-size-xs to --font-size-xl)
         - Line heights and weights
       - Layout dimensions (--word-list-width, --content-height-*)
       - Component spacing (--spacing-*)
       - Border radius values (--border-radius-*)
       - Z-index layers (--z-index-*)
       - Transition timings (--transition-*)
       - Breakpoint definitions (--breakpoint-*)
       - Word cloud specific configuration
   
   - **Typography System**
     - Comprehensive typography in `fonts.css`:
       - Inter font with multiple weights (400, 500, 600)
       - Font loading optimizations
       - Font utility classes
       - Font-face declarations
   
   - **Component Architecture**
     - Each component has its own dedicated CSS module
     - BEM-like naming convention for clarity
     - Scoped styles to prevent conflicts
     - Consistent component structure:
       - Container/wrapper styles
       - Component-specific styles
       - State modifiers (.hover, .active, .disabled)
       - Interactive states (:hover, :focus, :active)
       - Animation definitions
   
   - **Responsive Design**
     - Mobile-first approach in `responsive.css`:
       - Progressive enhancement
       - Breakpoint-based adaptations
       - Touch-optimized interactions
       - Flexible layouts using CSS Grid and Flexbox
       - Container queries for component-level responsiveness
   
   - **Performance Optimizations**
     - Hardware-accelerated animations (transform, opacity)
     - Will-change hints for smooth transitions
     - Efficient selectors for better rendering
     - Minimal CSS specificity conflicts
     - Reduced paint operations
   
   - **Maintainability Features**
     - Clear import order in main.css
     - Consistent naming patterns
     - Documented media query breakpoints
     - Single source of truth for variables in variables.css
     - Modular file organization

### Animation System

The visualization features a sophisticated animation system that brings the word cloud to life:

1. **Morphing Transitions**
   - Smooth morphing between different datasets
   - Graceful exit animations for removed words
   - Elegant entry animations for new words
   - Configurable transition timing and easing

2. **Particle Effects**
   - Particle explosion effects on word removal
   - Particle implosion effects on word entry
   - Customizable particle count and colors
   - Physics-based particle movement

3. **Physics-Based Animations**
   - Gravity-based word entry animations
   - Bounce effects with configurable parameters
   - Natural-feeling motion for word positioning
   - Smooth interpolation between states

4. **Configuration Options**
   ```javascript
   {
     animation: {
       transition: {
         duration: 800,
         morphing: true,
         particles: true,
         physics: true
       },
       particles: {
         count: 10,
         duration: 600,
         colors: ['#ffb703', '#fb8500', '#e76f51', '#2a9d8f']
       },
       physics: {
         gravity: 0.8,
         bounce: 0.4,
         initialVelocity: -15
       }
     }
   }
   ```

5. **Performance Optimization**
   - Hardware-accelerated animations using CSS transforms
   - Efficient particle system with automatic cleanup
   - Smooth transitions even with large datasets
   - Fallbacks for lower-end devices

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

### URLManager Component
```javascript
const urlManager = URLManager.getInstance();

// Get initial state from URL
const state = urlManager.getInitialState();
// Returns: { country: string, wordCount: number }

// Update URL parameters
urlManager.updateURL('togo', 50);
// Updates URL to: ?country=togo&words=50

// Listen for URL changes
window.addEventListener('urlchange', (event) => {
    const { country, wordCount } = event.detail;
    // Handle state change
});
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

## Configuration & Customization

The application uses a sophisticated configuration system powered by `ConfigManager` that allows extensive customization of the word cloud visualization and behavior.

### Core Configuration Options

```javascript
{
    wordcloud: {
        dimensions: {
            width: 800,
            height: 600,
            minHeight: 400,
            maxWidth: 1200
        },
        font: {
            family: {
                primary: 'Inter',
                fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
            },
            size: {
                min: 10,
                max: null, // Calculated based on height
                scale: {
                    factor: 5,
                    min: 0.8,
                    max: 1.2
                }
            },
            weight: {
                normal: 400,
                bold: 600,
                range: [300, 400, 500, 600]
            }
        },
        layout: {
            padding: 5,
            rotations: [0, 90],
            rotationProbability: 0.5
        },
        colors: {
            colorAssignment: 'frequency', // 'frequency', 'random', or 'fixed'
            opacity: {
                normal: 1,
                hover: 0.8
            }
        },
        export: {
            scale: 2,
            format: 'png'
        }
    },
    data: {
        minWords: 10,
        maxWords: 150,
        defaultWordCount: 150,
        defaultCountry: 'combined'
    }
}
```

### Animation Configuration

```javascript
{
    animation: {
        duration: 200,
        scaleOnHover: 1.2,
        transition: {
            duration: 800,
            morphing: true,
            particles: true,
            physics: true
        },
        particles: {
            count: 10,
            duration: 600,
            colors: ['#ffb703', '#fb8500', '#e76f51', '#2a9d8f']
        },
        physics: {
            gravity: 0.8,
            bounce: 0.4,
            initialVelocity: -15
        }
    }
}
```

## Event System

The application uses a robust event-driven architecture powered by `EventBus` with middleware support for validation and logging.

### Core Events

```javascript
// Word Cloud Events
{
    UPDATE: 'wordcloud:update',
    LOADING: 'wordcloud:loading',
    ERROR: 'wordcloud:error',
    RESIZE: 'wordcloud:resize',
    WORD_HOVER: 'wordcloud:word:hover',
    WORD_CLICK: 'wordcloud:word:click'
}

// UI Events
{
    COUNTRY_CHANGE: 'ui:country:change',
    WORD_COUNT_CHANGE: 'ui:wordcount:change',
    SAVE_REQUEST: 'ui:save:request',
    SAVE_COMPLETE: 'ui:save:complete'
}

// Data Events
{
    LOAD_START: 'data:load:start',
    LOAD_COMPLETE: 'data:load:complete',
    PROCESS_START: 'data:process:start',
    PROCESS_COMPLETE: 'data:process:complete'
}
```

### Validation Middleware

The validation middleware ensures data integrity by validating event payloads:

```javascript
const eventSchemas = {
    'wordcloud:update': {
        required: ['words'],
        validate: data => Array.isArray(data.words)
    },
    'ui:country:change': {
        required: ['country'],
        validate: data => typeof data.country === 'string'
    },
    'ui:wordcount:change': {
        required: ['count'],
        validate: data => typeof data.count === 'number'
    }
}
```

## Utility Modules

The application includes several utility modules that handle specific aspects of the visualization:

### AnimationManager

Manages all animations and transitions in the word cloud:
- Word enter/exit animations with scaling and rotation
- Particle effects for word removal/addition
- Physics-based animations with gravity and bounce
- Smooth morphing transitions between states

### FontManager

Handles font-related operations:
- Font size calculations based on container size
- Font style application (family, size, weight)
- Dynamic font scaling for hover effects
- Font size limits enforcement

### ColorManager

Manages color schemes and assignments:
- Multiple color assignment strategies (frequency, random, fixed)
- CSS variable-based color scheme management
- Hover opacity effects
- Color transitions

### StyleManager

Handles layout and styling:
- Container setup and positioning
- SVG element styling
- Responsive layout management
- Style consistency enforcement

### CanvasManager

Optimizes canvas operations for PNG export:
- Canvas context optimization
- High-resolution export support
- Memory management for large canvases

### WordStyleManager

Combines font and color management for words:
- Unified word styling application
- Hover effect management
- Style transitions
- Rank-based style adjustments

## Data & Caching

The application implements a sophisticated caching system for both API data and processed results:

### Cache Structure
```
cache/
├── api/              # Raw API response cache
│   ├── benin/
│   ├── burkina/
│   └── togo/
└── processed/        # Processed data cache
    ├── combined/
    └── countries/
```

### Cache Management

- **API Cache**: Stores raw API responses with configurable TTL
- **Processed Cache**: Stores preprocessed word frequencies
- **Cache Invalidation**: Automatic invalidation on data updates
- **Cache Clearing**: Manual cache clearing through API

### Cache Configuration

```javascript
{
    cache: {
        ttl: 3600, // Cache TTL in seconds
        maxSize: 100 * 1024 * 1024, // Max cache size (100MB)
        autoInvalidate: true, // Auto invalidate on updates
        compression: true // Enable cache compression
    }
}
```

### ElementClassManager

Handles DOM element class management:
- Container setup and positioning
- SVG element class management
- Element class consistency enforcement
- DOM structure management

### WordStyleManager