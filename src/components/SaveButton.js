import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class SaveButton {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('SaveButton: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.translations = getTranslations();
        this._onClick = null;
        
        this.init();
    }

    init() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const button = document.createElement('button');
        button.id = 'saveButton';
        button.className = 'save-button';
        button.setAttribute('aria-label', this.translations.saveAsPNG);

        // Create icon element
        const icon = document.createElement('span');
        icon.className = 'save-icon';
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 11V14.5H2.5V11H1V14.5C1 15.33 1.67 16 2.5 16H13.5C14.33 16 15 15.33 15 14.5V11H13.5Z" fill="currentColor"/>
                <path d="M8.75 11.19L12.22 7.72L11.28 6.78L8.75 9.31V0H7.25V9.31L4.72 6.78L3.78 7.72L7.25 11.19C7.44 11.38 7.69 11.47 7.94 11.47C8.19 11.47 8.44 11.38 8.63 11.19H8.75Z" fill="currentColor"/>
            </svg>
        `;

        // Create text element
        const text = document.createElement('span');
        text.className = 'button-text';
        text.textContent = this.translations.saveAsPNG;

        button.appendChild(icon);
        button.appendChild(text);

        // Add event listener
        button.addEventListener('click', () => {
            if (this._onClick) {
                this._onClick();
            }
        });

        buttonContainer.appendChild(button);
        this.container.appendChild(buttonContainer);
    }

    getExportConfig() {
        return this.config.getExportConfig();
    }

    set onClick(handler) {
        this._onClick = handler;
    }
} 