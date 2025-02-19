import { ConfigManager } from '../config/ConfigManager.js';

export class DimensionManager {
    constructor(container) {
        this.container = container;
        this.config = ConfigManager.getInstance();
        this.observers = new Set();
        
        // Get CSS variables for dimensions
        const style = getComputedStyle(document.documentElement);
        const defaultWidth = parseInt(style.getPropertyValue('--wordcloud-width')) || 800;
        const defaultHeight = parseInt(style.getPropertyValue('--wordcloud-height')) || 600;
        const minHeight = parseInt(style.getPropertyValue('--wordcloud-min-height')) || 400;
        
        // Initialize dimensions with CSS defaults
        this.dimensions = {
            width: defaultWidth,
            height: Math.max(defaultHeight, minHeight)
        };
        
        // Setup resize observer and get initial dimensions
        this.setupResizeObserver();
        // Force initial dimension calculation
        this.handleResize();
    }

    setupResizeObserver() {
        this.resizeObserver = new ResizeObserver(entries => {
            if (entries && entries[0]) {
                this.handleResize();
            }
        });
        this.resizeObserver.observe(this.container);
        
        // Backup resize handler for older browsers
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('orientationchange', this.debounce(this.handleResize.bind(this), 250));
    }

    handleResize() {
        const style = getComputedStyle(document.documentElement);
        const minHeight = parseInt(style.getPropertyValue('--wordcloud-min-height')) || 400;
        const maxWidth = parseInt(style.getPropertyValue('--wordcloud-max-width')) || 1200;
        
        const rect = this.container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(this.container);
        
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        // Ensure dimensions respect CSS constraints
        const width = Math.min(maxWidth, Math.max(100, rect.width - paddingX));
        const height = Math.max(minHeight, rect.height - paddingY);
        
        const newDimensions = { width, height };

        if (this.dimensions.width !== newDimensions.width || 
            this.dimensions.height !== newDimensions.height) {
            this.dimensions = newDimensions;
            this.notifyObservers();
        }
    }

    subscribe(callback) {
        this.observers.add(callback);
        // Initial notification
        callback(this.getDimensions());
        return () => this.observers.delete(callback);
    }

    notifyObservers() {
        const dimensions = this.getDimensions();
        this.observers.forEach(callback => callback(dimensions));
    }

    getDimensions() {
        return { ...this.dimensions };
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        this.observers.clear();
    }
} 