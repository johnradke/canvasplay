function Point (x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

Point.prototype.equals = function (other) {
    return other && this.x === other.x && this.y === other.y;
}

function CanvasProxy(canvas, options) {
    var options = options || {};
    var isMouseDown = false;
    var mousePos = null;
    var context = canvas.getContext('2d');
    var self = this;
    var translate = new Point(0, 0);

    if (options.fillScreen) {
        function fill() {
            canvas.width = document.body.clientWidth;
            canvas.height= document.body.clientHeight;
            setOrigin();
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

    function setOrigin() {
        if (options.centerOrigin) {
            translate = new Point(canvas.width / 2, canvas.height / 2);
            context.translate(translate.x, translate.y);
        }
    }

    this.lineWidth = 1;

    this.clear = function() {
        context.translate(-translate.x, -translate.y);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.translate(translate.x, translate.y);
    }

    canvas.onmousemove = function(evt) {
        mousePos = new Point(evt.offsetX - translate.x, evt.offsetY - translate.y)
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

    this.drawLine = function(x1, y1, x2, y2) {
        this.drawPath([new Point(x1, y1), new Point(x2, y2)])
    }

    this.withScale = function(x, y, fn) {
        context.save();
        context.scale(x, y);
        fn();
        context.restore();
    };

    this.withTransform = function(array, fn) {
        context.save();
        context.transform.apply(context, array);
        fn();
        context.restore();
    };

    this.withRotate = function(degrees, fn) {
        context.save();
        context.rotate(degrees*Math.PI/180);
        fn();
        context.restore();
    };

    this.drawPath = function(path) {
        context.beginPath();
        context.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y);
        }
        context.lineWidth = this.lineWidth;
        context.stroke();
    };

    this.width = function() {
        return canvas.width;
    };

    this.height = function() {
        return canvas.height;
    };
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