class Beeswarm {
    constructor(data){ 
        this.data = data;

        this.size = {
            height: undefined,
            width: undefined,
            padding: 25
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
        let axisPts = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60]

        let xScale = d3.scaleLinear()
            .domain([d3.min(this.data, d => d.position), d3.max(this.data, d => d.position)])
            .range([this.size.padding, this.size.width-this.size.padding])

        let axis = d3.select('#axis')

        axis.selectAll('line')
            .data(axisPts)
            .enter()
            .append('line')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 20)
            .attr('y2', 30)
            .classed('axis-line', true)

        axis.selectAll('text')
            .data(axisPts)
            .enter()
            .append('text')
            .attr('x', d => xScale(d))
            .attr('y', 45)
            .text(d => Math.abs(d))
            .classed('labs', true)

        axis.append('text')
            .attr('x', 0)
            .attr('y', 15)
            .text('Democratic Leaning')
            .classed('dem', true)

        axis.append('text')
            .attr('x', this.size.width)
            .attr('y', 15)
            .text('Republican Leaning')
            .classed('rep', true)

        axis.append('line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', 50)
            .attr('y2', 50)
            .attr('id', 'center-line')
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
                .attr('cy', function(d) { return isExpanded ? (d.moveY + 75 + 50) : (d.sourceY + 75 + 50) })
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
            .attr('x', 0)
            .attr('y', (_d, i) => {return isExpanded ? i*130 + 20 + 50 : 20 + 50})
            .text(d => d)
            .attr('opacity', d => {return isExpanded ? 100 : 0})    
            
        d3.select('#center-line')
            .transition()
            .duration(200)
            .attr('y2', isExpanded ? this.size.height : 200)
    }
}