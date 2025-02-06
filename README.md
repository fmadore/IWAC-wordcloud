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

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   └── WordCloud.js      # Main word cloud visualization component
│   ├── utils/
│   │   ├── dataProcessor.js  # Data processing utilities
│   │   ├── translations.js   # Language translations
│   │   └── saveUtils.js      # PNG export functionality
│   ├── config/
│   │   └── settings.js       # Configuration settings
│   ├── styles/
│   │   └── main.css         # Stylesheet
│   └── main.js              # Application entry point
├── data/
│   ├── combined_word_frequencies.json
│   ├── bénin_word_frequencies.json
│   ├── burkina_faso_word_frequencies.json
│   └── togo_word_frequencies.json
└── index.html               # Main HTML file
```

## Dependencies

- [D3.js](https://d3js.org/) (v7.8.5) - Data visualization library
- [d3-cloud](https://github.com/jasondavies/d3-cloud) (v1.2.5) - Word cloud layout
- [html2canvas](https://html2canvas.hertzen.com/) - PNG export functionality

## Setup and Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/IWAC-wordcloud.git
   cd IWAC-wordcloud
   ```

2. Serve the project using a local web server. For example, using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

## Data Format

The word frequency data should be stored in JSON files with the following structure:

```json
[
  {
    "text": "word",
    "size": 42
  },
  // ... more words
]
```

For the combined view, the data structure should be:

```json
{
  "country1": [
    {
      "text": "word",
      "size": 42
    }
  ],
  // ... more countries
}
```

## Configuration

The project can be configured through `src/config/settings.js`:

- Word cloud settings (dimensions, font sizes, rotations)
- Data settings (min/max word counts)
- Country configurations
- File paths

## Features in Detail

### Word Cloud Component

The `WordCloud` class (`src/components/WordCloud.js`) provides the following functionality:

- Dynamic word sizing based on frequency
- Word rotation
- Interactive tooltips
- Smooth transitions
- Automatic layout optimization

### Data Processing

The data processor (`src/utils/dataProcessor.js`) handles:

- Word cleaning and normalization
- Size calculations
- Data aggregation for combined view
- Word frequency sorting

### Internationalization

The translation system (`src/utils/translations.js`) supports:

- Automatic language detection
- English and French translations
- Extensible translation dictionary

### Export Functionality

The PNG export utility (`src/utils/saveUtils.js`) provides:

- High-resolution exports
- Proper SVG to PNG conversion
- Automatic download triggering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [D3.js](https://d3js.org/) for the visualization framework
- [Jason Davies](https://github.com/jasondavies/d3-cloud) for the word cloud layout algorithm
- IWAC project for the word frequency data