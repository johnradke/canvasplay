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