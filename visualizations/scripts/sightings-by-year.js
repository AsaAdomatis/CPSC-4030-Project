d3.csv("..\\..\\data\\nuforc-reports-2016-with-headers.csv").then(
	function(dataset){
		var dimensions = {
            width: 1900,
            height: 800,
            margin:{
                top: 10,
                bottom: 50,
                right: 10,
                left: 50
            }
        }

        console.log(dataset)

        var svg = d3.select("#sightings-by-year")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        var xScale = d3.scaleBand()
            .domain(d3.map(dataset, function(d){
                year = d.dateTime.substring(d.dateTime.indexOf("/", 3), d.dateTime.indexOf(" "))
                //console.log(year)
                return year
            }))
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .padding([0.2])
	}
)