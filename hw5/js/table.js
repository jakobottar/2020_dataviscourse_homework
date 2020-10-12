/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(forecastData, pollData) {
        this.forecastData = forecastData;
        this.tableData = [...forecastData];
        // add useful attributes
        for (let forecast of this.tableData)
        {
            forecast.isForecast = true;
            forecast.isExpanded = false;
        }
        this.pollData = pollData;
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'state', 
                alterFunc: d => d
            },
            {
                sorted: false,
                ascending: false,
                key: 'margin',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'winstate_inc',
                alterFunc: d => +d
            },
        ]

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;

        this.scaleX = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, this.vizWidth]);

        this.attachSortHandlers();
        this.drawLegend();
    }

    drawLegend() {
        ////////////
        // PART 2 // 
        ////////////
        /**
         * Draw the legend for the bar chart.
         */

        let axisHeight = 150;

        
        let legendLabs = [  { 'loc': -75, 'lab': '+75' },
                            { 'loc': -50, 'lab': '+50' },
                            { 'loc': -25, 'lab': '+25' },
                            { 'loc': 25, 'lab': '+25' },
                            { 'loc': 50, 'lab': '+50' },
                            { 'loc': 75, 'lab': '+75' }]
		let legend = d3.select('#marginAxis')

		legend.attr('width', this.vizWidth)
			.attr('height', this.vizHeight)

        legend.append('path')
            .attr('d', `M${this.scaleX(0)} 0 L ${this.scaleX(0)}, ${this.vizHeight}`)
            .classed('axis-line', true)

		legend.selectAll('text')
			.data(legendLabs)
			.enter()
			.append('text')
			.text(d => d.lab)
			.attr('y', this.vizHeight - 10)
			.attr('x', d => this.scaleX(d.loc))
			.classed('label', true)
			.classed('biden', d => d.loc < 0)
			.classed('trump', d => d.loc > 0)
    }

    drawTable() {
        this.updateHeaders();
        let rowSelection = d3.select('#predictionTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr');

        rowSelection.on('click', (event, d) => 
            {
                if (d.isForecast)
                {
                    this.toggleRow(d, this.tableData.indexOf(d));
                }
            });

        let forecastSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);


        ////////////
        // PART 1 // 
        ////////////
        /**
         * with the forecastSelection you need to set the text based on the dat value as long as the type is 'text'
         */

        let textSelection = forecastSelection.filter(d => d.type === 'text');
        
        textSelection
            .filter(".state-name")
            .text(d => d.value)

        textSelection
            .filter(".poll-name")
            .text(d => d.value)

        textSelection
            .filter(".biden")
            .text(d => d.value)

        textSelection
            .filter(".trump")
            .text(d => d.value)

        textSelection
            .filter(".poll-data")
            .text("")

        let vizSelection = forecastSelection.filter(d => d.type === 'viz');

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', d => d.isForecast ? this.vizHeight : this.smallVizHeight);

        let grouperSelect = svgSelect.selectAll('g')
            .data(d => [d, d, d])
            .join('g');

        this.addGridlines(grouperSelect.filter((d,i) => i === 0), [-75, -50, -25, 0, 25, 50, 75]);
        this.addRectangles(grouperSelect.filter((d,i) => i === 1));
        this.addCircles(grouperSelect.filter((d,i) => i === 2));
    }

    rowToCellDataTransform(d) {
        let stateInfo = {
            type: 'text',
            class: d.isForecast ? 'state-name' : 'poll-name',
            value: d.isForecast ? d.state : d.name
        };

        let marginInfo = {
            type: 'viz',
            value: {
                marginLow: +d.margin_lo,
                margin: +d.margin,
                marginHigh: +d.margin_hi,
            }
        };
        let winChance;
        if (d.isForecast)
        {
            const trumpWinChance = +d.winstate_inc;
            const bidenWinChance = +d.winstate_chal;

            const trumpWin = trumpWinChance > bidenWinChance;
            const winOddsValue = 100 * Math.max(trumpWinChance, bidenWinChance);
            let winOddsMessage = `${Math.floor(winOddsValue)} of 100`
            if (winOddsValue > 99.5 && winOddsValue !== 100)
            {
                winOddsMessage = '> ' + winOddsMessage
            }
            winChance = {
                type: 'text',
                class: trumpWin ? 'trump' : 'biden',
                value: winOddsMessage
            }
        }
        else
        {
            winChance = {type: 'text', class: 'poll-data', value: ''}
        }

        let dataList = [stateInfo, marginInfo, winChance];
        for (let point of dataList)
        {
            point.isForecast = d.isForecast;
        }
        return dataList;
    }

    updateHeaders() {
        ////////////
        // PART 7 // 
        ////////////
        /**
         * update the column headers based on the sort state
         */

        d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .classed('sorting', d => d.sorted)

        d3.select('#columnHeaders')
            .selectAll('i')
            .attr('class', 'fas no-display')

        d3.select('#columnHeaders')
            .selectAll('i')
            .data(this.headerData)
            .classed('no-display', false)
            .classed('fa-sort-up', d => d.sorted && d.ascending)
            .classed('fa-sort-down', d => d.sorted && !d.ascending)
    }

    addGridlines(containerSelect, ticks) {
		containerSelect.selectAll('path')
			.data(ticks)
			.enter()
			.append('path')
            .attr('d', d => `M${this.scaleX(d)} ${0} L ${this.scaleX(d)}, ${this.vizHeight}`)
			.classed('axis-line', d => d == 0)
			.classed('grid-line', d => d != 0)
    }

    addRectangles(containerSelect) {
        containerSelect.selectAll('rect').remove()

        containerSelect = containerSelect.filter(d => d.isForecast)

        containerSelect
            .filter(d => Math.sign(d.value.marginLow) == Math.sign(d.value.marginHigh))
            .selectAll('rect')
            .data(d => [d])
            .join('rect')
            .attr('x', d => this.scaleX(d.value.marginLow))
			.attr('y', 5)
			.attr('height', 20)
			.attr('width', d => this.scaleX(d.value.marginHigh) - this.scaleX(d.value.marginLow) )
			.classed('biden', d => d.value.margin < 0)
            .classed('trump', d => d.value.margin > 0)

        let swing = containerSelect
            .filter(d => Math.sign(d.value.marginLow) != Math.sign(d.value.marginHigh))
            .selectAll('rect')
            .data(d => [d])

        swing.join('rect')
			.attr('x', d => this.scaleX(d.value.marginLow))
			.attr('y', 5)
			.attr('height', 20)
			.attr('width', d => this.scaleX(0) - this.scaleX(d.value.marginLow) )
            .classed('biden', d => 0 > d.value.marginLow)
            .classed('split-rect', true)

        swing.join('rect')
			.attr('x', d => this.scaleX(0))
			.attr('y', 5)
			.attr('height', 20)
			.attr('width', d => this.scaleX(d.value.marginHigh) - this.scaleX(0) )
            .classed('trump', d => 0 < d.value.marginHigh)
            .classed('split-rect', true)
	
    }

    addCircles(containerSelect) {
        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */

		containerSelect
            .selectAll('circle')
            .data(d => [d])
            .join('circle')
			.attr('cx', d => this.scaleX(d.value.margin))
			.attr('cy', d => {
                if(d.isForecast){return 15}
                return 10
            })
			.attr('r', d => {
                if(d.isForecast){return 5}
                return 4
            })
			.classed('biden', d => d.value.margin < 0)
			.classed('trump', d => d.value.margin > 0)

    }

    attachSortHandlers() 
    {
        ////////////
        // PART 6 // 
        ////////////
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */
        let that = this

        let header = d3.select('#columnHeaders')
            .selectAll('th')
            .data(that.headerData)
            .on('click', function(d, h) {
                that.collapseAll()
                that.headerData.forEach(e => e.sorted = false)

                if(!h.ascending){
                    that.tableData.sort((a,b) => {
                        if(h.alterFunc(a[h.key]) > h.alterFunc(b[h.key])){ return 1}
                        if(h.alterFunc(a[h.key]) < h.alterFunc(b[h.key])){ return -1}
                        return 0
                    })
                    h.ascending = true
                    h.sorted = true
                }
                else{
                    that.tableData.sort((a,b) => {
                        if(h.alterFunc(a[h.key]) > h.alterFunc(b[h.key])){ return -1}
                        if(h.alterFunc(a[h.key]) < h.alterFunc(b[h.key])){ return 1}
                        return 0
                    })
                    h.ascending = false
                    h.sorted = true
                }
                that.drawTable()
            })


    }


    toggleRow(rowData, index) {
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */

        let pData = this.pollData.get(rowData.state)

        if(typeof pData == 'undefined'){return}

        if(this.tableData[index].isExpanded){
            this.tableData[index].isExpanded = false
            this.tableData.splice(index+1, pData.length-1)
            
        }
        else{
            this.tableData[index].isExpanded = true
            for(let i = 1; i < pData.length; i++){
                pData[i].isForecast = false
                this.tableData.splice(index + i, 0, pData[i])
            }
        }
        this.drawTable()
    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
