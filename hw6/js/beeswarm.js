class Beeswarm {
    constructor(data){ 
        this.data = data;

        this.size = {
            height: undefined,
            width: undefined,
            padding: 10
        };

        this.drawPlot()
    }

    doSomething(){
        if(typeof this.data != 'undefined'){
            console.log("Beeswarm got the data!");
        }
    }

    drawPlot(){

        let svgGroup = d3.select('#beeswarm')
            .append('svg')
            .classed('wrapper-group', true)

        // set size of plot
        this.size.width = d3.select('#beeswarm').node().getBoundingClientRect().width;
        this.size.height = d3.select('#beeswarm').node().getBoundingClientRect().height;

        svgGroup.append('g').attr('id', 'axis')
        svgGroup.append('g').attr('id', 'circles')
        svgGroup.append('g').attr('id', 'plot-text')

        this.drawAxis()
        this.drawCircles()
        this.drawText()
    }

    drawAxis(){

    }

    drawCircles(isExpanded = true){
        console.log(this.data)

        let xScale = d3.scaleLinear()
            .domain([Math.min.apply(Math, this.data.map(d => d.sourceX)), 
                Math.max.apply(Math, this.data.map(d => d.sourceX))])
            .range([this.size.padding, this.size.width-this.size.padding])

        // TODO: In order to dynamically size the width of the plot, I'll need to do the hacker version :(
        d3.select('#circles')
                .selectAll('circle')
                .data(this.data)
                .join('circle')
                .attr('cy', d => d.sourceY + 100)
                .attr('cx', d => xScale(d.sourceX))
                .attr('r', d => +d.total)
    }

    drawText(isExpanded = true){
        // console.log(isExpanded)
    }
}