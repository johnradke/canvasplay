function Point (x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

function CanvasProxy(canvas) {
    var isMouseDown = false;
    var mousePos = null;
    var context = canvas.getContext('2d');
    var self = this;

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

    function getPoint(x, y) {
        if (x instanceof Point)
            return [x.x, x.y];

        return [x, y];
    }

    this.moveTo = function(x, y) {
        context.moveTo.apply(context, getPoint(x, y));
    };

    this.lineTo = function(x, y) {
        context.lineTo.apply(context, getPoint(x, y));
        context.stroke();
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