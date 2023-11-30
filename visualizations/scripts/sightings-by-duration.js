d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
  var size = {
    width: 800,
    height: 800,
    top: 50, 
    right: 50, 
    bottom: 50, 
    left: 50
  };

  var svg = d3.select("#sightings-by-duration")
    .attr("width", size.width)
    .attr("height", size.height)
    .attr("viewBox", [0, 0, size.width, size.height]);

  // Compute summary statistics used for the box:
  var data_sorted = data.sort(d3.ascending)
  var q1 = d3.quantile(data_sorted, .25)
  var median = d3.quantile(data_sorted, .5)
  var q3 = d3.quantile(data_sorted, .75)
  var interQuantileRange = q3 - q1
  var min = q1 - 1.5 * interQuantileRange
  var max = q1 + 1.5 * interQuantileRange

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([0,d3.max(d => d.duration)])
    .range([size.height, 0]);
  svg.call(d3.axisLeft(y))
  console.log(d3.max(d => d.duration));

  // a few features for the box
  // var center = 200
  // var width = 100

  // // Show the main vertical line
  // svg
  // .append("line")
  //   .attr("x1", center)
  //   .attr("x2", center)
  //   .attr("y1", y(min) )
  //   .attr("y2", y(max) )
  //   .attr("stroke", "black")

  // // Show the box
  // svg
  // .append("rect")
  //   .attr("x", center - width/2)
  //   .attr("y", y(q3) )
  //   .attr("height", (y(q1)-y(q3)) )
  //   .attr("width", width )
  //   .attr("stroke", "black")
  //   .style("fill", "#69b3a2")

  // // show median, min and max horizontal lines
  // svg
  // .selectAll("toto")
  // .data([min, median, max])
  // .enter()
  // .append("line")
  //   .attr("x1", center-width/2)
  //   .attr("x2", center+width/2)
  //   .attr("y1", function(d){ return(y(d))} )
  //   .attr("y2", function(d){ return(y(d))} )
  //   .attr("stroke", "black")
})