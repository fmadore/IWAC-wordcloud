import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';
import { ErrorManager } from './ErrorManager.js';

export class AnimationManager {
    static get config() {
        return ConfigManager.getInstance().getAnimationConfig();
    }

    static wordEnter(element, size) {
        try {
            const el = d3.select(element);
            const currentTransform = el.attr("transform");
            const [x, y, rotate] = this._parseTransform(currentTransform);
            const scale = CSSVariableManager.getNumber('--wordcloud-hover-scale', 1.2);
            
            el.classed('word--hover', true)
              .style("font-weight", "bold")
              .attr("transform", `translate(${x},${y})scale(${scale})rotate(${rotate})`);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'AnimationManager',
                method: 'wordEnter'
            });
        }
    }

    static wordExit(element, size) {
        try {
            const el = d3.select(element);
            const currentTransform = el.attr("transform");
            const [x, y, rotate] = this._parseTransform(currentTransform);
            
            el.classed('word--hover', false)
              .style("font-weight", "normal")
              .attr("transform", `translate(${x},${y})scale(1)rotate(${rotate})`);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'AnimationManager',
                method: 'wordExit'
            });
        }
    }

    static _parseTransform(transform) {
        if (!transform) return [0, 0, 0];
        
        const translateMatch = transform.match(/translate\(([-\d.]+),([-\d.]+)\)/);
        const rotateMatch = transform.match(/rotate\(([-\d.]+)\)/);
        
        const x = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const y = translateMatch ? parseFloat(translateMatch[2]) : 0;
        const rotate = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
        
        return [x, y, rotate];
    }

    static setupWordInteractions(wordElements, tooltip) {
        try {
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
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'AnimationManager',
                method: 'setupWordInteractions'
            });
        }
    }

    static setupTransitions(wordElements) {
        wordElements.classed('word', true);
    }

    static morphTransition(wordElements, oldData, newData) {
        try {
            const duration = CSSVariableManager.getNumber('--transition-normal', 300);
            
            // Exit animation
            wordElements.exit()
                .style("animation", `wordExit ${duration}ms forwards`)
                .remove();

            // Enter animation
            const enterElements = wordElements.enter()
                .append("text")
                .classed('word', true)
                .style("animation", `wordEnter ${duration}ms forwards`);

            // Update positions
            wordElements.merge(enterElements)
                .style("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'AnimationManager',
                method: 'morphTransition'
            });
        }
    }

    static particleEffect(container, word, type = 'exit') {
        try {
            const numParticles = CSSVariableManager.getNumber('--wordcloud-particle-count', 10);
            const duration = CSSVariableManager.getNumber('--wordcloud-particle-duration', 600);
            const colors = CSSVariableManager.getColorScheme().slice(0, 4);
            
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
                particle.style.animation = `particleExpand ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'AnimationManager',
                method: 'particleEffect'
            });
        }
    }

    static physicsAnimation(wordElements, type = 'enter') {
        try {
            wordElements
                .classed(`word--physics-${type}`, true)
                .on('animationend', function() {
                    d3.select(this).classed(`word--physics-${type}`, false);
                });
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'AnimationManager',
                method: 'physicsAnimation'
            });
        }
    }
} 