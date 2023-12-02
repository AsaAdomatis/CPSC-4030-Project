var sbd = {
    spine: undefined,
    box: undefined,
    horizontals: undefined,
    y: undefined
}

function transitionDuration(data) {
    // getting num sum stats
    let lineValues = [];
    var data_sorted = data.sort(d3.ascending);
    var q1 = d3.quantile(data_sorted, .25, d => +d.duration);
    lineValues[1] = d3.quantile(data_sorted, .5, d => +d.duration);
    var q3 = d3.quantile(data_sorted, .75, d => +d.duration);
    var interQuantileRange = q3 - q1;
    lineValues[0] = d3.min(data, d => +d.duration);
    lineValues[2] = d3.max(data, d => +d.duration);

    // transition spine
    sbd.spine.transition()
        .attr("y1", sbd.y(lineValues[0]))
        .attr("y2", sbd.y(lineValues[2]));

    // transition box
    sbd.box.transition()
        .attr("y", sbd.y(q3) )
        .attr("height", (sbd.y(q1)-sbd.y(q3)));

    // transition lines
    console.log(sbd.horizontals)
    let iterator = 0;
    sbd.horizontals.transition()
        .attr("y1", function(d, i){ return(sbd.y(lineValues[i]))} )
        .attr("y2", function(d, i){ return(sbd.y(lineValues[i]))} )
}

d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
    var size = {
        width: 400,
        height: 600,
        top: 10,
        bottom: 10,
        left: 150,
        right: 10

    };

    var offset = {
        x: 10,
        y: 10
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
    sbd.y = d3.scaleLog()
        .domain([min, (max * 100)])
        .range([size.height - size.bottom, size.top])
        .base(2);

    var yAxis = d3.axisLeft(sbd.y);
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
    sbd.spine = svg.append("line")
        .attr("x1", boxFeatures.center + size.left)
        .attr("x2", boxFeatures.center + size.left)
        .attr("y1", sbd.y(min))
        .attr("y2", sbd.y(max))
        .attr("stroke", "black")
    
    // Show the box
    sbd.box = svg.append("rect")
        .attr("x", boxFeatures.center - boxFeatures.width/2 + size.left)
        .attr("y", sbd.y(q3) )
        .attr("height", (sbd.y(q1)-sbd.y(q3)) )
        .attr("width", boxFeatures.width)
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
    
    // show median, min and max horizontal lines
    sbd.horizontals = svg.selectAll("toto")
        .data([min, median, max])
        .enter()
        .append("line")
        .attr("x1", boxFeatures.center-boxFeatures.width/2  + size.left)
        .attr("x2", boxFeatures.center+boxFeatures.width/2 + size.left)
        .attr("y1", function(d){ return(sbd.y(d))} )
        .attr("y2", function(d){ return(sbd.y(d))} )
        .attr("stroke", "black");

    var tooltip = d3.select("tooltip")

    svg
        .on("mouseover", function (d, i) {
            tooltip
                .style("visibility", "visible")
                .style("left", `${d.x + offset.x}px`)
                .style("top", `${d.y + offset.y}px`)
                .html(`Min: ${min}<br/>Q1: ${q1}<br/>Median: ${median}<br/>Q3: ${q3}<br/>Max: ${max}`)
        })
        .on("mouseout", function () {
            tooltip
                .style("visibility", "hidden")
        })
})