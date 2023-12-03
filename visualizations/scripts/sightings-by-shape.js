var sbs = {
    bars: undefined,
    shapes: undefined,
    shapeKeys: undefined,
    xScale: undefined,
    yScale: undefined
}

var dimensions = {
    width: 400,
    height: 400,
    margin: {
        top: 10,
        bottom: 75,
        right: 10,
        left: 75
    }
}

var offset = {
    x: 10,
    y: 10
}

function transitionShape(data) {
    sbs.shapes = d3.group(data, function(d) {
        return d.generalizedShape
    })

    sbs.bars.transition()
        .attr("y", d => {
            if (sbs.shapes.has(d)) {
                return sbs.yScale(sbs.shapes.get(d).length);
            }             
            else {
                return sbs.yScale(0);
            }
            
        })
        .attr("height", d => {
            if (sbs.shapes.has(d)) {
                return (dimensions.height - dimensions.margin.bottom) - sbs.yScale(sbs.shapes.get(d).length);
            }
            else {
                return 0;
            }          
        })
}

d3.csv("..\\..\\data\\final-data.csv").then(
    function (dataset) {

        dataset = Filters.filterBadDates(dataset)
        
        sbs.shapes = d3.group(dataset, function(d) {
            return d.generalizedShape
        })
        sbs.shapesKeys = Array.from(sbs.shapes.keys())

        var svg = d3.select("#sightings-by-shape")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        sbs.xScale = d3.scaleBand()
            .domain(d3.map(dataset, d => d.generalizedShape))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .padding([0.2])

        var max = 0;
        sbs.shapes.forEach(function (shape) {
            if (shape.length > max) {
                max = shape.length
            }
        })

        sbs.yScale = d3.scaleLinear()
            .domain([0, max])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        var tooltip = d3.select("tooltip")

        sbs.bars = svg.append("g")
            .selectAll("g")
            .data(sbs.shapesKeys)
            .enter()
            .append("rect")
            .attr("x", d => sbs.xScale(d))
            .attr("y", d => sbs.yScale(sbs.shapes.get(d).length))
            .attr("width", sbs.xScale.bandwidth())
            .attr("height", d => (dimensions.height - dimensions.margin.bottom) - sbs.yScale(sbs.shapes.get(d).length))
            .attr("fill", "steelblue")
            .attr("selected", false)
            .style("cursor", "pointer")
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("stroke", "black")
                tooltip
                    .style("visibility", "visible")
                    .style("left", `${d.x + offset.x}px`)
                    .style("top", `${d.y + offset.y}px`)
                    .text(`${sbs.shapes.get(i).length}`)
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke", "none")
                tooltip
                    .style("visibility", "hidden")
            })
            .on("click", function (d, i) {
                Filters.input({shape: i})
                if (this.getAttribute("selected") === "true") {
                    d3.select(this)
                        .attr("fill", "steelblue")
                        .attr("selected", false)
                }
                else {
                    d3.select(this)
                        .attr("fill", "midnightblue")
                        .attr("selected", true)
                }
            })

        var xAxis = d3.axisBottom(sbs.xScale)
            .tickFormat(function (d) { return d; })

        var yAxis = d3.axisLeft(sbs.yScale)

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (dimensions.height - dimensions.margin.bottom) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font", "14px sans-serif")
            .style("text-anchor", "end")
            .attr("dx", -5)
            .attr("dy", 0)
            .attr("transform", "rotate(-45)")

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + dimensions.margin.left + ",0)")
            .call(yAxis)

        svg.append("text")
            .attr("x", (dimensions.margin.right * 2) + (dimensions.width / 2))             
            .attr("y", 0 + (dimensions.margin.top * 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Sightings by Shape")

        //svg.append("text")
        //    .attr("class", "x-axis-label")
        //    .attr("x", dimensions.width / 2)
        //    .attr("y", dimensions.height - dimensions.margin.bottom + 40)
        //    .text("Shape")
    }
)