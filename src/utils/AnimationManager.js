import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';

export class AnimationManager {
    static get config() {
        return ConfigManager.getInstance().getAnimationConfig();
    }

    static wordEnter(element, size) {
        const { duration, scaleOnHover } = this.config;
        const scaledSize = FontManager.scaleFont(size, scaleOnHover);
        
        d3.select(element)
            .transition()
            .duration(duration)
            .call(el => FontManager.applyFontStyles(el, scaledSize, 'bold'));
    }

    static wordExit(element, size) {
        const { duration } = this.config;
        d3.select(element)
            .transition()
            .duration(duration)
            .call(el => FontManager.applyFontStyles(el, size, 'normal'));
    }

    static setupWordInteractions(wordElements, tooltip) {
        wordElements
            .on("mouseover", (event, d) => {
                tooltip.show(event, d);
                this.wordEnter(event.target, d.size);
            })
            .on("mouseout", (event, d) => {
                tooltip.hide();
                this.wordExit(event.target, d.size);
            });
    }
} 