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