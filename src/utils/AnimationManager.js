export class AnimationManager {
    static ANIMATION_DURATION = 200;

    static wordEnter(element, size) {
        d3.select(element)
            .transition()
            .duration(this.ANIMATION_DURATION)
            .style("font-size", `${size * 1.2}px`)
            .style("font-weight", "bold");
    }

    static wordExit(element, size) {
        d3.select(element)
            .transition()
            .duration(this.ANIMATION_DURATION)
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