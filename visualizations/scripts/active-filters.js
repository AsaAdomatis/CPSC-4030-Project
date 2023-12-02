var Filters = {
    shapeFilter: [],
    yearFilter: [],
    stateFilter: [],
    shapeOriginal: [],
    yearOriginal: [],
    stateOriginal: [],
    original: [],
    filtered: [],

    input(shape, year, state) {
        // applying input to filter, either adding it or removing it
        if (shape !== undefined) {
            if (this.shapeFilter.includes(shape)) {
                this.shapeFilter = this.shapeFilter.filter(e => e !== shape);
            }
            else {
                this.shapeFilter.push(shape);
            }
        }
        if (year !== undefined) {
            if (this.yearFilter.includes(year)) {
                this.yearFiler = this.yearFilter.filter(e => e !== year);
            }
            else {
                this.yearFilter.push(year);
            }
        }
        if (state !== undefined) {
            if (this.stateFilter.includes(state)) {
                this.stateFilter = this.stateFilter.filter(e => e !== state);
            }
            else {
                this.stateFilter.push(state);
            }
        }

        // resetting empy filters to there original
        if (this.shapeFilter.length === 0)
            this.shapeFilter = this.shapeOriginal;
        if (this.stateFilter.length === 0)
            this.stateFilter = this.stateOriginal;
        if (this.yearFilter.length === 0)
            this.yearFilter = this.yearOriginal;

        this.applyFilters(original);

        // do transitions
    },

    filterBadDates(data) {
        return data.filter(d => d.dateTime.indexOf("/") != -1);
    },

    getYear(dateTime) {
        try {
            let parseDate = d3.timeParse("%m/%d/%Y %H:%M");
            let year = parseDate(dateTime).getFullYear();
            return year;
        }
        catch (error) {
            console.error('Error: ', error.message);
            console.log('Try filtering the data with \'filterBadDates()\' first');
            return 'Error'
        }
    },

    clearFilters(data) {
        shapeFilter = [];
        yearFilter = [];
        stateFilter = [];
    },

    populateFilters() {
        let shapeSet = new Set();
        let yearSet = new Set();
        let stateSet = new Set();
        let filteredData = this.filterBadDates(this.original);
        filteredData.forEach(d => {
            shapeSet.add(d.generalizedShape);
            yearSet.add(this.getYear(d.dateTime));
            stateSet.add(d.state);
        });

        this.shapeFilter = Array.from(shapeSet);
        this.yearFilter = Array.from(yearSet);
        this.stateFilter = Array.from(stateSet);

        this.shapeOriginal = this.shapeFilter;
        this.yearOriginal = this.yearFilter;
        this.stateOriginal = this.stateFilter;
    },

    applyFilters(data) {
        // filtering out bad times
        
        let filteredData = this.filterBadDates(data);

        filteredData = filteredData.filter(d => {
            // filtering by general shape
            if (!(d.hasOwnProperty("generalizedShape") && shapeFilter.includes(d.generalizedShape))) {
                return false;
            }
            // filter by state
            if (!(d.hasOwnProperty("state")) && stateFilter.includes(d.state)) {
                return false;
            }
            // filter by year
            let parseDate = d3.timeParse("%m/%d/%Y %H:%M");
            let year = parseDate(d.dateTime).getFullYear();
            if (!(d.hasOwnProperty("dateTime") && yearFilter.includes(year))) {           
                return false;
            }
            return true;
        });

        this.filtered = filteredData;
        return filteredData;
    }
}

d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
    Filters.original = data;
    Filters.populateFilters();
    Filters.stateFilter = ["ca", "az", "tx"]
    console.log(Filters.shapeFilter);
    console.log(Filters.yearFilter);
    console.log(Filters.stateFilter);
})