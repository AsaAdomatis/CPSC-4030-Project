var sbc = {
    counties: undefined,
    colorScale: undefined,
    group: undefined,
    data: undefined,

    count(county, state) {
        if (state === undefined) {
            if(this.group.has(county)) {
                return this.group.get(county).length;
            }
            return 0;
        }
        else {
            if(this.group.has(county)) {
                let arr = this.data.filter(d => d.state === state);
                let g = d3.group(arr, d => d.county);
                if (g.has(county)) {
                    return g.get(county).length 
                }
                return 0;
            }
            return 0;
        }

    },

    fips: [
        'error',
        'al', 'ak', ' ', 'az', 'ar', 'ca', ' ', 'co', 'ct', 'de', 'dc', 'fl', 'ga',
        ' ', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
        'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
        'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', ' ', 'ri', 'sc',
        'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
    ],
    convertFIPS(state) {
        let index = +state;
        if (this.fips.length - 1 >= index)
            return this.fips[index];
        return this.fips[0];
    }
}

function transitionCounty(data) {
    sbc.data = data;
    // setting data up
    sbc.group = d3.group(data, d => d.county);
    sbc.counties.transition()
        .attr("fill", d => {
            let state = sbc.convertFIPS(d.properties["STATE"]);
            if (Filters.stateFilter.length == 0 || Filters.stateFilter.includes(state)) {
                var countyName = d.properties["NAME"] + " County";
                return sbc.colorScale(sbc.count(countyName, state));       
            }
            return sbc.colorScale(0);  
        })
}

d3.csv("..\\..\\data\\final-data.csv").then(function(dataset) {    
    d3.json("..\\..\\data\\us-counties-geo.json").then(function(mapdata){
        // getting a list of all us states and the counts of that generalized shape per sighting
        dataset = Filters.filterBadDates(dataset);
        sbc.data = dataset;
        sbc.group = d3.group(dataset, d => d.county);

        var size = {
            width: 600,
            height: 400,
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
        };

        var offset = {
            x: 10,
            y: 10
        };

        var svg = d3.select("#sightings-by-county")
            .attr("width", size.width)
            .attr("height", size.height);

        var projection = d3.geoAlbersUsa()
            .fitWidth(size.width, {type: "Sphere"})

        var pathGenerator = d3.geoPath(projection);

        // drawing background
        var earth = svg.append("path")
            .attr("d", pathGenerator({type: "Sphere"}))
            .attr("fill", "white");

        let max = d3.max(sbc.group, d => d[1].length);

        // var thresholds = [0, 5, 10, 25, 50, 100, 250, 500]
        // sbc.colorScale = d3.scaleThreshold()
        //     .domain(thresholds)
        //     .range(d3.schemePuBu[thresholds.length]);
        sbc.colorScale = d3.scaleLinear()
            .domain([0, max])
            .range(["GhostWhite", "DarkBlue"])
            .nice();

        var tooltip = d3.select("tooltip")

        sbc.counties = svg.append("g")
            .selectAll(".county")
            .data(mapdata.features)
            .enter()
            .append("path")
            .attr("class", "county")
            .attr("d", d => pathGenerator(d))
            .attr("fill", d => {
                let state = sbc.convertFIPS(d.properties["STATE"]);
                if (Filters.stateFilter.length == 0 || Filters.stateFilter.includes(state)) {
                    var countyName = d.properties["NAME"] + " County";
                    return sbc.colorScale(sbc.count(countyName, state));       
                }
                return sbc.colorScale(0);           
            })
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("stroke", "black");
                var countyName = i.properties["NAME"] + " County";
                let state = sbc.convertFIPS(i.properties["STATE"]);
                tooltip
                    .style("visibility", "visible")
                    .style("left", `${d.x + offset.x}px`)
                    .style("top", `${d.y + offset.y}px`)
                    .text(`${countyName}: ${sbc.count(countyName, state)}`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke", "none")
                tooltip
                    .style("visibility", "hidden")
            })
            .on('click', function() {});

            
            // legend
            let lsize = {
                width: 200,
                height: size.height,
                top: 25,
                left: 25
            }
            let lsvg = d3.select("#county-legend")
                .attr("width", lsize.width)
                .attr("height", lsize.height);

            let legend = d3.legendColor()
                .title("Sightings per County")
                .scale(sbc.colorScale);
            lsvg.append("g")
                .attr("transform", `translate(${lsize.left}, ${lsize.top})`)
                .call(legend);
         
    })
})
