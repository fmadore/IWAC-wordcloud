export class WordCloudLayoutManager {
    constructor(options) {
        this.options = options;
        this.layout = null;
        this.setup();
    }

    setup() {
        this.layout = d3.layout.cloud()
            .size([this.options.width, this.options.height])
            .padding(this.options.padding)
            .rotate(this.getRotation.bind(this));
    }

    getRotation() {
        return Math.random() < this.options.rotationProbability ? 
            this.options.rotations[Math.floor(Math.random() * this.options.rotations.length)] : 0;
    }

    updateDimensions({ width, height }) {
        this.options.width = width;
        this.options.height = height;
        
        if (this.layout) {
            this.layout.size([width, height]);
        }
    }

    calculateDimensions(container) {
        const rect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        return {
            width: rect.width - paddingX,
            height: rect.height - paddingY
        };
    }

    async layoutWords(words) {
        if (!words || words.length === 0) return [];
        
        return new Promise((resolve, reject) => {
            try {
                const area = this.options.width * this.options.height;
                const wordCount = words.length;
                // Calculate base size considering both area and word count
                const baseSize = Math.sqrt(area / (wordCount * 5));
                
                this.layout
                    .words(words)
                    .fontSize(d => {
                        // Scale the word's relative size by the dynamic base size
                        const scaledSize = baseSize * (d.size / Math.max(...words.map(w => w.size)));
                        // Ensure size stays within reasonable bounds
                        return Math.min(
                            Math.max(scaledSize, this.options.minFontSize || 10),
                            this.options.maxFontSize || this.options.height / 8
                        );
                    })
                    .on("end", resolve)
                    .start();
            } catch (error) {
                console.error('Error in layout:', error);
                reject(error);
            }
        });
    }
} 