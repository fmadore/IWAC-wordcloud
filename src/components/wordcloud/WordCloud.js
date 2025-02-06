import { config } from '../../config/settings.js';
import { WordCloudRenderer } from './Renderer.js';
import { WordCloudLayoutManager } from './LayoutManager.js';
import { WordCloudDataManager } from './DataManager.js';

export class WordCloud {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { ...config.wordcloud, ...options };
        
        this.renderer = new WordCloudRenderer(container, this.options);
        this.layoutManager = new WordCloudLayoutManager(this.options);
        this.dataManager = new WordCloudDataManager();
        
        this.setupCanvas();
        this.setupEventListeners();
        this.handleResize();
    }

    setupCanvas() {
        this.originalCreateElement = document.createElement.bind(document);
        document.createElement = (tagName) => {
            const element = this.originalCreateElement(tagName);
            if (tagName.toLowerCase() === 'canvas') {
                this.optimizeCanvasContext(element);
            }
            return element;
        };
    }

    optimizeCanvasContext(canvasElement) {
        const originalGetContext = canvasElement.getContext.bind(canvasElement);
        canvasElement.getContext = (contextType, attributes = {}) => {
            if (contextType === '2d') {
                attributes.willReadFrequently = true;
            }
            return originalGetContext(contextType, attributes);
        };
    }

    setupEventListeners() {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        const dimensions = this.layoutManager.calculateDimensions(this.container);
        this.layoutManager.updateDimensions(dimensions);
        
        if (this.dataManager.getCurrentWords()) {
            this.redraw();
        }
    }

    async redraw() {
        const words = await this.layoutManager.layoutWords(this.dataManager.getCurrentWords());
        this.draw(words);
    }

    cleanup() {
        window.removeEventListener('resize', this.handleResize);
        this.restoreCanvas();
        this.renderer.clear();
    }

    restoreCanvas() {
        if (this.originalCreateElement) {
            document.createElement = this.originalCreateElement;
            this.originalCreateElement = null;
        }
    }

    draw(words) {
        this.dataManager.setCurrentWords(words);
        this.renderer.clear();
        
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