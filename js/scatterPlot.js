// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 150, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var z = d3.scale.category10();
// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline1 = d3.svg.line()
  .x(function(d) { return x(d.x); })
  .y(function(d) { return y(d.y1); });
  

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("source/scatter_plot.csv", function(error, data) {
  if (error) throw  error; 

  // Compute the series names() from loaded CSV 
   var seriesNames = d3.keys(data[0])
      .filter(function(d) { return d !== "x"; })

    // Map the data to an array of arrays of {x, y} tuples.
  var series = seriesNames.map(function(series) {
    return data.map(function(d) {
      return {x: +parseDate(d.x), y: +d[series]};
    });
  });

    // Scale the range of the data
    x.domain(d3.extent(d3.merge(series), function(d) { return d.x; })).nice();
    y.domain([0, d3.max(d3.merge(series), function(d) { return d.y; })]).nice();

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
          .attr("transform","rotate(-90)")
          .attr("y",-60)
          .attr("dy",".71em")
          .style("text-anchor","end")
          .text("Revenue Growth Rate(%)");

     // Add the scatterplot
    svg.selectAll(".series")
        .data(series)
      .enter().append("g")
         .attr("class", "series")
         .style("fill", function(d, i){ return z(i); })
      .selectAll(".point")
         .data(function(d) {return d; })   
      .enter().append("circle")
        .attr("class", "point")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); });
      
    svg.append("text")
    .attr("transform", "translate(" + (width+20) + "," + y(data[0].y1) + ")")
    .attr("dy", ".3em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .style("pading",".1em")
    .text("Airbnb");

    svg.append("text") 
    .attr("transform", "translate(" + (width+20) + "," + y(data[0].y2) + ")")
    .attr("dy", ".3em")
    .style("pading",".1em")
    .attr("text-anchor", "start")
    .style("fill", "orange")
    .text("Technology Industry");  

});
