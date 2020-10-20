class Table {
    constructor(data){ 
        this.allData = data
        this.data = data

        this.viz = {
            height: 30,
            freqWidth: undefined,
            percWidth: undefined
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

        console.log(this.data)
        this.drawTable()
    }

    doSomething(){
        if(typeof this.data != 'undefined'){
            // console.log("Table got the data!")
        }
    }

    getTableImgSize() {
        this.viz.freqWidth = d3.select('#freqAxis').node().getBoundingClientRect().width;
        this.viz.percWidth = d3.select('#percentAxis').node().getBoundingClientRect().width;
    }

    drawTable(){
        this.attachSortHandlers()
        this.getTableImgSize()
        this.updateTable()
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
    }

    drawFreqBars(frequencyCells){
        let xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.viz.freqWidth])

        // TODO: Get this list dynamically
        let bins = ['economy/fiscal issues', 'energy/environment', 'crime/justice', 'education', 'health care', 'mental health/substance abuse']

        let colorScale = d3.scaleOrdinal()
            .domain(bins)
            .range(d3.schemeSet2.slice(0, 6))

        frequencyCells.selectAll('rect')
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(200)
            .attr('width', d => xScale(d.value))
            .attr('height', this.viz.height)
            .attr('fill', d => colorScale(d.category))
    }

    drawPercBars(percentageCells){
        this.getTableImgSize()

        percentageCells.selectAll('g')
            .data(d => [{name: 'dem-rect'}, {name: 'rep-rect'}])
            .join('g')
            .attr('id', d => d.name)


        let xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.viz.percWidth/2])
        
        percentageCells.select('#dem-rect')
            .selectAll('rect')
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(200)
            .attr('width', d => xScale(d.value[0]))
            .attr('height', this.viz.height)
            .attr('x', d => xScale(100) - xScale(d.value[0]))
            .attr('fill', '#699bbe')

        percentageCells.select('#rep-rect')
            .selectAll('rect')
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(200)
            .attr('width', d => xScale(d.value[1]))
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