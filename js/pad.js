var mind = {
    "meta": {
        "name": "demo",
        "author": "hizzgdev@163.com",
        "version": "0.2",
    },
    "format": "node_array",
    "data": [{
            "id": "root",
            "isroot": true,
            "topic": "jsMind"
        },

        {
            "id": "sub1",
            "parentid": "root",
            "topic": "sub1",
            "background-color": "#0000ff",
            "editable": false
        },
        {
            "id": "sub2",
            "parentid": "sub1",
            "topic": "sub2",
            "background-color": "#0000ff",
            "editable": true
        }
    ]
};
var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary'
}
var jm = jsMind.show(options, mind), root = jm.get_root();

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    var $e = $(e.target),
        _text = $e.text();
    if (_text && _text != '') {
        e.dataTransfer.setData("Text", _text);
    }
}

function end(e) {
    var $e = $(e.target);
    if (jm.get_node($e.text())) {
        $e.remove();
    } else {
        alert('请移动到目标节点区域')
    }
}

function addNode(name) {
    var _node = jm.get_selected_node(); // as parent of new node
    if (!_node) {
        _node = jm.get_root();
    }
    jm.add_node(_node, name, name);
}

function getAllNodes(node, arr) {
    if (!node.children.length) {
        return arr;
    } else {
        $.each(node.children, function(index, val) {
            arr.push(val);
            getAllNodes(val, arr);
        })
    }
    return arr;
}

function drop(e) {
    e.preventDefault();
    var name = e.dataTransfer.getData("Text");
    var x = e.pageX,
        y = e.pageY,
        list = [root];
    var all_nodes = getAllNodes(root, list);
    if (all_nodes.length == 1) {
        addNode(name);
    } else {
        $.each(all_nodes, function(index, val) {
            var $e = $(val._data.view.element);
            var offsetX1 = $e.offset().left;
            var offsetX2 = $e.offset().left + $e.outerWidth();
            var offsetY1 = $e.offset().top;
            var offsetY2 = $e.offset().top + $e.outerHeight();
            if (offsetX1 < x && x < offsetX2 && offsetY1 < y && y < offsetY2) {
                jm.add_node(val, name, name)
            }
        })
    }
    // if (name) {
    //     addNode(name);
    // }
}

$(document.body).on('click', '.reset', function() {
    location.reload();
})

$(document.body).on('click', '.upload-btn', function(e) {
    var _node = jm.get_selected_node();
    if (!_node) {
        alert('请选择一个节点')
    } else {
        // jm.remove_node(_node);
    }
})

$(document.body).on('click', '.showdata', function() {
    console.log(jm.get_data('node_array'))
})
