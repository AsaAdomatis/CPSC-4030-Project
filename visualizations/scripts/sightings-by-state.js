d3.csv("..\\..\\data\\nuforc-reports-2016-with-headers.csv").then(
    function(dataset) {
        d3.json("..\\..\\data\\states.geojson").then(
            function(mapdata){
                // getting number of occurences
                // const stateCounts = {}

                // dataset.forEach(row => {
                //     if (row["state"] in stateCounts) {
                //         stateCounts[row["state"]]++;
                //     }
                //     else {
                //         stateCounts[row["state"]] = 1;
                //     }
                // })

                // const result = [];
                // for (const name in nameCounts) {

                // }
                
                console.log(mapdata);

                // var stateSightings = {}
                // dataset.forEach( d => {
                //     stateSightings[d["name"]]
                // })
            }
        )
    }
)