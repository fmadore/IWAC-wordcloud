export class WordCloudRenderer {
    constructor(container, options) {
        this.container = container;
        this.options = options;
    }

    createSVG() {
        return d3.select(this.container)
            .append("svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .style("background", "transparent")
            .style("width", "100%")
            .style("height", "100%")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${this.options.width} ${this.options.height}`);
    }

    createWordGroup(svg) {
        return svg.append("g")
            .attr("transform", `translate(${this.options.width / 2},${this.options.height / 2})`);
    }

    renderWords(wordGroup, words) {
        const tooltip = d3.select("#tooltip");

        return wordGroup.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => d3.schemeCategory10[~~(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text)
            .on("mouseover", (event, d) => this.handleMouseOver(event, d, tooltip))
            .on("mouseout", (event, d) => this.handleMouseOut(event, d, tooltip));
    }

    handleMouseOver(event, d, tooltip) {
        this.animateWordEnter(event.target, d);
        this.showTooltip(event, d, tooltip);
    }

    handleMouseOut(event, d, tooltip) {
        this.animateWordExit(event.target, d);
        this.hideTooltip(tooltip);
    }

    animateWordEnter(element, d) {
        d3.select(element)
            .transition()
            .duration(200)
            .style("font-size", `${d.size * 1.2}px`)
            .style("font-weight", "bold");
    }

    animateWordExit(element, d) {
        d3.select(element)
            .transition()
            .duration(200)
            .style("font-size", `${d.size}px`)
            .style("font-weight", "normal");
    }

    showTooltip(event, d, tooltip) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            
        const tooltipText = this.getTooltipText(d);
        this.positionTooltip(tooltip, tooltipText, event);
    }

    hideTooltip(tooltip) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    getTooltipText(d) {
        let text = `${d.text}: ${d.originalSize}`;
        if (d.countries) {
            text += `\nCountries: ${d.countries.join(', ')}`;
        }
        return text;
    }

    positionTooltip(tooltip, text, event) {
        tooltip.html(text)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    clear() {
        if (this.container) {
            d3.select(this.container).select("svg").remove();
        }
    }
} 