function Point (x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

function CanvasProxy(canvas, options) {
    var options = options || {};
    var isMouseDown = false;
    var mousePos = null;
    var context = canvas.getContext('2d');
    var self = this;
    var fillScreen = options.fillScreen || false;

    if (fillScreen) {
        function fill() {
            canvas.width = document.body.clientWidth;
            canvas.height= document.body.clientHeight;
        }

        window.addEventListener('resize', fill, false);

        $.body.style.width = '100%';
        $.body.style.height = '100%';
        $.html.style.width = '100%';
        $.html.style.height = '100%';
        $.body.style.margin = 0;
        $.body.style.overflow = 'hidden';
        canvas.style.display = 'block';
        fill();
    }

    canvas.onmousemove = function(evt) {
        mousePos = new Point(evt.offsetX, evt.offsetY)
        if (typeof(self.onmousemove) === 'function') {
            self.onmousemove(evt);
        }
    };

    canvas.onmousedown = function(evt) {
        isMouseDown = true;
        if (typeof(self.onmousedown) === 'function') {
            self.onmousedown(evt);
        }
    };

    canvas.onmouseup = function(evt) {
        isMouseDown = false;
        if (typeof(self.onmouseup) === 'function') {
            self.onmouseup(evt);
        }
    };

    canvas.onmouseleave = function(evt) {
        isMouseDown = false;
        if (typeof(self.onmouseleave)=== 'function') {
            self.onmouseleave(evt);
        }
    };

    this.isMouseDown = function() {
        return isMouseDown;
    };

    this.getMousePos = function() {
        return mousePos;
    };

    this.moveTo = function(x, y) {
        context.moveTo(x, y);
    }

    this.lineTo = function(x, y) {
        context.lineTo(x, y);
        context.stroke();
    }

    this.width = function() {
        return canvas.width;
    }

    this.height = function() {
        return canvas.height;
    }

    context.beginPath();
}

CanvasProxy.prototype.startAnimation = function() {
    var self = this;

    if (typeof(self.eachFrame) === 'function') {
        (function f() {
            requestAnimationFrame(f);
            self.eachFrame();
        })();
    }
}

CanvasProxy.prototype.drawLine = function(x1, y1, x2, y2) {
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
}