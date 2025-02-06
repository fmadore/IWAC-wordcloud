export class WordCloudLayoutManager {
    constructor(options) {
        this.options = options;
        this.layout = null;
        this.setup();
    }

    setup() {
        this.layout = d3.layout.cloud()
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
    }

    calculateDimensions(container) {
        const containerRect = container.getBoundingClientRect();
        return {
            width: containerRect.width,
            height: Math.min(containerRect.width * 0.75, window.innerHeight * 0.6)
        };
    }

    async layoutWords(words) {
        return new Promise((resolve, reject) => {
            this.layout
                .size([this.options.width, this.options.height])
                .words(words)
                .fontSize(d => d.size)
                .on("end", resolve)
                .start();
        });
    }
} 