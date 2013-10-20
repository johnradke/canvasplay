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
    var ctx = canvas.getContext('2d');
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
        canvas.style.display = 'block';
        fill();
    }

    function setOrigin() {
        if (options.centerOrigin) {
            translate = new Point(canvas.width / 2, canvas.height / 2);
            ctx.translate(translate.x, translate.y);
        }
    }

    this.lineWidth = 1;

    this.clear = function() {
        ctx.translate(-translate.x, -translate.y);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(translate.x, translate.y);
    }

    canvas.onmousemove = function(evt) {
        mousePos = new Point(evt.clientX - translate.x, evt.clientY - translate.y)
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

    canvas.addEventListener('touchstart', function() {
        isMouseDown = true;
    });

    canvas.addEventListener('touchmove', function(evt) {
        var touch = evt.targetTouches[0];
        mousePos = new Point(touch.pageX - translate.x, touch.pageY - translate.y)
    });

    canvas.addEventListener('touchend', function() {
        isMouseDown = false;
    })

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
        ctx.save();
        ctx.scale(x, y);
        fn();
        ctx.restore();
    };

    this.withTransform = function(array, fn) {
        ctx.save();
        ctx.transform.apply(ctx, array);
        fn();
        ctx.restore();
    };

    this.withRotate = function(degrees, fn) {
        ctx.save();
        ctx.rotate(degrees*Math.PI/180);
        fn();
        ctx.restore();
    };

    this.drawPath = function(path) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    var strokeStyle = '';

    this.setLinearGradient = function() {
        var gradient=ctx.createLinearGradient(-canvas.width / 2, -canvas.height / 2, canvas.width / 2, canvas.height / 2);
        for (var i = 0; i < arguments.length; i ++) {
            var stop = (1.0 / (arguments.length + 1) * (i + 1)).toString();
            gradient.addColorStop(stop, arguments[i]);
        }

        strokeStyle = gradient;
    }

    this.width = function() {
        return canvas.width;
    };

    this.height = function() {
        return canvas.height;
    };
}

CanvasProxy.prototype.startAnimation = function() {
    var self = this;

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    if (typeof(self.eachFrame) === 'function') {
        (function f() {
            requestAnimationFrame(f);
            self.eachFrame();
        })();
    }
}

function rgba(r, g, b, a) {
    return "rgba(" + Array.prototype.join.call(arguments, ", ") + ")";
}