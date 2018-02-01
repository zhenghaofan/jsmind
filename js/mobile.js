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

function addNode(name, e) {
    var _node = jm.get_selected_node();
    if (!_node) {
        _node = jm.get_root();
    }
    if (jm.add_node(_node, name, name)) {
        $(e.target).remove();
    }
}

function touching(e) {
    e.preventDefault();
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

function move(e) {
    e.preventDefault();
    var list = [root], name = $(e.target).text();
    var x = e.changedTouches[0].pageX;
    var y = e.changedTouches[0].pageY;
    var all_nodes = getAllNodes(root, list);
    if (all_nodes.length == 1) {
        addNode(name, e);
    } else {
        $.each(all_nodes, function(index, val) {
            var $e = $(val._data.view.element);
            var offsetX1 = $e.offset().left;
            var offsetX2 = $e.offset().left + $e.outerWidth();
            var offsetY1 = $e.offset().top;
            var offsetY2 = $e.offset().top + $e.outerHeight();
            if (offsetX1 < x && x < offsetX2 && offsetY1 < y && y < offsetY2) {
                jm.add_node(val, name, name);
                $(e.target).remove();
            }
        })
    }
    
    //检测是否在div内
    // var jsmind_area = document.getElementById('jsmind_container');
    // var divx1 = jsmind_area.offsetLeft;
    // var divy1 = jsmind_area.offsetTop;
    // var divx2 = jsmind_area.offsetLeft + jsmind_area.offsetWidth;
    // var divy2 = jsmind_area.offsetTop + jsmind_area.offsetHeight;
    // if (divx1 < x && x < divx2 && divy1 < y && y < divy2) {
    //     addNode(name, e);
    // }
}
$(document.body).on('click', '.reset', function() {
    location.reload();
})
$(document.body).on('click', '.showdata', function() {
    console.log(jm.get_data('node_array'))
})
