import { config } from '../../config/settings.js';
import { WordCloudRenderer } from './Renderer.js';
import { WordCloudLayoutManager } from './LayoutManager.js';
import { WordCloudDataManager } from './DataManager.js';
import { DimensionManager } from '../../utils/DimensionManager.js';
import { CanvasManager } from '../../utils/CanvasManager.js';
import { StyleManager } from '../../utils/StyleManager.js';

export class WordCloud {
    constructor(containerId, options = {}) {
        this.container = typeof containerId === 'string' ? 
            document.getElementById(containerId.replace('#', '')) : 
            containerId;

        if (!this.container) {
            throw new Error('Container element not found');
        }

        StyleManager.setupContainer(this.container);

        this.options = { 
            ...config.wordcloud,
            ...options 
        };
        
        this.setupManagers();
        this.setupEventHandlers();
    }

    setupManagers() {
        this.dimensionManager = new DimensionManager(this.container);
        this.canvasManager = new CanvasManager();
        this.renderer = new WordCloudRenderer(this.container, this.options);
        this.layoutManager = new WordCloudLayoutManager(this.options);
        this.dataManager = new WordCloudDataManager();
    }

    setupEventHandlers() {
        this.dimensionManager.subscribe(dimensions => {
            this.options.width = dimensions.width;
            this.options.height = dimensions.height;
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
            this.draw(words);
        } catch (error) {
            console.error('Error redrawing word cloud:', error);
        }
    }

    cleanup() {
        this.dimensionManager.destroy();
        this.canvasManager.destroy();
        this.renderer.clear();
    }

    draw(words) {
        if (!words || words.length === 0) return;
        
        this.dataManager.setCurrentWords(words);
        const svg = this.renderer.createSVG();
        const wordGroup = this.renderer.createWordGroup(svg);
        this.renderer.renderWords(wordGroup, words);
    }

    async update(country, wordCount) {
        try {
            const words = await this.dataManager.loadData(country, wordCount);
            const layoutedWords = await this.layoutManager.layoutWords(words);
            this.draw(layoutedWords);
        } catch (error) {
            console.error('Error updating word cloud:', error);
            throw error;
        }
    }
} 