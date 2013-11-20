function GrayBit(canvas, pixelWidth, pixelHeight, scale) {
    var ctx = canvas.getContext('2d');

    canvas.width = pixelWidth * scale;
    canvas.height = pixelHeight * scale;

    var colors = [
        '#3C3C00',
        '#69693C',
        '#969669',
        '#C3C396'
    ]

    this.setPixel = function setPixel(x, y, color) {
        ctx.fillStyle = colors[color];
        ctx.fillRect(x * scale, y * scale, scale, scale);
    }
};