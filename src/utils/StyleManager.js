export class StyleManager {
    static setupContainer(container) {
        const styles = {
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            overflow: 'hidden'
        };
        
        Object.assign(container.style, styles);
    }

    static setupWrapper(wrapper) {
        const styles = {
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };
        
        Object.assign(wrapper.style, styles);
    }

    static setupSVG(svg) {
        svg
            .attr("width", "100%")
            .attr("height", "100%")
            .style("position", "relative")
            .style("display", "block")
            .style("background", "transparent")
            .attr("preserveAspectRatio", "xMidYMid meet");
    }
} 