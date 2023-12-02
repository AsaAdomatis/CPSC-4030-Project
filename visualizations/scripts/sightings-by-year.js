d3.csv("..\\..\\data\\final-data.csv").then(
	function(dataset){
		var dimensions = {
            width: 400,
            height: 400,
            margin:{
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

        var tickSpacing = 5

        var parseDate = d3.timeParse("%m/%d/%Y %H:%M")

        dataset = dataset.filter(function (d) {
            if (d.dateTime.indexOf("/") != -1) {
                return true;
            }
            return
        })

        var svg = d3.select("#sightings-by-year")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")

        var count = {}
        dataset.forEach(function (d) {
            year = parseDate(d.dateTime).getFullYear()
            if (count.hasOwnProperty(year)) {
                count[year]++
            }
            else {
                count[year] = 1
            }
        })

        countKeys = Object.keys(count)
        var firstYear = +(countKeys[0])
        var lastYear = +(countKeys[countKeys.length - 1])
        var firstTick = firstYear - (firstYear % tickSpacing)
        var lastTick = lastYear + (tickSpacing - (lastYear % tickSpacing))

        var max = 0;
        countKeys.forEach(function (d) {
            if (count[d] > max) {
                max = count[d]
            }
        })

        var xScale = d3.scaleLinear()
            .domain([firstTick, lastTick])
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])

        var yScale = d3.scaleLinear()
            .domain([0, max])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        var tooltip = d3.select("tooltip")

        var line = d3.line()
            .x(function (d) {
                return xScale(d)
            })
            .y(function (d) {
                return yScale(count[d])
            })


        svg.append("path")
            .data(dataset)
            .attr("transform", "translate(" + -dimensions.margin.left + ",0)")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line(countKeys))

        var xTickValues = []
        for (var i = firstTick; i <= lastTick; i += tickSpacing) {
            xTickValues.push(i)
        }

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(function (d) { return d; })
            .tickValues(xTickValues)

        var yAxis = d3.axisLeft(yScale)

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

        svg.selectAll("circles")
            .data(countKeys)
            .enter()
            .append("circle")
            .attr("transform", "translate(" + -dimensions.margin.left + ",0)")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function (d) { return xScale(d) })
            .attr("cy", function (d) { return yScale(count[d]) })
            .attr("r", 2)
            .attr("selected", false)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("r", 10)
                tooltip
                    .style("visibility", "visible")
                    .style("left", `${d.x + offset.x}px`)
                    .style("top", `${d.y + offset.y}px`)
                    .text(`${i}: ${count[i]}`)
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
            })
	}
)