class Table {
    constructor(data){ 
        this.allData = data
        this.data = data

        this.viz = {
            height: 30,
            freqWidth: undefined,
            percWidth: undefined,
            padding: 7
        }

        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'phrase', 
                alterFunc: d => d
            },
            {
                sorted: false,
                ascending: false,
                key: 'total',
                alterFunc: d => +d
            },
            {
                sorted: false,
                ascending: false,
                key: 'percent_of_d_speeches',
                alterFunc: d => +d
            },
            {
                sorted: false,
                ascending: false,
                key: 'total',
                alterFunc: d => +d
            }
        ]

        this.freqScale = undefined
        this.percScale = undefined

        // TODO: Get this dynamically
        let bins = ['economy/fiscal issues', 'energy/environment', 'crime/justice', 'education', 'health care', 'mental health/substance abuse']
        this.colorScale = d3.scaleOrdinal()
            .domain(bins)
            .range(d3.schemeSet2.slice(0, 6))

        console.log(this.data)
        this.drawTable()
    }

    doSomething(){
        if(typeof this.data != 'undefined'){
            // console.log("Table got the data!")
        }
    }

    updateTableSize() {
        this.viz.freqWidth = d3.select('#freqAxis').node().getBoundingClientRect().width;
        this.viz.percWidth = d3.select('#percentAxis').node().getBoundingClientRect().width;

        this.updateScales();
    }

    updateScales() {
        this.freqScale = d3.scaleLinear()
            .domain([0, 1])
            .range([this.viz.padding, this.viz.freqWidth - 2*this.viz.padding])

        this.percScale = d3.scaleLinear()
            .domain([0, 100])
            .range([this.viz.padding, this.viz.percWidth/2 - 2])
    }

    drawTable(){
        this.updateTableSize()
        this.attachSortHandlers()
        this.updateTable()
    }

    drawAxis(){
        this.updateTableSize()

        let xScale = d3.scaleLinear()
            .domain([-100, 100])
            .range([this.viz.padding, this.viz.percWidth - 2*this.viz.padding])

        d3.select("#freqAxis")
            .selectAll('g')
            .data(d => [0])
            .join('g')
            .attr('transform', `translate(0,30)`)
            .call(d3.axisTop(this.freqScale)
                    .ticks(3)
                    .tickValues([0, 0.5, 1]))

        d3.select("#percentAxis")
            .selectAll('g')
            .data(d => [0])
            .join('g')
            .attr('transform', `translate(0,30)`)
            .call(d3.axisTop(xScale)
                .ticks(3)
                .tickValues([-100, -50, 0, 50, 100])
                .tickFormat(d => Math.abs(d)))
    }

    updateTable(){
        let rows = d3.select('#tableBody')
            .selectAll('tr')
            .data(this.data)
            .join('tr')

        let cells = rows.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);

        cells.filter(d => d.type === 'text')
            .text(d => d.value)

        let vizCells = cells.filter(d => d.type === 'viz')
            .selectAll('svg')
            .data(d => [d])
            .join('svg')

        this.drawFreqBars(vizCells.filter(d => d.class == 'frequency'))
        this.drawPercBars(vizCells.filter(d => d.class == 'percentages'))

        this.drawAxis()
    }

    drawFreqBars(frequencyCells){
        this.updateTableSize() 
        
        frequencyCells.selectAll('rect')
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(200)
            .attr('x', this.viz.padding)
            .attr('width', d => this.freqScale(d.value))
            .attr('height', this.viz.height)
            .attr('fill', d => this.colorScale(d.category))
    }

    drawPercBars(percentageCells){
        this.updateTableSize()

        percentageCells.selectAll('g')
            .data(d => [{name: 'dem-rect'}, {name: 'rep-rect'}])
            .join('g')
            .attr('id', d => d.name)
        
        percentageCells.select('#dem-rect')
            .selectAll('rect')
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(200)
            .attr('width', d => this.percScale(d.value[0]))
            .attr('height', this.viz.height)
            .attr('x', d => this.percScale(100) - this.percScale(d.value[0]))
            .attr('fill', '#699bbe')

        percentageCells.select('#rep-rect')
            .selectAll('rect')
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(200)
            .attr('width', d => this.percScale(d.value[1]))
            .attr('height', this.viz.height)
            .attr('x', this.viz.percWidth/2)
            .attr('fill', '#ed8276')
    }

    rowToCellDataTransform(d) {
        let phrase = {
            type: 'text',
            class: 'phrase',
            category: d.category,
            value: d.phrase
        };

        let frequency = {
            type: 'viz',
            class: 'frequency',
            category: d.category,
            value: (d.total / 50)
        };
        let percentages = {
            type: 'viz',
            class: 'percentages',
            category: d.category,
            value: [+d.percent_of_d_speeches, +d.percent_of_r_speeches]
        }
        let total = {
            type: 'text',
            class: 'total',
            category: d.category,
            value: d.total
        };


        let dataList = [phrase, frequency, percentages, total];

        return dataList;
    }

    attachSortHandlers() 
    {
        let that = this

        let header = d3.select('#columnHeaders')
            .selectAll('th')
            .data(that.headerData)
            .on('click', function(h, d) {
                that.headerData.forEach(e => e.sorted = false)

                if(!h.ascending){
                    that.data.sort((a,b) => {
                        if(h.alterFunc(a[h.key]) > h.alterFunc(b[h.key])){ return 1}
                        if(h.alterFunc(a[h.key]) < h.alterFunc(b[h.key])){ return -1}
                        return 0
                    })
                    h.ascending = true
                    h.sorted = true
                }
                else{
                    that.data.sort((a,b) => {
                        if(h.alterFunc(a[h.key]) > h.alterFunc(b[h.key])){ return -1}
                        if(h.alterFunc(a[h.key]) < h.alterFunc(b[h.key])){ return 1}
                        return 0
                    })
                    h.ascending = false
                    h.sorted = true
                }
                that.updateTable()
            })


    }
}