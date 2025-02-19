import { ErrorManager } from './ErrorManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';

export class CanvasManager {
    constructor() {
        this.originalCreateElement = null;
        this.canvasElements = new Set();
        this.setup();
    }

    setup() {
        try {
            this.originalCreateElement = document.createElement.bind(document);
            document.createElement = (tagName) => {
                const element = this.originalCreateElement(tagName);
                
                if (tagName.toLowerCase() === 'canvas') {
                    this.setupCanvas(element);
                }
                
                return element;
            };
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'CanvasManager',
                method: 'setup'
            });
            this.restore();
        }
    }

    setupCanvas(canvasElement) {
        try {
            // Add to tracked elements
            this.canvasElements.add(canvasElement);

            // Add CSS classes
            canvasElement.classList.add('canvas');
            
            // Setup container if needed
            if (canvasElement.parentElement && !canvasElement.parentElement.classList.contains('canvas-container')) {
                const container = this.originalCreateElement('div');
                container.classList.add('canvas-container');
                canvasElement.parentElement.insertBefore(container, canvasElement);
                container.appendChild(canvasElement);
            }

            // Apply base styles
            this.applyBaseStyles(canvasElement);

            // Optimize context
            this.optimizeCanvasContext(canvasElement);

            // Setup high DPI support
            this.setupHighDPI(canvasElement);

        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'CanvasManager',
                method: 'setupCanvas'
            });
            canvasElement.classList.add('canvas-container--error');
        }
    }

    applyBaseStyles(canvasElement) {
        try {
            const backgroundColor = CSSVariableManager.getColor('--color-background', '#ffffff');
            const borderColor = CSSVariableManager.getColor('--color-border', '#e0e0e0');
            const borderRadius = CSSVariableManager.get('--border-radius-md', '8px');
            const shadow = CSSVariableManager.get('--color-shadow', 'rgba(0, 0, 0, 0.05)');

            canvasElement.style.backgroundColor = backgroundColor;
            canvasElement.style.border = `1px solid ${borderColor}`;
            canvasElement.style.borderRadius = borderRadius;
            canvasElement.style.boxShadow = `0 2px 4px ${shadow}`;
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'CanvasManager',
                method: 'applyBaseStyles'
            });
        }
    }

    optimizeCanvasContext(canvasElement) {
        const originalGetContext = canvasElement.getContext.bind(canvasElement);
        
        canvasElement.getContext = (contextType, attributes = {}) => {
            try {
                if (contextType === '2d') {
                    attributes.willReadFrequently = true;
                    
                    // Additional optimizations for 2D context
                    const ctx = originalGetContext(contextType, attributes);
                    if (ctx) {
                        // Enable image smoothing for better text rendering
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                    }
                    return ctx;
                }
                return originalGetContext(contextType, attributes);
            } catch (error) {
                ErrorManager.getInstance().handleError(error, {
                    component: 'CanvasManager',
                    method: 'optimizeCanvasContext'
                });
                canvasElement.classList.add('canvas-container--error');
                return null;
            }
        };
    }

    setupHighDPI(canvasElement) {
        const dpr = window.devicePixelRatio || 1;
        
        if (dpr > 1) {
            canvasElement.classList.add('canvas--hidpi');
            
            const updateCanvasScale = () => {
                const rect = canvasElement.getBoundingClientRect();
                canvasElement.width = rect.width * dpr;
                canvasElement.height = rect.height * dpr;
                
                const ctx = canvasElement.getContext('2d');
                if (ctx) {
                    ctx.scale(dpr, dpr);
                }
            };

            // Update on resize
            const resizeObserver = new ResizeObserver(updateCanvasScale);
            resizeObserver.observe(canvasElement);
            
            // Store observer for cleanup
            canvasElement._resizeObserver = resizeObserver;
        }
    }

    cleanupCanvas(canvasElement) {
        if (canvasElement._resizeObserver) {
            canvasElement._resizeObserver.disconnect();
            delete canvasElement._resizeObserver;
        }
        
        this.canvasElements.delete(canvasElement);
    }

    restore() {
        if (this.originalCreateElement) {
            document.createElement = this.originalCreateElement;
            this.originalCreateElement = null;
        }
    }

    destroy() {
        // Cleanup all tracked canvases
        this.canvasElements.forEach(canvas => {
            this.cleanupCanvas(canvas);
        });
        this.canvasElements.clear();
        
        // Restore original createElement
        this.restore();
    }
} 