var $ = function() {
    var _ids = {};

    function _id (id) {
        if (!(id in _ids)) {
            _ids[id] = document.getElementById(id);
        }

        return _ids[id];
    }

    return {
        id: _id,
        html: document.getElementsByTagName('html')[0],
        body: document.getElementsByTagName('body')[0]
    };
}();

function MaxQueue(maxSize) {
    var start = 0;

    this.Add = function(item) {
        if (this.length == maxSize)
            this.pop();

        this.unshift(item);
    }
}

MaxQueue.prototype = new Array()

Object.defineProperties(Object.prototype, { extend: { enumerable: false, value: function(options) {
    for (var opt in options) {
        Object.defineProperty(this.prototype, opt, { enumerable: false, value: options[opt] });
    }
}}});

Object.extend({
    map: function(func) {
        var newObj = {};
        for (var o in this) {
            newObj[o] = func(this[o]);
        }
        return newObj;
    }
});

Array.extend({
    reduce: function(func) {
        var best = this[0];
        for (var i = 1; i < this.length; i++) {
            best = func(best, this[i]);
        }
        return best;
    }
});
