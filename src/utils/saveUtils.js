import { EventBus } from '../events/EventBus.js';
import { UI_EVENTS } from '../events/EventTypes.js';
import { ErrorManager } from './ErrorManager.js';

/**
 * Converts an SVG element to a PNG and triggers download
 * @param {SVGElement} svg - The SVG element to convert
 */
export class SaveManager {
    static async saveAsPNG(svg) {
        const eventBus = EventBus.getInstance();
        const errorManager = ErrorManager.getInstance();

        try {
            eventBus.emit(UI_EVENTS.SAVE_REQUEST);

            // Get actual values from the UI components
            const countrySelector = document.getElementById('countrySelector');
            const wordCountSlider = document.getElementById('wordCountSlider');
            
            if (!countrySelector || !wordCountSlider) {
                throw new Error('Required UI components not found');
            }

            const country = countrySelector.value;
            const wordCount = wordCountSlider.value;

            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);
            
            // Add namespaces
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            // Get the computed styles
            const styles = getComputedStyle(document.documentElement);
            const fontFamily = styles.getPropertyValue('--font-base').trim();
            
            // Ensure font-family is embedded in the SVG
            if (!source.includes('font-family')) {
                source = source.replace(/<svg/, `<svg style="font-family: ${fontFamily}"`);
            }
            
            // Add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            
            // Convert svg source to URI data scheme
            const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        
                        // Get the computed styles
                        const backgroundColor = styles.getPropertyValue('--color-background').trim() || '#ffffff';
                        
                        // Calculate optimal scale based on SVG size
                        const maxDimension = 4096; // Maximum safe canvas dimension
                        const svgWidth = svg.width.baseVal.value;
                        const svgHeight = svg.height.baseVal.value;
                        const scale = Math.min(
                            Math.floor(maxDimension / svgWidth),
                            Math.floor(maxDimension / svgHeight),
                            4 // Cap at 4x for reasonable file sizes
                        );
                        
                        // Set canvas dimensions with scale
                        canvas.width = svgWidth * scale;
                        canvas.height = svgHeight * scale;
                        
                        // Get the context and configure it
                        const ctx = canvas.getContext('2d');
                        
                        // Set font smoothing
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        
                        // Apply background
                        ctx.fillStyle = backgroundColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Apply scaling
                        ctx.scale(scale, scale);
                        
                        // Set text rendering
                        ctx.textRendering = 'optimizeLegibility';
                        ctx.fontKerning = 'normal';
                        
                        // Draw the image centered
                        ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
                        
                        // Generate filename using actual values from UI
                        const filename = `wordcloud_${country}_${wordCount}words.png`;
                        
                        // Create download link
                        const link = document.createElement('a');
                        link.download = filename;
                        link.href = canvas.toDataURL('image/png', 1.0);
                        link.click();

                        eventBus.emit(UI_EVENTS.SAVE_COMPLETE, {
                            filename,
                            dimensions: { width: svgWidth, height: svgHeight },
                            scale,
                            country,
                            wordCount: parseInt(wordCount)
                        });

                        resolve();
                    } catch (error) {
                        errorManager.handleError(error, {
                            component: 'SaveManager',
                            method: 'saveAsPNG',
                            phase: 'canvas_processing'
                        });
                        eventBus.emit(UI_EVENTS.SAVE_ERROR, { error });
                        reject(error);
                    }
                };
                img.onerror = (error) => {
                    errorManager.handleError(error, {
                        component: 'SaveManager',
                        method: 'saveAsPNG',
                        phase: 'image_loading'
                    });
                    eventBus.emit(UI_EVENTS.SAVE_ERROR, { error });
                    reject(error);
                };
                img.src = url;
            });
        } catch (error) {
            errorManager.handleError(error, {
                component: 'SaveManager',
                method: 'saveAsPNG',
                phase: 'initialization'
            });
            eventBus.emit(UI_EVENTS.SAVE_ERROR, { error });
            throw error;
        }
    }
} 