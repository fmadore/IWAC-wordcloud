import { getTranslations } from '../utils/translations.js';

export class Tooltip {
    constructor() {
        this.tooltip = this.createTooltipElement();
        this.translations = getTranslations();
    }

    createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
        return tooltip;
    }

    show(event, data) {
        const content = this.formatContent(data);
        this.tooltip.innerHTML = content;
        this.tooltip.style.opacity = 0.9;
        
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

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    hide() {
        this.tooltip.style.opacity = 0;
    }

    formatContent(data) {
        const { text, originalSize, rank } = data;
        let content = `<div class="tooltip-content">`;
        content += `<div class="tooltip-row"><span>#${rank}</span> <strong>${text}</strong></div>`;
        content += `<div class="tooltip-row"><span>${this.translations.frequency}:</span> <strong>${originalSize}</strong></div>`;
        content += `</div>`;
        return content;
    }

    destroy() {
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
} 