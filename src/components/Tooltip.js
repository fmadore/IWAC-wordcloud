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
        const tooltipWidth = this.tooltip.offsetWidth;
        const tooltipHeight = this.tooltip.offsetHeight;
        
        let left = event.pageX + 10;
        let top = event.pageY - tooltipHeight - 10;

        // Adjust position if tooltip would go off screen
        if (left + tooltipWidth > window.innerWidth) {
            left = event.pageX - tooltipWidth - 10;
        }
        if (top < 0) {
            top = event.pageY + 10;
        }

        // Set position before making visible
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
        
        // Make tooltip visible using RAF for better performance
        requestAnimationFrame(() => {
            if (this.tooltip) {
                this.tooltip.classList.add('visible');
            }
        });
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