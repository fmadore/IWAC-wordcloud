import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';

export class AnimationManager {
    static get config() {
        return ConfigManager.getInstance().getAnimationConfig();
    }

    static wordEnter(element, size) {
        const { scaleOnHover } = this.config;
        const scaledSize = FontManager.scaleFont(size, scaleOnHover);
        
        const el = d3.select(element);
        el.classed('word--hover', true);
        FontManager.applyFontStyles(el, scaledSize, 'bold');
    }

    static wordExit(element, size) {
        const el = d3.select(element);
        el.classed('word--hover', false);
        FontManager.applyFontStyles(el, size, 'normal');
    }

    static setupWordInteractions(wordElements, tooltip) {
        wordElements
            .classed('word', true)
            .on("mouseover", (event, d) => {
                tooltip.show(event, d);
                this.wordEnter(event.target, d.size);
            })
            .on("mouseout", (event, d) => {
                tooltip.hide();
                this.wordExit(event.target, d.size);
            });
    }

    static setupTransitions(wordElements) {
        wordElements.classed('word', true);
    }

    static morphTransition(wordElements, oldData, newData) {
        // Exit animation
        wordElements.exit()
            .style("animation", "wordExit var(--transition-normal) forwards")
            .remove();

        // Enter animation
        const enterElements = wordElements.enter()
            .append("text")
            .classed('word', true)
            .style("animation", "wordEnter var(--transition-normal) forwards");

        // Update positions
        wordElements.merge(enterElements)
            .style("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`);
    }

    static particleEffect(container, word, type = 'exit') {
        const numParticles = 10;
        const colors = ['#ffb703', '#fb8500', '#e76f51', '#2a9d8f'];
        
        const rect = word.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (i / numParticles) * Math.PI * 2;
            const distance = 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--particle-x', `${x}px`);
            particle.style.setProperty('--particle-y', `${y}px`);
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            container.appendChild(particle);
            
            particle.addEventListener('animationend', () => particle.remove());
            particle.style.animation = `particleExpand 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        }
    }

    static physicsAnimation(wordElements, type = 'enter') {
        wordElements
            .classed(`word--physics-${type}`, true)
            .on('animationend', function() {
                d3.select(this).classed(`word--physics-${type}`, false);
            });
    }
} 