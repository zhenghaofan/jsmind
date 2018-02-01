var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary'
}
var mind = {
    meta: {
        name: 'demo',
        author: 'hizzgdev@163.com',
        version: '0.2'
    },
    format: 'node_array',
    data: [{
            "id": "root",
            "isroot": true,
            "topic": "根节点"
        },

        {
            "id": "sub1",
            "parentid": "root",
            "topic": "节点1"
        },
        {
            "id": "sub11",
            "parentid": "sub1",
            "topic": "子节点1",
            "data" : {
                "img": "http://images2015.cnblogs.com/blog/894693/201608/894693-20160809174336606-1983374129.png",
                "ppt": "http://aaa.ppt",
                "pdf": "http://aaa.pdf"
            }
        },
        {
            "id": "sub12",
            "parentid": "sub1",
            "topic": "子节点2"
        },
        {
            "id": "sub13",
            "parentid": "sub1",
            "topic": "子节点3",
            "data" : {
                "doc": "http://aaa.doc"
            }
        },

        {
            "id": "sub2",
            "parentid": "root",
            "topic": "节点2"
        },
        {
            "id": "sub21",
            "parentid": "sub2",
            "topic": "子节点1"
        },
        {
            "id": "sub22",
            "parentid": "sub2",
            "topic": "子节点2"
        },

        {
            "id": "sub3",
            "parentid": "root",
            "topic": "节点3"
        },
    ]
};
var jm = jsMind.show(options, mind),
    root = jm.get_root();
var initialHeight = $('.theme-primary').height();
// $('.root').css('left', '10px')
// var list = [root];
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
                checkZoomout();
            }
        })
    }
    // if (name) {
    //     addNode(name);
    // }
}
function isExist(name) {
    var _exist = false, reg = new RegExp('^' + name + '$', "g")
    $('.tag').each(function(index, val) {
        if (!!$(val).text().match(reg)) {
            _exist = true;
        }
    });
    return _exist;
}

function createNode(name) {
    if (isExist(name) || jm.get_node(name)) {
        alert('节点已存在');
        return;
    } else {
        var html = '<button class="btn btn-default tag" draggable="true" ondragstart="drag(event)" ondragend="end(event)">' + name + '</button>';
        $('.nodes').append(html);
        // $('.child-nodes').show();
    }
}

function addNode(name) {
    var _node = jm.get_selected_node(); // as parent of new node
    if (!_node) {
        _node = jm.get_root();
    }
    jm.add_node(_node, name, name);
}

function checkZoomout() {
    if ($('.theme-primary').height() > initialHeight) {
        jm.view.zoomOut();
        initialHeight = $('.theme-primary').height()
    }
}

function checkZoomin() {
    if ($('.theme-primary').height() < initialHeight) {
        jm.view.zoomIn();
        initialHeight = $('.theme-primary').height()
    }
}

function createExtraHtml(el) {
    console.log(el);
    // return ''
}

$(document.body).on('click', '.add-node', function(e) {
    $('.nodes > button').removeClass('node');
    var node_name = prompt('请输入节点名');
    if (node_name) {
        createNode(node_name);
    }
});

$(document.body).on('click', '.del-node', function(e) {
    var _node = jm.get_selected_node();
    if (!_node) {
        alert('请选择一个节点')
    } else if (_node == jm.get_root()) {
        alert('不能删除根节点')
    } else {
        jm.remove_node(_node);
        checkZoomin()
    }
})

$(document.body).on('click', '.upload-btn', function(e) {
    var _node = jm.get_selected_node();
    if (!_node) {
        alert('请选择一个节点')
    } else {
        // jm.remove_node(_node);
    }
})

$(document.body).on('click', '.fa-search-plus', function(e) {
    jm.view.zoomIn();
})

$(document.body).on('click', '.fa-search-minus', function(e) {
    jm.view.zoomOut();
})
// $.contextMenu({
//     selector: 'jmnode',
//     callback: function(key, options) {
//         var m = "clicked: " + key;
//         alert(m);
//     },
//     items: {
//         "upload": {
//             name: "上传文件",
//             icon: "fa-image"
//         },
//
//     }
// });

bindExtrasEvent($('.extras'));
//使用背景按钮删除
// $(document.body).on('click', '.del-node', function() {
//     $('.nodes > button').toggleClass('node');
// });
//
// $(document.body).on('click', '.node', function(e) {
//     var $e = $(e.target), name = $e.text();
//     $e.remove();
//     if (jm.get_node(name)) {
//         jm.remove_node(name);
//     }
//     if ($('.nodes').children().length == 0) {
//         $('.child-nodes').hide();
//     }
// })
