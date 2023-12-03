var sbd = {
    spine: undefined,
    box: undefined,
    horizontals: undefined,
    y: undefined,
    sumStats: []
}

function transitionDuration(data) {
    // getting num sum stats
    var data_sorted = data.sort(d3.ascending);
    sbd.sumStats[1] = d3.quantile(data_sorted, .25, d => +d.duration);
    sbd.sumStats[2]  = d3.quantile(data_sorted, .5, d => +d.duration);
    sbd.sumStats[3] = d3.quantile(data_sorted, .75, d => +d.duration);
    sbd.sumStats[0] = d3.min(data, d => +d.duration);
    sbd.sumStats[4] = d3.max(data, d => +d.duration);

    // transition spine
    sbd.spine.transition()
        .attr("y1", sbd.y(sbd.sumStats[0]))
        .attr("y2", sbd.y(sbd.sumStats[4]));

    // transition box
    sbd.box.transition()
        .attr("y", sbd.y(sbd.sumStats[3]) )
        .attr("height", (sbd.y(sbd.sumStats[1])-sbd.y(sbd.sumStats[3])));

    // transition lines
    let iterator = 0;
    sbd.horizontals.transition()
        .attr("y1", (d, i) => sbd.y(sbd.sumStats[i*2]))
        .attr("y2", (d, i) => sbd.y(sbd.sumStats[i*2]));
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

    var boxFeatures = {
        center: 200,
        width: 100
    };

    // let selection = {
    //     startX: undefined,
    //     startY: undefined,
    //     endX: undefined,
    //     endY: undefined,
    //     active: false
    // }

    var svg = d3.select("#sightings-by-duration")
        .attr("width", size.width + size.left + size.right)
        .attr("height", size.height + size.top + size.bottom)
        .attr("selecting", false)
        // .on("mousedown", d => {
        //     console.log(`start x:${d.x} start y:${d.y}`);
        //     selection.startX = d.x;
        //     selection.startY = d.y;
        //     selection.active = true;
        // })
        // .on("mouseover", d => {
        //     if(selection.active) {
        //         console.log("yippee!");
        //         d3.select(this)
        //             .attr("x", boxFeatures.center - boxFeatures.width/2 + size.left)
        //             .attr("y", sbd.y(selection.startY) )
        //             .attr("height", (sbd.y(d.y)-sbd.y(selection.startY)) )
        //             .attr("width", boxFeatures.width)
        //             .style("fill", "#69b3a2")
        //             .attr("opacity", "0.5");
        //     }
        // })
        // .on("mouseup", d=> {
        //     console.log(`end x:${d.x} end y:${d.y}`);
        //     selection.endX = d.x;
        //     selection.endY = d.y;
        //     selection.active = false;
        // });

    var data_sorted = data.sort(d3.ascending);
    var q1 = d3.quantile(data_sorted, .25, d => +d.duration);
    var median = d3.quantile(data_sorted, .5, d => +d.duration);
    var q3 = d3.quantile(data_sorted, .75, d => +d.duration);
    var min = d3.min(data, d => +d.duration);
    var max = d3.max(data, d => +d.duration);
    sbd.lineValues = [min, median, max];
    sbd.sumStats = [min, q1, median, q3, max];


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
                .html(`Min: ${sbd.sumStats[0]}<br/>Q1: ${sbd.sumStats[1]}<br/>Median: ${sbd.sumStats[2]}<br/>Q3: ${sbd.sumStats[3]}<br/>Max: ${sbd.sumStats[4]}`)
        })
        .on("mouseout", function () {
            tooltip
                .style("visibility", "hidden")
        })
    
    d3.select("#sightings-by-duration-title")
        .text("Distribution of Sightings' Durations in Seconds")
})