d3.csv("..\\..\\data\\final-data.csv").then(
    function (dataset) {
        var dimensions = {
            width: 400,
            height: 400,
            margin: {
                top: 10,
                bottom: 50,
                right: 10,
                left: 75
            }
        }

        var offset = {
            x: dimensions.margin.left + 450,
            y: dimensions.margin.bottom + 50
        }

        var shapes = {}
        dataset.forEach(function (d) {
            if (shapes.hasOwnProperty(d.generalizedShape)) {
                shapes[d.generalizedShape]++
            }
            else {
                shapes[d.generalizedShape] = 1
            }
        })
        var shapesKeys = Object.keys(shapes)

        var svg = d3.select("#sightings-by-shape")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        var xScale = d3.scaleBand()
            .domain(d3.map(dataset, d => d.generalizedShape))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .padding([0.2])

        var max = 0;
        shapesKeys.forEach(function (key) {
            if (shapes[key] > max) {
                max = shapes[key]
            }
        })

        var yScale = d3.scaleLinear()
            .domain([0, max])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        //var colorScale = d3.scaleOrdinal()
        //    .domain(shapesKeys)
        //    .range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"])

        var tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .text("test")

        var bars = svg.append("g")
            .selectAll("g")
            .data(shapesKeys)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d))
            .attr("y", d => yScale(shapes[d]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => (dimensions.height - dimensions.margin.bottom) - yScale(shapes[d]))
            .attr("fill", "steelblue")
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("stroke", "black")
                tooltip
                    .style("visibility", "visible")
                    .style("left", (xScale(i) + offset.x) + 'px')
                    .style("top", (yScale(shapes[i]) + offset.y) + 'px')
                    .text(`${shapes[i]}`)
                    //console.log(svg)
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .attr("stroke", "none")
                tooltip
                    .style("visibility", "hidden")
            })
            .on("click", function () {
                d3.selectAll("rect")
                    .attr("fill", "skyblue")
                d3.select(this)
                    .attr("fill", "steelblue")
            })

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(function (d) { return d; })
            //.tickValues(tickValues)

        var yAxis = d3.axisLeft(yScale)

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

        //svg.append("text")
        //    .attr("class", "x-axis-label")
        //    .attr("x", dimensions.width / 2)
        //    .attr("y", dimensions.height - dimensions.margin.bottom + 40)
        //    .text("Shape")
    }
)