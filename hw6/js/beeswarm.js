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

    drawCircles(isExpanded = false){
        // console.log(this.data)

        let xScale = d3.scaleLinear()
            .domain([d3.min(this.data, d => d.sourceX), d3.max(this.data, d => d.sourceX)])
            .range([this.size.padding, this.size.width-this.size.padding])

        let rScale = d3.scaleLinear()
            .domain([d3.min(this.data, d => +d.total), d3.max(this.data, d => +d.total)])
            .range([3, 13])

        // TODO: Get this list dynamically
        let bins = ['economy/fiscal issues', 'energy/environment', 'crime/justice', 'education', 'health care', 'mental health/substance abuse']

        let colorScale = d3.scaleOrdinal()
            .domain(bins)
            .range(d3.schemeSet2.slice(0, 5))

        // TODO: In order to dynamically size the width of the plot and make everything look good, I'll need to do the hacker version :(
        d3.select('#circles')
                .selectAll('circle')
                .data(this.data)
                .join('circle')
                .transition()
                .duration(200)
                .attr('cy', function(d) { return isExpanded ? (d.moveY + 75) : (d.sourceY + 75) })
                .attr('cx', function(d) { return isExpanded ? xScale(d.moveX) : xScale(d.sourceX) })
                .attr('r', d => rScale(+d.total))
                .attr('fill', d => colorScale(d.category))

    }

    drawText(isExpanded = false){
        let labs = ['Economy/Fiscal Issues', 'Energy/Environment', 'Crime/Justice', 'Education', 'Health Care', 'Mental Health/Substance Abuse']

        d3.select('#plot-text')
            .selectAll('text')
            .data(labs)
            .join('text')
            .classed('plot-labs', true)
            .transition()
            .duration(200)
            .attr('x', 10)
            .attr('y', (d, i) => {return isExpanded ? i*130 + 20 : 20})
            .text(d => d)
            .attr('opacity', d => {return isExpanded ? 100 : 0})
            
    }
}