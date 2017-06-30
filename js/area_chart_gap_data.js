

// set the dimensions and margins of the graph
var margin = {top: 20, right: 150, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");
// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.close); });

var area2 = d3.area() 
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.open); });   


// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var valueline2 = d3.line()    
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.open); });



// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("source/area_chart_gap_data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      d.open = +d.open;
      d.internet = +d.internet;
  });

  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { 
    return Math.max(d.close, d.open); })]);
    
// add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // add the area
  svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

 // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "orange")
      .attr("d", valueline2);

  // add the area
  svg.append("path")
       .data([data])
       .attr("class", "area2")
       .attr("d", area2);    

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
    .append("text")
          .attr("fill", "#000")
          .attr("transform","rotate(-90)")
          .attr("y",-60)
          .attr("dy",".71em")
          .style("text-anchor","end")
          .text("Revenue Growth Rate(%)");

   svg.append("text")
    .attr("transform", "translate(" + (width+3) + "," + y(data[0].close) + ")")
    .attr("dy", ".2em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Airbnb");

    svg.append("text") 
    .attr("transform", "translate(" + (width+3) + "," + y(data[0].open) + ")")
    .attr("dy", ".2em")
    .style("pading",".1em")
    .attr("text-anchor", "start")
    .style("fill", "orange")
    .text("Technology Industry");  
        
});
