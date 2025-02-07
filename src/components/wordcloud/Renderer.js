import { Tooltip } from '../Tooltip.js';

export class WordCloudRenderer {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.svg = null;
        this.wordGroup = null;
        this.tooltip = new Tooltip();
    }

    createSVG() {
        this.clear();
        
        // Create wrapper div for better control
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        this.container.appendChild(wrapper);
        
        this.svg = d3.select(wrapper)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("position", "relative")
            .style("display", "block")
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
            this.svg.attr("viewBox", `0 0 ${width} ${height}`);
        }
        
        if (this.wordGroup) {
            this.wordGroup.attr("transform", `translate(${width / 2},${height / 2})`);
        }
    }

    renderWords(wordGroup, words) {
        if (!words || words.length === 0) return;
        
        // Remove existing words
        wordGroup.selectAll("text").remove();

        // Add rank information to each word
        const wordsWithRank = words.map((word, index) => ({
            ...word,
            rank: index + 1
        }));

        return wordGroup.selectAll("text")
            .data(wordsWithRank)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => d3.schemeCategory10[~~(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text)
            .on("mouseover", (event, d) => {
                this.tooltip.show(event, d);
                this.animateWordEnter(event.target, d);
            })
            .on("mouseout", (event, d) => {
                this.tooltip.hide();
                this.animateWordExit(event.target, d);
            });
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

    clear() {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        if (this.container) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
        this.svg = null;
        this.wordGroup = null;
    }
} 