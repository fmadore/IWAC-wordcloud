import { ErrorManager } from './ErrorManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';

export class ElementClassManager {
    static setupContainer(container) {
        try {
            container.classList.add('wordcloud-container');
            this.setupBaseStyles(container);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupContainer'
            });
        }
    }

    static setupWrapper(wrapper) {
        try {
            wrapper.classList.add('wordcloud-wrapper');
            wrapper.id = 'wordcloud';
            this.setupBaseStyles(wrapper);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupWrapper'
            });
        }
    }

    static setupSVG(svg) {
        try {
            svg
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("version", "1.1");
                
            this.setupSVGStyles(svg);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupSVG'
            });
        }
    }

    static setupBaseStyles(element) {
        try {
            element.style.backgroundColor = CSSVariableManager.getColor('--color-background');
            element.style.color = CSSVariableManager.getColor('--color-text-primary');
            element.style.fontFamily = CSSVariableManager.get('--font-base');
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupBaseStyles'
            });
        }
    }

    static setupSVGStyles(svg) {
        try {
            svg.style("font-family", CSSVariableManager.get('--font-base'));
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupSVGStyles'
            });
        }
    }
} 