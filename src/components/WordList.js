import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class WordList {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('WordList: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.translations = getTranslations();
        this.words = [];
        this.currentPage = 1;
        this.wordsPerPage = 20;
        this.init();
    }

    init() {
        // Create container div
        const listContainer = document.createElement('div');
        listContainer.className = 'word-list-container';

        // Create header
        const header = document.createElement('div');
        header.className = 'word-list-header';
        header.innerHTML = `<h2>${this.translations.wordList}</h2>`;
        listContainer.appendChild(header);

        // Create list
        const list = document.createElement('div');
        list.className = 'word-list';
        listContainer.appendChild(list);

        // Create pagination
        const pagination = document.createElement('div');
        pagination.className = 'word-list-pagination';
        listContainer.appendChild(pagination);

        this.container.appendChild(listContainer);

        // Store references
        this.listElement = list;
        this.paginationElement = pagination;
    }

    updateWords(words) {
        if (!words || !Array.isArray(words)) {
            console.error('Invalid words data:', words);
            return;
        }
        this.words = words;
        this.currentPage = 1;
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        const startIndex = (this.currentPage - 1) * this.wordsPerPage;
        const endIndex = startIndex + this.wordsPerPage;
        const pageWords = this.words.slice(startIndex, endIndex);

        // Clear current list
        this.listElement.innerHTML = '';

        // Render words
        pageWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-list-item';
            
            const rank = word.rank || startIndex + index + 1;
            const frequency = word.originalSize || word.size;
            
            wordElement.innerHTML = `
                <span class="word-rank">#${rank}</span>
                <span class="word-text">${word.text}</span>
                <span class="word-frequency">${frequency}</span>
            `;
            
            // Add hover effect synchronization
            wordElement.addEventListener('mouseover', () => {
                // Trigger hover effect on corresponding word in cloud
                const cloudWord = document.querySelector(`text[data-word="${word.text}"]`);
                if (cloudWord) {
                    const event = new MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    cloudWord.dispatchEvent(event);
                }
            });
            
            wordElement.addEventListener('mouseout', () => {
                // Remove hover effect
                const cloudWord = document.querySelector(`text[data-word="${word.text}"]`);
                if (cloudWord) {
                    const event = new MouseEvent('mouseout', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    cloudWord.dispatchEvent(event);
                }
            });
            
            this.listElement.appendChild(wordElement);
        });

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.words.length / this.wordsPerPage);
        this.paginationElement.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←';
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.paginationElement.appendChild(prevButton);

        // Page numbers
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `${this.currentPage} / ${totalPages}`;
        this.paginationElement.appendChild(pageInfo);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '→';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.paginationElement.appendChild(nextButton);
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.words.length / this.wordsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderCurrentPage();
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 