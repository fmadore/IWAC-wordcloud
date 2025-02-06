export class WordCloudRenderer {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.svg = null;
        this.wordGroup = null;
    }

    createSVG() {
        this.clear();
        
        // Create wrapper div for better control
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'relative';
        this.container.appendChild(wrapper);
        
        this.svg = d3.select(wrapper)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("position", "absolute")
            .style("top", "0")
            .style("left", "0")
            .style("background", "transparent")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${this.options.width} ${this.options.height}`);

        return this.svg;
    }

    createWordGroup(svg) {
        this.wordGroup = svg.append("g")
            .attr("transform", `translate(${this.options.width / 2},${this.options.height / 2})`);
        return this.wordGroup;
    }

    updateDimensions(width, height) {
        if (!width || !height) return;
        
        this.options.width = width;
        this.options.height = height;

        if (this.svg) {
            this.svg
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("width", "100%")
                .attr("height", "100%");
        }
        
        if (this.wordGroup) {
            this.wordGroup.attr("transform", `translate(${width / 2},${height / 2})`);
        }
    }

    renderWords(wordGroup, words) {
        if (!words || words.length === 0) return;

        const tooltip = d3.select("#tooltip");
        
        // Remove existing words
        wordGroup.selectAll("text").remove();

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
        // Remove all SVG elements
        if (this.container) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
        this.svg = null;
        this.wordGroup = null;
    }
} 