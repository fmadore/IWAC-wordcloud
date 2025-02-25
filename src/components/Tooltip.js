import { getTranslations } from '../utils/translations.js';

export class Tooltip {
    constructor({ config } = {}) {
        this.tooltip = null;
        this.config = config;
        this.translations = getTranslations();
        this.init();
    }

    init() {
        try {
            // Remove any existing tooltip
            const existingTooltip = document.getElementById('tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }

            // Create new tooltip
            this.tooltip = this.createTooltipElement();

            // Verify creation was successful
            if (!this.tooltip) {
                console.warn('Failed to create tooltip element');
                return;
            }

            // Add to DOM
            document.body.appendChild(this.tooltip);
        } catch (error) {
            console.error('Error initializing tooltip:', error);
            this.tooltip = null;
        }
    }

    createTooltipElement() {
        try {
            const tooltip = document.createElement('div');
            tooltip.id = 'tooltip';
            tooltip.setAttribute('role', 'tooltip');
            tooltip.setAttribute('aria-hidden', 'true');
            return tooltip;
        } catch (error) {
            console.error('Error creating tooltip element:', error);
            return null;
        }
    }

    show(event, data) {
        // Ensure tooltip exists
        if (!this.tooltip || !document.getElementById('tooltip')) {
            this.init();
        }

        // Safety check
        if (!this.tooltip) {
            console.warn('Tooltip initialization failed');
            return;
        }

        const content = this.formatContent(data);
        this.tooltip.innerHTML = content;
        
        // Position the tooltip
        this.positionTooltip(event);
        
        // Make tooltip visible using RAF for better performance
        requestAnimationFrame(() => {
            if (this.tooltip) {
                this.tooltip.classList.add('visible');
            }
        });
    }

    positionTooltip(event) {
        const tooltipWidth = this.tooltip.offsetWidth;
        const tooltipHeight = this.tooltip.offsetHeight;
        
        // Determine best position for tooltip
        const position = this.calculateBestPosition(event, tooltipWidth, tooltipHeight);
        
        // Set position via CSS custom properties
        this.tooltip.style.setProperty('--tooltip-x', `${position.left}px`);
        this.tooltip.style.setProperty('--tooltip-y', `${position.top}px`);
        
        // Add position class
        this.setPositionClass(position.placement);
    }

    calculateBestPosition(event, tooltipWidth, tooltipHeight) {
        const margin = 10; // Space between cursor and tooltip
        
        // Try to position above cursor
        let placement = 'top';
        let left = event.pageX - (tooltipWidth / 2);
        let top = event.pageY - tooltipHeight - margin;
        
        // Check if tooltip would go off-screen at top
        if (top < 0) {
            // Position below cursor instead
            top = event.pageY + margin;
            placement = 'bottom';
        }
        
        // Check horizontal boundaries
        if (left < margin) {
            left = margin;
            placement += '-left';
        } else if (left + tooltipWidth > window.innerWidth - margin) {
            left = window.innerWidth - tooltipWidth - margin;
            placement += '-right';
        }
        
        return { left, top, placement };
    }

    setPositionClass(placement) {
        // Remove any existing position classes
        this.tooltip.classList.remove(
            'tooltip--top', 
            'tooltip--bottom', 
            'tooltip--top-left', 
            'tooltip--top-right', 
            'tooltip--bottom-left', 
            'tooltip--bottom-right'
        );
        
        // Add the appropriate position class
        this.tooltip.classList.add(`tooltip--${placement}`);
    }

    hide() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    }

    formatContent(data) {
        const { text, originalSize, rank } = data;
        let content = `<div class="tooltip-content">`;
        content += `<div class="tooltip-row"><span>#${rank}</span> <strong>${text}</strong></div>`;
        content += `<div class="tooltip-row"><span>${this.translations.frequency}:</span> <strong>${originalSize}</strong></div>`;
        if (data.countries) {
            content += `<div class="tooltip-row"><span>${this.translations.countries}:</span> <strong>${data.countries.join(', ')}</strong></div>`;
        }
        content += `</div>`;
        return content;
    }

    destroy() {
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }
} 