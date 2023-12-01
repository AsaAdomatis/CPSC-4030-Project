d3.csv("..\\..\\data\\final-data.csv").then(
    function(dataset) {
        
        d3.json("..\\..\\data\\us-counties-geo.json").then(
            function(mapdata){
                // getting a list of all us states and the counts of that generalized shape per sighting
                const validStates = ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 
                'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 
                'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 
                'va', 'wa', 'wv', 'wi', 'wy'];
                var sightings = {};
                dataset.forEach(d => {
                    var county = d.county;
                    var shape = d.generalizedShape;
                    if (validStates.includes(d.state)) {
                        if (sightings.hasOwnProperty(county)) {
                            if (sightings[county].hasOwnProperty(shape)) {
                                sightings[county][shape]++;
                            }
                            else {
                                sightings[county][shape] = 1;
                            }
                        }                
                        else {
                            sightings[county] = {};
                            sightings[county][shape] = 1;
                        }  
                    }   
                });
                // adding totals
                Object.keys(sightings).forEach(function(countyKey, countyIndex) {
                    let total = 0;
                    Object.keys(sightings[countyKey]).forEach(function(shapeKey, shapeIndex) {
                        total += sightings[countyKey][shapeKey];
                    })
                    sightings[countyKey].total = total;
                });

                
                var size = {
                    width: 600,
                    height: 400
                };

                var svg = d3.select("#sightings-by-county")
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

                var thresholds = [1, 5, 10, 25, 50, 100, 250, 500]
                var colorScale = d3.scaleThreshold()
                    .domain(thresholds)
                    .range(d3.schemePuBu[thresholds.length]);

                var counties = svg.append("g")
                    .selectAll(".county")
                    .data(mapdata.features)
                    .enter()
                    .append("path")
                    .attr("class", "county")
                    .attr("d", d => pathGenerator(d))
                    .attr("fill", d => {
                        var countyName = d.properties["NAME"] + " County";
                        if(sightings.hasOwnProperty(countyName)) {
                            return colorScale(+sightings[countyName].total);
                        }
                        else {
                            return "GhostWhite";
                        }
                    })

            }
        )
    }
)