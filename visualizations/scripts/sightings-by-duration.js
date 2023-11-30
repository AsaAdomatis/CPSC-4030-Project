d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
  var size = {
    width: 800,
    height: 800,
    top: 50, 
    right: 50, 
    bottom: 50, 
    left: 50
  };

  var binCount = 100;

  var svg = d3.select("#sightings-by-duration")
    .attr("width", size.width)
    .attr("height", size.height)
    .attr("viewBox", [0, 0, size.width, size.height]);

  var bins = d3.bin()
    .thresholds(binCount)
    .value((d) => d.duration)
    (data);

  var x = d3.scaleLinear()
    .domain([bins[0].x0, bins[bins.length - 1].x1])
    .range([size.left, size.width - size.right]);
  
  // Declare the y (vertical position) scale.
  var y = d3.scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([size.height - size.bottom, size.top]);

  // Add a rect for each bin.
  svg.append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(bins)
    .join("rect")
    .attr("x", (d) => x(d.x0) + 1)
    .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
    .attr("y", (d) => y(d.length))
    .attr("height", (d) => y(0) - y(d.length));

    // Add the x-axis and label.
    svg.append("g")
    .attr("transform", `translate(0,${size.height - size.bottom})`)
    .call(d3.axisBottom(x).ticks(size.width / binCount).tickSizeOuter(0))
    .call((g) => g.append("text")
        .attr("x", size.width)
        .attr("y", size.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("Unemployment rate (%) →"));

  // Add the y-axis and label, and remove the domain line.
  svg.append("g")
      .attr("transform", `translate(${size.left},0)`)
      .call(d3.axisLeft(y).ticks(size.height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.append("text")
          .attr("x", - size.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Frequency (no. of counties)"));

})