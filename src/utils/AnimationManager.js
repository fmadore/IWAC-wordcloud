import { ConfigManager } from '../config/ConfigManager.js';

export class AnimationManager {
    static get config() {
        return ConfigManager.getInstance().getAnimationConfig();
    }

    static wordEnter(element, size) {
        const { duration, scaleOnHover } = this.config;
        d3.select(element)
            .transition()
            .duration(duration)
            .style("font-size", `${size * scaleOnHover}px`)
            .style("font-weight", "bold");
    }

    static wordExit(element, size) {
        const { duration } = this.config;
        d3.select(element)
            .transition()
            .duration(duration)
            .style("font-size", `${size}px`)
            .style("font-weight", "normal");
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