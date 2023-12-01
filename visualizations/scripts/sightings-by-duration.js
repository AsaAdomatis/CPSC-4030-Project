d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
    var size = {
        width: 800,
        height: 800,
        top: 10,
        bottom: 10,
        left: 150,
        right: 10

    };

    var svg = d3.select("#sightings-by-duration")
        .attr("width", size.width + size.left + size.right)
        .attr("height", size.height + size.top + size.bottom);

    var data_sorted = data.sort(d3.ascending);
    var q1 = d3.quantile(data_sorted, .25, d => +d.duration);
    var median = d3.quantile(data_sorted, .5, d => +d.duration);
    var q3 = d3.quantile(data_sorted, .75, d => +d.duration);
    var interQuantileRange = q3 - q1;
    var min = d3.min(data, d => +d.duration);
    var max = d3.max(data, d => +d.duration);

    // Show the Y scale
    var y = d3.scaleLog()
        .domain([min, (max * 100)])
        .range([size.height - size.bottom, size.top])
        .base(2);
    // svg.call(d3.axisLeft(y))
    var yAxis = d3.axisLeft(y);
    svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + size.left + ",0)")
            .call(yAxis);
    svg.selectAll(".y-axis>.tick>text")
        .each(function(d, i){
            d3.select(this).style("font-size", "16px");
        });

    // a few features for the box
    var boxFeatures = {
        center: 200,
        width: 100
    };
    
    // Show the main vertical line
    svg.append("line")
        .attr("x1", boxFeatures.center + size.left)
        .attr("x2", boxFeatures.center + size.left)
        .attr("y1", y(min))
        .attr("y2", y(max) )
        .attr("stroke", "black")
    
    // Show the box
    svg.append("rect")
        .attr("x", boxFeatures.center - boxFeatures.width/2 + size.left)
        .attr("y", y(q3) )
        .attr("height", (y(q1)-y(q3)) )
        .attr("width", boxFeatures.width)
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
    
    // show median, min and max horizontal lines
    svg.selectAll("toto")
        .data([min, median, max])
        .enter()
        .append("line")
        .attr("x1", boxFeatures.center-boxFeatures.width/2  + size.left)
        .attr("x2", boxFeatures.center+boxFeatures.width/2 + size.left)
        .attr("y1", function(d){ return(y(d))} )
        .attr("y2", function(d){ return(y(d))} )
        .attr("stroke", "black");
})