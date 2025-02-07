export class WordStyleManager {
    static applyWordStyles(wordElements) {
        wordElements
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => d3.schemeCategory10[~~(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text);
    }

    static addRankInformation(words) {
        return words.map((word, index) => ({
            ...word,
            rank: index + 1
        }));
    }

    static getColorScheme() {
        return d3.schemeCategory10;
    }

    static getRandomColor() {
        const colors = this.getColorScheme();
        return colors[~~(Math.random() * colors.length)];
    }
} 