/** Data structure for the data associated with an individual country. */
class PlotData {
    /**
     *
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     *
     * For part 2 of the homework, you only need to worry about the first parameter.
     * You will be updating the plot with the data in updatePlot,
     * but first you need to draw the plot structure that you will be updating.
     *
     * Set the data as a variable that will be accessible to you in updatePlot()
     * Call the drawplot() function after you set it up to draw the plot structure on GapPlot load
     *
     * We have provided the dimensions for you!
     *
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;

        this.data = data;

        // console.log(data)

        //TODO - your code goes here -

        this.xIndicator
        this.yIndicator
        this.circleSizeIndicator

        this.updateYear = updateYear
        this.updateCountry = updateCountry
    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        svgGroup.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${this.margin.left},${this.height})`)
            .classed('axis', true)

        svgGroup.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${this.margin.left},0)`)
            .classed('axis', true)

        svgGroup.append('g')
            .attr('id', 'circles')
            .attr('transform', `translate(${this.margin.left},0)`)

        svgGroup.append('text')
            .attr('id', 'yearText')
            .attr('transform', `translate(${this.margin.left + 150} , 100)`)
            .text(activeYear)
            .classed('activeYear-background', true)

        svgGroup.append('text')
            .attr('id', 'x-label')
            .text("x label")
            .classed(['axis-label', 'x-label'], true)
            .attr('transform', `translate(${this.width/2 + 20}, ${this.height + 40})`)

        svgGroup.append('text')
            .attr('id', 'y-label')
            .text("y label")
            .classed(['axis-label', 'y-label'], true)
            .attr('transform', `translate(${11 + this.margin.left - 40}, ${this.height/2 + this.margin.top}), rotate(-90)`)

        /* Below is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

        this.updatePlot(this.activeYear, "child-mortality", "life-expectancy", 'gdp')
        this.drawYearBar()
    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {

        // ******* TODO: PART 2 *******
        /*
        TODO: ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.
        */

       this.xIndicator = xIndicator
       this.yIndicator = yIndicator
       this.circleSizeIndicator = circleSizeIndicator

       let that = this

        function nestedMax(data){
            let currMax = 0;
            data.forEach(e => {
                for (const record in e)
                    if (typeof e[record] === 'number') {
                        if(currMax < e[record]){
                            currMax = e[record]
                        }
                    }
            });

            return currMax
        }

        function nestedMin(data){
            let currMin = 1e10;
            data.forEach(e => {
                for (const record in e)
                    if (typeof e[record] === 'number') {
                        if(currMin > e[record]){
                            currMin = e[record]
                        }
                    }
            });

            return currMin
        }

        let minSize = nestedMin(this.data[circleSizeIndicator]);
        let maxSize = nestedMax(this.data[circleSizeIndicator])

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         * 
         * @param d the data value to encode
         * @returns {number} the radius
         */
        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        let labs = {
            "population": "Population",
            "gdp": "GDP",
            "child-mortality": "Child Mortality (under 5)",
            "life-expectancy": "Life Expectancy",
            "fertility-rate": "Fertility Rate"
        }

        d3.select('#yearText').text(activeYear)
        d3.select('#x-label').text(labs[xIndicator])
        d3.select('#y-label').text(labs[yIndicator])

        this.drawLegend(minSize, maxSize)
        this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator)
        
        let xScale = d3
		    .scaleLinear()
		    .domain([0, nestedMax(this.data[xIndicator])])
            .range([0, this.width]);
            
        let yScale = d3
		    .scaleLinear()
		    .domain([0, nestedMax(this.data[yIndicator])])
            .range([this.height, 0]);
            
        d3.select("#x-axis").call(d3.axisBottom(xScale)).classed("axis", true);
        d3.select("#y-axis").call(d3.axisLeft(yScale)).classed("axis", true);        
      
        let countryData = new Array()

        for(let i = 0; i < this.data.population.length; i++){
            let country = this.data.population[i]

            let x = this.data[xIndicator].find( ({ geo }) => geo === country.geo )[activeYear]
            let y = this.data[yIndicator].find( ({ geo }) => geo === country.geo )[activeYear]
            let cr = this.data[circleSizeIndicator].find( ({ geo }) => geo === country.geo )[activeYear]
                       
            let pData = new PlotData(country.country, x, y, country.geo, country.region, cr)

            countryData.push(pData)
        }

        let plot = d3.select('#circles')
            .selectAll('circle')
            .data(countryData);

        plot.exit()
            .transition()
            .duration(150)
            .attr('opacity', 0)
            .remove();

        let plotEnter = plot.enter()
            .append("circle")
            .on('mouseover', this.mouseOver)
            .on('mousemove', this.mouseMove)
            .on('mouseout', this.mouseOut)
            .on('click', function(d) {
                that.updateCountry(d.id)
            })
        
        plotEnter.transition()
		    .duration(150)
            .attr('cx', d => xScale(d.xVal))
            .attr('cy', d => yScale(d.yVal))
            .attr('r', d => circleSizer(d))
            .attr('class', d => d.region)
            .attr('id', d => `${d.id}-circ`)
            
;
        plot.transition()
            .duration(150)
            .attr('cx', d => xScale(d.xVal))
            .attr('cy', d => yScale(d.yVal))
            .attr('r', d => circleSizer(d))    
    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function (d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function (d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function (d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {
        let that = this;

        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1800)
            .attr('max', 2020)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function () {
            sliderText.text(this.value)
            sliderText.attr('x', yearScale(this.value))
            that.updateYear(this.value)
            that.activeYear = this.value
            that.updatePlot(that.activeYear, that.xIndicator, that.yIndicator, that.circleSizeIndicator)
        });
    }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a country; draws that country darker
     * and fades countries on other continents out
     * @param activeCountry
     */
    updateHighlightClick(activeCountry) {
        let activeRegion = this.data.population.find( ({ geo }) => geo === activeCountry.toLowerCase() ).region

        d3.select('#circles')
            .selectAll("circle")
            .classed("selected-region", d => (d.region == activeRegion))
            .classed("selected-country", d => (d.id == activeCountry))
            .classed("hidden", d => (d.region != activeRegion))
        
    }

    /**
     * Clears any highlights
     */
    clearHighlight() {
        d3.select('#circles')
                .selectAll("circle")
                .classed("selected-region", false)
                .classed("selected-country", false)
                .classed("hidden", false)
    }


    mouseOver(data){
        d3.select('.tooltip')
            .html("<h2>" + data['country'] + "</h2>")
            .transition()
            .duration(200)
            .style('opacity', 0.9)
            
    }

    mouseMove(data){
        d3.select('.tooltip')
            .style("left", (d3.event.pageX + 10) + "px")     
            .style("top", (d3.event.pageY - 28) + "px"); 
    }

    mouseOut(data){
        d3.select('.tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
    }
}
