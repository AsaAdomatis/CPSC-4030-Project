var sbt = {
    states: undefined,
    colorScale: undefined,
    group: undefined
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
                // // getting a list of all us states and the counts of that generalized shape per sighting
                // const validStates = ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 
                // 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 
                // 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 
                // 'va', 'wa', 'wv', 'wi', 'wy'];
                // var sightings = {};
                // dataset.forEach(d => {
                //     var state = d["state"];
                //     var shape = d["generalizedShape"];
                //     if (validStates.includes(state)) {
                //         if (state == "") 
                //             state = "misc";

                //         if (sightings.hasOwnProperty(state)) {
                //             // has state and shape
                //             if (sightings[state].hasOwnProperty(shape)) {
                //                 sightings[state][shape]++;
                //             }
                //             // has state but no shape
                //             else {
                //                 sightings[state][shape] = 1;
                //             }
                //         } 
                //         // neither state nor shape                      
                //         else {
                //             sightings[state] = {};
                //             sightings[state][shape] = 1;
                //         }  
                //     }   
                // });
                // // adding totals
                // Object.keys(sightings).forEach(function(stateKey, stateIndex) {
                //     let total = 0;
                //     Object.keys(sightings[stateKey]).forEach(function(shapeKey, shapeIndex) {
                //         total += sightings[stateKey][shapeKey];
                //     })
                //     sightings[stateKey].total = total;
                // });
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

                // drawing lat long lines
                // var graticule = svg.append("path")
                //     .attr("d", pathGenerator(d3.geoGraticule10()))
                //     .attr("stroke", "gray")
                //     .attr("fill", "none");
                // var max = 0;
                // Object.keys(sightings).forEach(function(key, index) {
                //     if (sightings[key].total > max) {                        
                //         max = sightings[key].total;
                //     }      
                // });
                let max = d3.max(sbt.group, d => d[1].length);
                console.log(max);

                sbt.colorScale = d3.scaleLinear()
                    .domain([0, max])
                    .range(["GhostWhite", "DarkRed"]);

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
                    .on("mouseover", function (d, i) {
                        // d3.select(this)
                        //     .attr("stroke", "black")
                        var state = i.properties.STUSPS.toLowerCase();
                        tooltip
                            .style("visibility", "visible")
                            .style("left", `${d.x + offset.x}px`)
                            .style("top", `${d.y + offset.y}px`)
                            .text(`${i.properties.STUSPS}: ${sbt.group.get(state).length}`)
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
            }
        )
    }
)