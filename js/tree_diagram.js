// set the dimensions and margins of the diagram
/*var margin = {top: 20, right: 310, bottom: 30, left: 100},
  width = 1100 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;*/

 var margin = {top: 20, right:200, bottom: 30, left: 50}
 var width = parseInt(d3.select("body").style("width")) - (margin.right + margin.left),
     height = parseInt(d3.select("body").style("height")) - (margin.top + margin.bottom);
 
// declares a tree layout and assigns the size (need to be resized)
var treemap = d3.tree()
  .size([height, width]);
// load the external data
d3.json("source/treeData.json", function(error, treeData) {
  if (error) throw error;
  //  assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData, function(d) {
    return d.children;
    });
  // maps the node data to the tree layout
  nodes = treemap(nodes);
  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  /*var graph = d3.select("body").append("svg")
      .attr("id", "graph")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);*/
 
  

  var graph = d3.select("body")
    .attr("id", "graph")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    .classed("svg-content-responsive", true);
  
  var g = graph.append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


  /* 
  var svg = d3.select("body").append("svg")
      .attr("id", "graph")
      .attr("width", width )
      .attr("height", height)
      .append("g")*/
  // adds the links between the nodes

  var link = g.selectAll("#link")
    .data( nodes.descendants().slice(1))
    .enter().append("path")
    .attr("id", "link")
    .attr("d", function(d) {
       return "M" + d.y + "," + d.x
       + "C" + (d.y + d.parent.y) / 2 + "," + d.x
       + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
       + " " + d.parent.y + "," + d.parent.x;
       });
   
  // adds each node as a group
  var node = g.selectAll(".node")
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", function(d) { 
      return "node" + 
      (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });
  // adds the circle to the node
  node.append("circle")
    .attr("r", 10);
  // adds the text to the node, how to make the text size responsive ?? 
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", function(d) { return d.children ? -13 : 13; })
    .style("text-anchor", function(d) { 
    return d.children ? "end" : "start"; })
    .text(function(d) { return d.data.name; });

  function resize(){
    var width = parseInt(d3.select("body").style("width")) - (margin.right + margin.left),
        height = parseInt(d3.select("body").style("height")) - (margin.top + margin.bottom);

    //update treemap size based on new width & height
    treemap.size([height, width]);
    

    //update the width & height of svg

    

    //update the distance between links 


  }

    d3.select(window).on('resize', resize); 

  resize();
});
