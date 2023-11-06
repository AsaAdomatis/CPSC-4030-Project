d3.csv("..\\..\\data\\nuforc-reports-2016-with-headers.csv").then(
	function(dataset){
		var dimensions = {
            width: 1000,
            height: 800,
            margin:{
                top: 10,
                bottom: 50,
                right: 10,
                left: 75
            }
        }

        var parseDate = d3.timeParse("%m/%d/%Y %H:%M")

        dataset = dataset.filter(function (d) {
            if (d.dateTime.indexOf("/") != -1) {
                return true;
            }
            console.log("NaN date time found")
            return
        })

        console.log(dataset)

        var svg = d3.select("#sightings-by-year")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")

        var count = []

        var xScale = d3.scaleTime()
            .domain(d3.map(dataset, function (d) {
                year = parseDate(d.dateTime).getFullYear()
                count[year] = (count[year]||0) + 1
                return year
            }))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])

        for (var i = 0; i < count.length; i++) {
            if (!count[i]) {
                count[i] = 0
            }
        }

        var yScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, count)])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        svg.append("path")
            .data(dataset)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { console.log(xScale(d)); return xScale(d) })
                .y(function (d) { console.log(yScale(d)); return yScale(d) })
        )

        var tickValues = dataset.map(function (d, i) {
            if (i % 5 === 0) {
                return parseDate(d.dateTime).getFullYear()
            }
            return null
        }).filter(d => d !== null)

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(function (d) { return d; })
            .tickValues(tickValues)

        var yAxis = d3.axisLeft(yScale)

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (dimensions.height - dimensions.margin.bottom) + ")")
            .call(xAxis)

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
	}
)