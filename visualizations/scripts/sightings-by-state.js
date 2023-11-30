d3.csv("..\\..\\data\\final-data.csv").then(
    function(dataset) {
        
        d3.json("..\\..\\data\\us-state-geo.json").then(
            function(mapdata){
                // getting a list of all us states and the counts of that generalized shape per sighting
                const validStates = ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 
                'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 
                'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 
                'va', 'wa', 'wv', 'wi', 'wy'];
                var sightings = {};
                dataset.forEach(d => {
                    var state = d["state"];
                    var shape = d["generalizedShape"];
                    if (validStates.includes(state)) {
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
                    }   
                });
                // adding totals
                Object.keys(sightings).forEach(function(stateKey, stateIndex) {
                    let total = 0;
                    Object.keys(sightings[stateKey]).forEach(function(shapeKey, shapeIndex) {
                        total += sightings[stateKey][shapeKey];
                    })
                    sightings[stateKey].total = total;
                });

                
                var size = {
                    width: 800,
                    height: 800
                };

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
                var max = 0;
                Object.keys(sightings).forEach(function(key, index) {
                    if (sightings[key].total > max) {                        
                        max = sightings[key].total;
                    }      
                });

                var colorScale = d3.scaleLinear()
                    .domain([0, max])
                    .range(["GhostWhite", "DarkBlue"]);

                var states = svg.append("g")
                    .selectAll(".state")
                    .data(mapdata.features)
                    .enter()
                    .append("path")
                    .attr("class", "state")
                    .attr("d", d => pathGenerator(d))
                    .attr("fill", d => {
                        if(d.properties.admin == "United States of America") {
                            if (d.hasOwnProperty("properties") && d.properties.hasOwnProperty("postal") && d.properties.postal !== null) {
                                var state = d.properties.postal.toLowerCase();
                                if (sightings.hasOwnProperty(state) && sightings[state].hasOwnProperty("total")) {
                                    return colorScale(+sightings[state].total);
                                }
                            }
                            return "white";
                        }
                        return "none";
                    })

            }
        )
    }
)