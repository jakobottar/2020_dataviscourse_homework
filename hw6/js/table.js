class Table {
    constructor(data){ 
        this.allData = data
        this.data = data

        this.viz = {
            height: 30,
            freqWidth: undefined,
            percWidth: undefined
        }

        console.log(this.data)
        this.drawTable()
    }

    doSomething(){
        if(typeof this.data != 'undefined'){
            // console.log("Table got the data!")
        }
    }

    drawTable(){
        this.viz.freqWidth = d3.select('#freqAxis').node().getBoundingClientRect().width;
        this.viz.percWidth = d3.select('#percentAxis').node().getBoundingClientRect().width;
        this.updatePlot()
    }

    updatePlot(){
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
            value: (d.total / 50) * 100
        };
        let percentages = {
            type: 'viz',
            class: 'percentages',
            category: d.category,
            value: {
                percRSpeeches: d.percent_of_r_speeches,
                percDSpeeches: d.percent_of_d_speeches
            }
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
}