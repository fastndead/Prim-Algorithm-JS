
var json = {
    "nodes":[
        {"name":"A","group":0,index:0, visited: false},
        {"name":"C","group":0,index:1, visited: false},
        {"name":"B","group":0,index:2, visited: false},
        {"name":"D","group":0,index:3, visited: false},
        {"name":"E","group":0,index:4, visited: false},
        {"name":"F","group":0,index:5, visited: false},
        {"name":"G","group":0,index:6, visited: false},
    ],
    "links":[
        {"source":0,"target":2,"weight":7},
        {"source":0,"target":3,"weight":5},
        {"source":2,"target":1,"weight":8},
        {"source":2,"target":4,"weight":7},
        {"source":3,"target":4,"weight":15},
        {"source":3,"target":5,"weight":6},
        {"source":6,"target":5,"weight":11},
        {"source":6,"target":4,"weight":9},
        {"source":1,"target":4,"weight":5},
        {"source":5,"target":4,"weight":8},
        {"source":3,"target":2,"weight":9},
    ]
};

var currentIndex = 0;
var SpanningTree;

window.onload = function () {
    reset()
};


function  init() {
    var width = window.innerWidth,
        height = 700;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id","svg-main");

    var force = d3.layout.force()
        .distance(200)
        .size([width, height]);


    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("g")
        .attr("class", "text")
        .append("line")
        .attr("class","link-line")
        .style("stroke-width", function(d) { return Math.sqrt(d.weight); })
        .attr("target", function (t) {
            t.target;
        })
        .attr("source", function (t) {
            t.source;
        });

    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("group", function (t) {
            return t.group;
        })
        .attr("index", function (t) {
            return t.index;
        })
        .call(force.drag);


    node.append("circle")
        .attr("r","10");


    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name });

    var labelLine = svg.selectAll(".text")
        .append("text")
        .attr("class", "text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.weight;
        });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        labelLine
            .attr("x", function(d) {
                return (d.source.x + d.target.x)/2; })
            .attr("y", function(d) {
                return (d.source.y + d.target.y)/2; });


        node
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
}


function prims() {

    json.nodes.forEach(function (t) {
        t.visited = false;
    });

    var spanningTree = [{"target": 3}];
    var current = [json.nodes[3]];
    json.nodes[3].visited = true;
    var minIndex;
    var minWeight;
    var minSourceIndex;


    for (var i = 0; i < json.nodes.length - 1; i++)
    {
        minWeight = Infinity;

        current.forEach(function (currentNode)
        {
            temp = json.links.filter(function (t) {
                if(t.source.index === currentNode.index || t.target.index === currentNode.index)
                {
                    return true;
                }
            });
            temp.forEach(function (link)
            {
                var tempIndex;
                if (link.source.index !== currentNode.index){
                    tempIndex = link.source.index;
                    tempSourceIndex = link.target.index
                }
                else {
                    tempIndex = link.target.index;
                    tempSourceIndex = link.source.index

                }

                if (link.weight < minWeight && !json.nodes[tempIndex].visited)
                {
                    minWeight = link.weight;
                    minIndex = tempIndex;
                    minSourceIndex = tempSourceIndex;
                }
            });
        });
        json.nodes[minIndex].visited = true;
        spanningTree.push({"source": minSourceIndex, "target": minIndex});
        current.push(json.nodes[minIndex]);
    }
    SpanningTree = spanningTree;
}

function step() {
    var smt = SpanningTree[currentIndex];
    d3.selectAll(`g[index="`+ smt.target +`"]`)
        .attr("class","node2");
    $(".link-line").each(function() {
        if(this.__data__.source.index === smt.source && this.__data__.target.index === smt.target || this.__data__.source.index === smt.target && this.__data__.target.index === smt.source)
        {
            $(this).removeClass();
            $(this).addClass("link-line2")
        }
    });
    currentIndex++;
}

function reset() {
    d3.select("svg").remove();
    init();
    prims();
    currentIndex = 0;

}