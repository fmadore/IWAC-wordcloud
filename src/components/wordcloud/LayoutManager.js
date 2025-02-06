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
        
        if (this.layout) {
            this.layout.size([width, height]);
        }
    }

    calculateDimensions(container) {
        // Get the actual dimensions of the container
        const rect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        
        // Account for padding and borders
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        // Calculate available space
        const availableWidth = rect.width - paddingX;
        const availableHeight = rect.height - paddingY;
        
        // Calculate dimensions while maintaining aspect ratio
        const minWidth = 300;
        const maxWidth = Math.max(availableWidth, minWidth);
        const maxHeight = Math.min(window.innerHeight * 0.7, 800);
        
        let width = maxWidth;
        let height = Math.min(width * 0.75, maxHeight);
        
        // Ensure minimum dimensions
        width = Math.max(width, minWidth);
        height = Math.max(height, minWidth * 0.75);
        
        return { width, height };
    }

    async layoutWords(words) {
        if (!words || words.length === 0) return [];
        
        return new Promise((resolve, reject) => {
            try {
                this.layout
                    .size([this.options.width, this.options.height])
                    .words(words)
                    .fontSize(d => Math.min(d.size, this.options.height / 8)) // Limit maximum font size
                    .on("end", resolve)
                    .start();
            } catch (error) {
                console.error('Error in layout:', error);
                reject(error);
            }
        });
    }
} 