import { config } from '../../config/settings.js';
import { WordCloudRenderer } from './Renderer.js';
import { WordCloudLayoutManager } from './LayoutManager.js';
import { WordCloudDataManager } from './DataManager.js';

export class WordCloud {
    constructor(containerId, options = {}) {
        this.container = typeof containerId === 'string' ? 
            document.getElementById(containerId.replace('#', '')) : 
            containerId;

        if (!this.container) {
            throw new Error('Container element not found');
        }

        // Set container style to ensure proper sizing
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.position = 'relative';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.minHeight = '400px'; // Add minimum height

        this.options = { 
            ...config.wordcloud,
            width: this.container.clientWidth || 800,
            height: this.container.clientHeight || 600,
            ...options 
        };
        
        this.renderer = new WordCloudRenderer(this.container, this.options);
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
        const resizeObserver = new ResizeObserver(() => this.handleResize());
        resizeObserver.observe(this.container);
        // Keep existing resize handler as fallback
        window.addEventListener('resize', this.debounce(this.handleResize, 250));
        // Also handle orientation change for mobile devices
        window.addEventListener('orientationchange', this.debounce(this.handleResize, 250));
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    handleResize() {
        // Force a reflow to ensure we get the correct dimensions
        this.container.offsetHeight;
        
        const dimensions = this.layoutManager.calculateDimensions(this.container);
        this.options.width = dimensions.width;
        this.options.height = dimensions.height;
        
        this.layoutManager.updateDimensions(dimensions);
        this.renderer.updateDimensions(dimensions.width, dimensions.height);
        
        if (this.dataManager.getCurrentWords()) {
            this.redraw();
        }
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