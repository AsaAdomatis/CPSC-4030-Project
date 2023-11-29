d3.csv("..\\..\\data\\final-data.csv").then(
    function(dataset) {
        
        d3.json("..\\..\\data\\us-state-geo.json").then(
            function(mapdata){
                // getting a list of all states and the counts of that generalized shape per sighting
                var sightings = {};
                dataset.forEach(d => {
                    var state = d["state"];
                    var shape = d["generalizedShape"];
                    if (state == "") 
                        state = "misc";

                    
                    if (sightings.hasOwnProperty(state)) {
                        // has state and shape
                        if (sightings[state].hasOwnProperty(shape)) {
                            sightings[state][shape]++;
                        }
                        // has state but no shape
                        else {
                            sightings[state][shape] = 1;
                        }
                    } 
                    // neither state nor shape                      
                    else {
                        sightings[state] = {};
                        sightings[state][shape] = 1;
                    }                        
                });
                // adding totals
                Object.keys(sightings).forEach(function(stateKey, stateIndex) {
                    let total = 0;
                    Object.keys(sightings[stateKey]).forEach(function(shapeKey, shapeIndex) {
                        total += sightings[stateKey][shapeKey];
                    })
                    sightings[stateKey].total = total;
                })

                
                var size = {
                    width: 800,
                    height: 800
                };

                var svg = d3.select("svg")
                    .attr("width", size.width)
                    .attr("height", size.height);

                var projection = d3.geoEqualEarth()
                    .fitWidth(size.width, {type: "Sphere"});

                
                var pathGenerator = d3.geoPath(projection);

                // drawing background
                var earth = svg.append("path")
                    .attr("d", pathGenerator({type: "Sphere"}))
                    .attr("fill", "lightblue");

                // drawing lat long lines
                // var graticule = svg.append("path")
                //     .attr("d", pathGenerator(d3.geoGraticule10()))
                //     .attr("stroke", "gray")
                //     .attr("fill", "none");
                var max = 0;
                Object.keys(sightings).forEach(function(key, index) {
                    if (sightings[key].total > max) {                        
                        max = sightings[key].total;
                    }      
                });

                var colorScale = d3.scaleLinear()
                    .domain([0, max])
                    .range(["blue", "red"]);

                var states = svg.append("g")
                    .selectAll(".state")
                    .data(mapdata.features)
                    .enter()
                    .append("path")
                    .attr("class", "state")
                    .attr("d", d => pathGenerator(d))
                    .attr("fill", d => {
                        var state = d.properties.postal.toLowerCase();
                        if (sightings.hasOwnProperty(state) && sightings[state].hasOwnProperty("total")) {
                            return colorScale(+sightings[state].total);
                        }
                        else {
                            return "black";
                        }
                    })

            }
        )
    }
)