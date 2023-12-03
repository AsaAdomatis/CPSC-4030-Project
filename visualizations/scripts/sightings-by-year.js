var sby = {
    circles: undefined,
    path: undefined,
    line: undefined,
    count: undefined,
    countKeys: undefined,
    xScale: undefined,
    yScale: undefined
}

var dimensions = {
    width: 375,
    height: 375,
    margin: {
        top: 10,
        bottom: 60,
        right: 10,
        left: 75
    }
}

var offset = {
    x: 10,
    y: 10
}

function transitionYear(data) {
    sby.count = d3.group(data, function (d) {
        return Filters.getYear(d.dateTime)
    })
    sby.countKeys = Array.from(sby.count.keys()).sort(d3.ascending)

    sby.path.transition()
        .attr("d", sby.line(sby.countKeys))

    sby.circles.transition()
        .attr("cy", function (d) {
            if (sby.count.has(d)) {
                return sby.yScale(sby.count.get(d).length)
            }
            return sby.yScale(0)
        })
}

d3.csv("..\\..\\data\\final-data.csv").then(
	function(dataset){
        var tickSpacing = 5

        var svg = d3.select("#sightings-by-year")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")

        dataset = Filters.filterBadDates(dataset)

        sby.count = d3.group(dataset, function (d) {
            return Filters.getYear(d.dateTime)
        })

        sby.countKeys = Array.from(sby.count.keys()).sort(d3.ascending)

        var firstYear = +(sby.countKeys[0])
        var lastYear = +(sby.countKeys[sby.countKeys.length - 1])
        var firstTick = firstYear - (firstYear % tickSpacing)
        var lastTick = lastYear + (tickSpacing - (lastYear % tickSpacing))

        var max = 0;
        sby.count.forEach(function (year) {
            if (year.length > max) {
                max = year.length
            }
        })

        sby.xScale = d3.scaleLinear()
            .domain([firstTick, lastTick])
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])

        sby.yScale = d3.scaleLinear()
            .domain([0, max])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        var tooltip = d3.select("tooltip")

        sby.line = d3.line()
            .x(function (d) {
                return sby.xScale(d)
            })
            .y(function (d) {
                return sby.yScale(sby.count.get(d).length)
            })

        sby.path = svg.append("path")
            .data(dataset)
            .attr("transform", "translate(" + -dimensions.margin.left + ",0)")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", sby.line(sby.countKeys))

            sby.circles = svg.selectAll("circles")
            .data(sby.countKeys)
            .enter()
            .append("circle")
            .attr("transform", "translate(" + -dimensions.margin.left + ",0)")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function (d) { return sby.xScale(d) })
            .attr("cy", function (d) { return sby.yScale(sby.count.get(d).length) })
            .attr("r", 2)
            .attr("selected", false)
            .style("cursor", "pointer")
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("r", 10)
                tooltip
                    .style("visibility", "visible")
                    .style("left", `${d.x + offset.x}px`)
                    .style("top", `${d.y + offset.y}px`)
                    .text(`${i}: ${sby.count.get(i).length}`)
            })
            .on("mouseout", function () {
                if (this.getAttribute("selected") === "true") {
                    d3.select(this)
                        .attr("r", 3)
                }
                else {
                    d3.select(this)
                        .attr("r", 2)
                }
                tooltip
                    .style("visibility", "hidden")
            })
            .on("click", function () {
                if (this.getAttribute("selected") === "true") {
                    d3.select(this)
                        .attr("fill", "black")
                        .attr("r", 2)
                        .attr("selected", false)
                }
                else {
                    d3.select(this)
                        .attr("fill", "red")
                        .attr("r", 3)
                        .attr("selected", true)
                }
                Filters.input({year: this.__data__});
            })

        var xTickValues = []
        for (var i = firstTick; i <= lastTick; i += tickSpacing) {
            xTickValues.push(i)
        }

        var xAxis = d3.axisBottom(sby.xScale)
            .tickFormat(function (d) { return d; })
            .tickValues(xTickValues)

        var yAxis = d3.axisLeft(sby.yScale)

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + -dimensions.margin.left + "," + (dimensions.height - dimensions.margin.bottom) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font", "14px sans-serif")
            .style("text-anchor", "end")
            .attr("dx", -5)
            .attr("dy", 0)
            .attr("transform", "rotate(-45)")


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .style("font", "14px sans-serif")

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", dimensions.width / 2)
            .attr("y", dimensions.height - dimensions.margin.top)
            .text("Years")

        d3.select("#sightings-by-year-title")
            .text("Sightings per Year")
	}
)