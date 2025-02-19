import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorManager } from './ErrorManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';

export class DimensionManager {
    static instance = null;

    constructor(container) {
        if (DimensionManager.instance) {
            return DimensionManager.instance;
        }
        
        this.container = container;
        this.config = ConfigManager.getInstance();
        this.observers = new Set();
        this.dimensions = this.getInitialDimensions();
        
        this.setupResizeObserver();
        this.handleResize();
        
        DimensionManager.instance = this;
    }

    static getInstance(container = null) {
        if (!DimensionManager.instance && container) {
            DimensionManager.instance = new DimensionManager(container);
        }
        return DimensionManager.instance;
    }

    getInitialDimensions() {
        return CSSVariableManager.getDimensions();
    }

    validateDimensions(width, height) {
        const { minHeight, maxWidth } = this.dimensions;
        return {
            width: Math.min(maxWidth, Math.max(100, width)),
            height: Math.max(minHeight, height)
        };
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
        try {
            const rect = this.container.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(this.container);
            
            const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
            const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
            
            const newDimensions = this.validateDimensions(
                rect.width - paddingX,
                rect.height - paddingY
            );

            if (this.dimensions.width !== newDimensions.width || 
                this.dimensions.height !== newDimensions.height) {
                this.dimensions = { ...this.dimensions, ...newDimensions };
                this.notifyObservers();
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'DimensionManager',
                method: 'handleResize'
            });
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