d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
    let yearGroup = d3.group(data, (d) => {
        return d3.timeParse("%m/%d/%Y %H:%M")(d.dateTime).getFullYear();
    });
    console.log(yearGroup);
})