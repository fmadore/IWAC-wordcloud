import { ErrorManager } from './ErrorManager.js';

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
            const style = getComputedStyle(document.documentElement);
            element.style.backgroundColor = style.getPropertyValue('--color-background').trim();
            element.style.color = style.getPropertyValue('--color-text-primary').trim();
            element.style.fontFamily = style.getPropertyValue('--font-base').trim();
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupBaseStyles'
            });
        }
    }

    static setupSVGStyles(svg) {
        try {
            const style = getComputedStyle(document.documentElement);
            svg.style("font-family", style.getPropertyValue('--font-base').trim());
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ElementClassManager',
                method: 'setupSVGStyles'
            });
        }
    }
} 