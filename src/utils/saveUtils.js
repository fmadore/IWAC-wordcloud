/**
 * Converts an SVG element to a PNG and triggers download
 * @param {SVGElement} svg - The SVG element to convert
 */
export function saveAsPNG(svg) {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    
    // Add namespaces
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    
    // Add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    
    // Convert svg source to URI data scheme
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const scale = 2; // Increase this value for higher resolution
        canvas.width = svg.width.baseVal.value * scale;
        canvas.height = svg.height.baseVal.value * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'word_cloud.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    img.src = url;
} 