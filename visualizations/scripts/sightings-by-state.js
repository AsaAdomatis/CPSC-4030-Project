var sbt = {
    states: undefined,
    colorScale: undefined,
    group: undefined,

    count(state) {
        if(this.group.has(state)) {
            return this.group.get(state).length;
        }
        return 0;
    }
}
function transitionState(data) {
    // setting data up
    sbt.group = d3.group(data, d => d.state);

    sbt.states.transition()
        .attr("fill", d => {
            let state = d.properties.STUSPS.toLowerCase();
            if(sbt.group.has(state)) {
                return sbt.colorScale(sbt.group.get(state).length);
            }
            return sbt.colorScale(0);
        })
}

d3.csv("..\\..\\data\\final-data.csv").then(
    function(dataset) {
        
        d3.json("..\\..\\data\\us-state-2.geojson").then(
            function(mapdata){
                sbt.group = d3.group(dataset, d => d.state);
                
                var size = {
                    width: 600,
                    height: 400
                };

                var offset = {
                    x: 10,
                    y: 10
                }

                var svg = d3.select("#sightings-by-state")
                    .attr("width", size.width)
                    .attr("height", size.height);

                var projection = d3.geoAlbersUsa()
                    .fitWidth(size.width, {type: "Sphere"})
                    // .rotate([100, 0, 0]);

                
                var pathGenerator = d3.geoPath(projection);

                // drawing background
                var earth = svg.append("path")
                    .attr("d", pathGenerator({type: "Sphere"}))
                    .attr("fill", "white");

                let max = d3.max(sbt.group, d => d[1].length);

                sbt.colorScale = d3.scaleLinear()
                    .domain([0, max])
                    .range(["GhostWhite", "DarkRed"])
                    .nice();

                var tooltip = d3.select("tooltip")
                
                sbt.states = svg.append("g")
                    .selectAll(".state")
                    .data(mapdata.features)
                    .enter()
                    .append("path")
                    .attr("class", "state")
                    .attr("d", d => pathGenerator(d))
                    .attr("fill", d => {
                        var state = d.properties.STUSPS.toLowerCase();
                        let count = sbt.group.get(state).length;
                        if (count !== undefined)
                            return sbt.colorScale(count);
                        return sbt.colorScale(0);
                   
                    })
                    .attr("selected", false)
                    .attr("stroke-width", "3px")
                    .style("cursor", "pointer")
                    .on("mouseover", function (d, i) {
                        // d3.select(this)
                        //     .attr("stroke", "black")
                        var state = i.properties.STUSPS.toLowerCase();
                        tooltip
                            .style("visibility", "visible")
                            .style("left", `${d.x + offset.x}px`)
                            .style("top", `${d.y + offset.y}px`)
                            .text(`${state}: ${sbt.count(state)}`)
                    })
                    .on("mouseout", function () {
                        // d3.select(this)
                        //     .attr("stroke", "none")
                        tooltip
                            .style("visibility", "hidden")
                    })
                    .on("click", function() {
                        // running selection
                        Filters.input({state: this.__data__.properties.STUSPS.toLowerCase()});
                        if (this.getAttribute("selected") === "true") {
                            d3.select(this)
                                .attr("stroke", "none")
                                .attr("selected", false)
                        }
                        else {                        
                            d3.select(this)
                                .attr("stroke", "steelblue")
                                .attr("selected", true)
                        }
                    })

                // legend
                let lsize = {
                    width: 200,
                    height: size.height,
                    top: 25,
                    left: 25
                }
                let lsvg = d3.select("#state-legend")
                    .attr("width", lsize.width)
                    .attr("height", lsize.height);
                    
                let legend = d3.legendColor()
                    .scale(sbt.colorScale)
                    .labels(d => {
                        if (d.i == d.genLength - 1) {
                            return d.generatedLabels[d.i] + "+";
                        }
                        else
                            return d.generatedLabels[d.i] + " to " + d.generatedLabels[d.i + 1];
                    });
                lsvg.append("g")
                    .attr("transform", `translate(${lsize.left}, ${lsize.top})`)
                    .call(legend);
                
                d3.selectAll("text")
                    .style("font-size", "14px");


                d3.select("#sightings-by-state-title")
                    .text("Sightings per State")
            }
        )
    }
)