import { WordCloudRenderer } from './Renderer.js';
import { WordCloudLayoutManager } from './LayoutManager.js';
import { DimensionManager } from '../../utils/DimensionManager.js';
import { CanvasManager } from '../../utils/CanvasManager.js';
import { StyleManager } from '../../utils/StyleManager.js';
import { ConfigManager } from '../../config/ConfigManager.js';
import { WordStyleManager } from '../../utils/WordStyleManager.js';
import { AppStore } from '../../store/AppStore.js';
import { EventBus } from '../../events/EventBus.js';
import { WORDCLOUD_EVENTS, LAYOUT_EVENTS, ANIMATION_EVENTS } from '../../events/EventTypes.js';

export class WordCloud {
    constructor(containerId, options = {}) {
        this.container = typeof containerId === 'string' ? 
            document.getElementById(containerId.replace('#', '')) : 
            containerId;

        if (!this.container) {
            throw new Error('Container element not found');
        }

        this.config = ConfigManager.getInstance();
        this.store = AppStore.getInstance();
        this.eventBus = EventBus.getInstance();
        
        this.initializeConfig(options);
        StyleManager.setupContainer(this.container);
        this.setupManagers();
        this.setupEventHandlers();
        
        // Subscribe to store updates
        this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));
    }

    initializeConfig(options) {
        Object.entries(options).forEach(([key, value]) => {
            this.config.set(`wordcloud.${key}`, value);
        });
    }

    setupManagers() {
        this.dimensionManager = new DimensionManager(this.container);
        this.canvasManager = new CanvasManager();
        this.renderer = new WordCloudRenderer(this.container);
        this.layoutManager = new WordCloudLayoutManager();
    }

    setupEventHandlers() {
        // Handle dimension changes
        this.dimensionManager.subscribe(dimensions => {
            this.eventBus.emit(LAYOUT_EVENTS.DIMENSION_CHANGE, { dimensions });
            this.store.updateDimensions(dimensions);
            this.layoutManager.updateDimensions(dimensions);
            this.renderer.updateDimensions(dimensions.width, dimensions.height);
            
            const state = this.store.getState();
            if (state.currentWords.length > 0) {
                this.redraw();
            }
        });

        // Handle word interactions
        this.eventBus.on(WORDCLOUD_EVENTS.WORD_HOVER, async ({ word, event }) => {
            await this.eventBus.emit(ANIMATION_EVENTS.TRANSITION_START, { type: 'hover', word });
            this.wordList?.highlightWord(word.text);
        });

        this.eventBus.on(WORDCLOUD_EVENTS.WORD_CLICK, ({ word, event }) => {
            // Handle word click interactions
            console.log('Word clicked:', word);
        });

        // Handle layout events
        this.eventBus.on(LAYOUT_EVENTS.CALCULATE_START, () => {
            // Could show loading indicator or prepare for layout
        });

        this.eventBus.on(LAYOUT_EVENTS.CALCULATE_COMPLETE, ({ words }) => {
            this.draw(words);
        });
    }

    handleStateChange(newState, oldState) {
        if (
            newState.currentWords !== oldState.currentWords ||
            newState.dimensions !== oldState.dimensions
        ) {
            this.redraw();
        }
    }

    setWordList(wordList) {
        this.wordList = wordList;
        this.renderer.setWordList(wordList);
    }

    async redraw() {
        try {
            await this.eventBus.emit(LAYOUT_EVENTS.CALCULATE_START);
            const state = this.store.getState();
            const words = await this.layoutManager.layoutWords(state.currentWords);
            
            // Emit transition start event before drawing
            await this.eventBus.emit(ANIMATION_EVENTS.TRANSITION_START, { 
                type: 'update',
                oldWords: state.currentWords,
                newWords: words
            });
            
            const rankedWords = WordStyleManager.addRankInformation(words);
            this.draw(rankedWords);
            
            // Emit transition complete event after drawing
            await this.eventBus.emit(ANIMATION_EVENTS.TRANSITION_COMPLETE, { words: rankedWords });
            
            return rankedWords;
        } catch (error) {
            console.error('Error redrawing word cloud:', error);
            throw error;
        }
    }

    draw(words) {
        if (!words || words.length === 0) return words;
        
        const svg = this.renderer.createSVG();
        const wordGroup = this.renderer.createWordGroup(svg);
        this.renderer.renderWords(wordGroup, words);
        return words;
    }

    async update(country, wordCount) {
        try {
            const words = await this.store.updateWordCloud(country, wordCount);
            return words;
        } catch (error) {
            console.error('Error updating word cloud:', error);
            throw error;
        }
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.dimensionManager.destroy();
        this.canvasManager.destroy();
        this.renderer.clear();
        
        // Clean up event listeners
        this.eventBus.off(WORDCLOUD_EVENTS.WORD_HOVER);
        this.eventBus.off(WORDCLOUD_EVENTS.WORD_CLICK);
        this.eventBus.off(LAYOUT_EVENTS.CALCULATE_START);
        this.eventBus.off(LAYOUT_EVENTS.CALCULATE_COMPLETE);
    }
} 