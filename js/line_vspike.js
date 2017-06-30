// basic SVG setup
  var margin = { top: 20, right: 100, bottom: 40, left: 100 };
  var height = 500 - margin.top - margin.bottom;
  var width = 960 - margin.left - margin.right;

  var svg = d3.select("body").append("svg")
      .attr("width",width + margin.left + margin.right)
      .attr("height",height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // setup scales - the domain is specified inside of the function called when we load the data
  var xScale = d3.time.scale().range([0, width]);
  var yScale = d3.scale.linear().range([height, 0]);
  var color = d3.scale.category10();

  // setup the axes
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  // create function to parse dates into date objects
  var parseDate = d3.time.format("%Y").parse;
  var formatDate = d3.time.format("%Y");
  var bisectDate = d3.bisector(function(d) { return d.date; }).left;

  // set the line attributes
  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.close); });

  var focus = svg.append("g").style("display","none");

  // import data and create chart
  d3.csv("source/line_vspike.csv", function(d) {
      return {
        date: parseDate(d.date),
        Airbnb: +d.Airbnb,
        Technology: +d.Technology
      };
    }, 
    function(error,data) {
      
      // sort data ascending - needed to get correct bisector results
      data.sort(function(a,b) {
        return a.date - b.date;
      });

      // color domain
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      // create stocks array with object for each company containing all data
      var stocks = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d){
            return {date: d.date, close: d[name]};
          })
        };
      });
     
      var colordot = d3.keys(data[0]).filter(function(d) { return d !== "date"; })
      var stockdot = colordot.map(function(stockdot){
        return data.map(function(d){
          
          return {x: +d.date, y: +d[stockdot] };
         
        });
      });
      
      // add domain ranges to the x and y scales
      xScale.domain([
        d3.min(stocks, function(c) { return d3.min(c.values, function(v) { return v.date; }); }),
        d3.max(stocks, function(c) { return d3.max(c.values, function(v) { return v.date; }); })
      ]);
      yScale.domain([
        0,
        // d3.min(stocks, function(c) { return d3.min(c.values, function(v) { return v.close; }); }),
        d3.max(stocks, function(c) { return d3.max(c.values, function(v) { 
          return v.close; }); })
      ]);

      // add the x axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // add the y axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform","rotate(-90)")
          .attr("y",-60)
          .attr("dy",".71em")
          .style("text-anchor","end")
          .text("Revenue x 1000000 ($)");

      // add the line groups
      var stock = svg.selectAll(".stockXYZ")
          .data(stocks)
        .enter().append("g")
          .attr("class","stockXYZ");

      // add the stock price paths
      stock.append("path")
        .attr("class","line")
        .attr("id",function(d,i){ return "id" + i; })
        .attr("d", function(d) {
          return line(d.values); 
        })
        .style("stroke", function(d) { return color(d.name); });

      
     //check the construct logic 
     /* svg.selectAll(".series")
          .data(stockdot)
      .enter().append("g")
      .selectAll(".point")
         .data(function(d) {
          console.log(d);
          return d; })  
          .enter().append("circle")
          .attr("class", "point")
          .attr("r", 2)
          .attr("cx", function(d){
            console.log(d);
            return xScale(d.x);
          })
          .attr("cy", function(d){
            return yScale(d.y);
          })*/
      

      // add the stock labels at the right edge of chart
      var maxLen = data.length;
      stock.append("text")
        .datum(function(d) { 
          return {name: d.name, value: d.values[maxLen - 1]}; 
        })
        .attr("transform", function(d) { 
          return "translate(" + xScale(d.value.date) + "," + yScale(d.value.close) + ")"; 
        })
        .attr("id",function(d,i){ return "text_id" + i; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; })
  
  });

