import { WordCloudRenderer } from './Renderer.js';
import { WordCloudLayoutManager } from './LayoutManager.js';
import { WordCloudDataManager } from './DataManager.js';
import { DimensionManager } from '../../utils/DimensionManager.js';
import { CanvasManager } from '../../utils/CanvasManager.js';
import { StyleManager } from '../../utils/StyleManager.js';
import { ConfigManager } from '../../config/ConfigManager.js';
import { WordStyleManager } from '../../utils/WordStyleManager.js';

export class WordCloud {
    constructor(containerId, options = {}) {
        this.container = typeof containerId === 'string' ? 
            document.getElementById(containerId.replace('#', '')) : 
            containerId;

        if (!this.container) {
            throw new Error('Container element not found');
        }

        this.config = ConfigManager.getInstance();
        this.initializeConfig(options);
        StyleManager.setupContainer(this.container);
        this.setupManagers();
        this.setupEventHandlers();
    }

    initializeConfig(options) {
        // Apply any custom options to the config
        Object.entries(options).forEach(([key, value]) => {
            this.config.set(`wordcloud.${key}`, value);
        });
    }

    setupManagers() {
        this.dimensionManager = new DimensionManager(this.container);
        this.canvasManager = new CanvasManager();
        this.renderer = new WordCloudRenderer(this.container);
        this.layoutManager = new WordCloudLayoutManager();
        this.dataManager = new WordCloudDataManager();
    }

    setupEventHandlers() {
        this.dimensionManager.subscribe(dimensions => {
            this.layoutManager.updateDimensions(dimensions);
            this.renderer.updateDimensions(dimensions.width, dimensions.height);
            
            if (this.dataManager.getCurrentWords()) {
                this.redraw();
            }
        });
    }

    async redraw() {
        try {
            const words = await this.layoutManager.layoutWords(this.dataManager.getCurrentWords());
            const rankedWords = WordStyleManager.addRankInformation(words);
            this.draw(rankedWords);
            return rankedWords;
        } catch (error) {
            console.error('Error redrawing word cloud:', error);
            throw error;
        }
    }

    cleanup() {
        this.dimensionManager.destroy();
        this.canvasManager.destroy();
        this.renderer.clear();
    }

    draw(words) {
        if (!words || words.length === 0) return words;
        
        this.dataManager.setCurrentWords(words);
        const svg = this.renderer.createSVG();
        const wordGroup = this.renderer.createWordGroup(svg);
        this.renderer.renderWords(wordGroup, words);
        return words;
    }

    async update(country, wordCount) {
        try {
            const words = await this.dataManager.loadData(country, wordCount);
            const layoutedWords = await this.layoutManager.layoutWords(words);
            const rankedWords = WordStyleManager.addRankInformation(layoutedWords);
            return this.draw(rankedWords);
        } catch (error) {
            console.error('Error updating word cloud:', error);
            throw error;
        }
    }
} 