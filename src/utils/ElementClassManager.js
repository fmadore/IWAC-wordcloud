export class ElementClassManager {
    static setupContainer(container) {
        container.classList.add('wordcloud-container');
    }

    static setupWrapper(wrapper) {
        wrapper.classList.add('wordcloud-wrapper');
        wrapper.id = 'wordcloud';
    }

    static setupSVG(svg) {
        // Only set attributes that are SVG-specific and not easily handled by CSS
        svg
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("version", "1.1");
    }
} 