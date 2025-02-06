import { config } from '../config/settings.js';
import { processWords, processCombinedData } from '../utils/dataProcessor.js';

export class WordCloud {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { ...config.wordcloud, ...options };
        this.originalCreateElement = document.createElement.bind(document);
        
        // Patch document.createElement before setup
        document.createElement = (tagName) => {
            const element = this.originalCreateElement(tagName);
            if (tagName.toLowerCase() === 'canvas') {
                const originalGetContext = element.getContext.bind(element);
                element.getContext = (contextType, attributes = {}) => {
                    if (contextType === '2d') {
                        attributes.willReadFrequently = true;
                    }
                    return originalGetContext(contextType, attributes);
                };
            }
            return element;
        };
        
        this.setup();
    }

    setup() {
        this.layout = d3.layout.cloud()
            .size([this.options.width, this.options.height])
            .padding(this.options.padding)
            .rotate(() => {
                return Math.random() < this.options.rotationProbability ? 
                    this.options.rotations[Math.floor(Math.random() * this.options.rotations.length)] : 0;
            });
    }

    cleanup() {
        // Restore original createElement
        if (this.originalCreateElement) {
            document.createElement = this.originalCreateElement;
            this.originalCreateElement = null;
        }
    }

    async loadData(country, wordCount) {
        const response = await d3.json(config.paths.getDataPath(country));
        let words;
        
        if (country === 'combined') {
            words = processCombinedData(response);
        } else {
            words = response;
        }
        
        return processWords(words, wordCount);
    }

    draw(words) {
        // Clear previous content
        d3.select(this.container).select("svg").remove();

        const svg = d3.select(this.container)
            .append("svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .style("background", "transparent");

        const tooltip = d3.select("#tooltip");

        const wordGroup = svg.append("g")
            .attr("transform", `translate(${this.options.width / 2},${this.options.height / 2})`)
            .selectAll("text")
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
        d3.select(event.target)
            .transition()
            .duration(200)
            .style("font-size", `${d.size * 1.2}px`)
            .style("font-weight", "bold");

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            
        let tooltipText = `${d.text}: ${d.originalSize}`;
        if (d.countries) {
            tooltipText += `\nCountries: ${d.countries.join(', ')}`;
        }
        
        tooltip.html(tooltipText)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    handleMouseOut(event, d, tooltip) {
        d3.select(event.target)
            .transition()
            .duration(200)
            .style("font-size", `${d.size}px`)
            .style("font-weight", "normal");

        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    async update(country, wordCount) {
        try {
            const words = await this.loadData(country, wordCount);
            this.layout
                .words(words)
                .fontSize(d => d.size)
                .on("end", words => this.draw(words));
            this.layout.start();
        } finally {
            this.cleanup();
        }
    }
} 