var Filters = {
    shapeFilter: [],
    yearFilter: [],
    stateFilter: [],
    shapeOriginal: [],
    yearOriginal: [],
    stateOriginal: [],
    original: [],

    input(obj) {
        let shape = obj.shape;
        let year = obj.year;
        let state = obj.state;

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
            if (this.yearFilter.includes(String(year))) {
                this.yearFilter = this.yearFilter.filter(e => String(e) !== String(year));
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

        // do transitions
        let newStateData = this.applyFilters(this.original, 'state');
        transitionState(newStateData);
        let newShapeData = this.applyFilters(this.original, 'shape');
        transitionShape(newShapeData);
        let newYearData = this.applyFilters(this.original, 'year');

        let newDurationData = this.applyFilters(this.original, 'all');
        transitionDuration(newDurationData);
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

    printFilters() {
        console.log(this.shapeFilter);
        console.log(this.yearFilter);
        console.log(this.stateFilter);
    },

    populateOriginals() {
        let shapeSet = new Set();
        let yearSet = new Set();
        let stateSet = new Set();
        let filteredData = this.filterBadDates(this.original);
        filteredData.forEach(d => {
            shapeSet.add(d.generalizedShape);
            yearSet.add(this.getYear(d.dateTime));
            stateSet.add(d.state);
        });

        this.shapeOriginal = Array.from(shapeSet);
        this.yearOriginal = Array.from(yearSet);
        this.stateOriginal = Array.from(stateSet);
    },

    applyFilters(data, skip) {
        // filtering out bad times
        
        let filteredData = this.filterBadDates(data);
        filteredData = filteredData.filter(d => {
            // filtering by general shape
            if (this.shapeFilter.length !== 0 && skip !== 'shape' && !this.shapeFilter.includes(d.generalizedShape)) {
                return false;
            }
            // filter by state
            if (this.stateFilter.length !== 0 && skip !== 'state' && !this.stateFilter.includes(d.state)) {
                return false;
            }
            // filter by year
            let year = this.getYear(d.dateTime);
            if (this.yearFilter.length !== 0 && skip !== 'year' && !this.yearFilter.includes(String(year))) {      
                return false;
            }
            return true;
        });

        return filteredData;
    }
}

d3.csv("..\\..\\data\\final-data.csv").then(function(data) {
    Filters.original = data;
    Filters.populateOriginals();
})