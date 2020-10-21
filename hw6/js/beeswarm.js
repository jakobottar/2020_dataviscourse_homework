class Beeswarm {
    constructor(data, tableObj){ 
		this.data = data;
		
		this.table = tableObj

        this.size = {
            height: undefined,
            width: undefined,
			padding: 25,
			axisPadding: 50
        };

		console.log(this.data)
        this.drawPlot()
    }

    updatePlotSize(){
        this.size.width = d3.select('#beeswarm').node().getBoundingClientRect().width;
        this.size.height = d3.select('#beeswarm').node().getBoundingClientRect().height;
    }

    drawPlot(){
        let svgGroup = d3.select('#beeswarm')
            .append('svg')
            .classed('wrapper-group', true)

        // set size of plot
        this.updatePlotSize()

        svgGroup.append('g').attr('id', 'axis')
        svgGroup.append('g').attr('id', 'circles')
        svgGroup.append('g').attr('id', 'plot-text')

        let tooltip = d3.select('#beeswarm')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0)
        
        tooltip.append('h2')
            .classed('tooltip-header', true)

        // TODO: Find a better way to do this
        tooltip.append('span')
            .classed('tooltip-stats-l1', true)
        tooltip.append('br')
        tooltip.append('span')
            .classed('tooltip-stats-l2', true)

        this.updatePlot()
    }

    updatePlot(isExpanded = false){
        this.drawAxis()
        this.drawCircles(isExpanded)
		this.drawText(isExpanded)
		this.drawBrush(isExpanded)
    }

    drawAxis(){
        this.updatePlotSize()

        let axisPts = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]

        let xScale = d3.scaleLinear()
            .domain([d3.min(this.data, d => d.position), d3.max(this.data, d => d.position)])
            .range([this.size.padding, this.size.width-this.size.padding])

        let axis = d3.select('#axis')

        // TODO: Do this with built-in d3 functions

        axis.selectAll('line')
            .data(axisPts)
            .join('line')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 20)
            .attr('y2', 30)
            .classed('axis-line', true)

        axis.selectAll('text')
            .data(axisPts)
            .join('text')
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
        this.updatePlotSize()

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
            .range(d3.schemeSet2.slice(0, 6))

        // TODO: In order to dynamically size the width of the plot and make everything look good, I'll need to do the hacker version :(
        let circles = d3.select('#circles')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .on('mouseover', this.mouseOver)
            .on('mousemove', this.mouseMove)
            .on('mouseout', this.mouseOut)
            
        circles.transition()
            .duration(200)
            .attr('cy', function(d) { return isExpanded ? (d.moveY + 75 + 50) : (d.sourceY + 75 + 50) })
            .attr('cx', function(d) { return isExpanded ? xScale(d.moveX) : xScale(d.sourceX) })
            .attr('r', d => rScale(+d.total))
            .attr('fill', d => colorScale(d.category))
    }

    drawText(isExpanded = false){
        this.updatePlotSize()

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
            .attr('opacity', _ => {return isExpanded ? 100 : 0})    
            
        d3.select('#center-line')
            .transition()
            .duration(200)
            .attr('y2', isExpanded ? this.size.height : 200) 
    }

    drawBrush(isExpanded = false){
		let xScale = d3.scaleLinear()
            .domain([d3.min(this.data, d => d.position), d3.max(this.data, d => d.position)])
            .range([this.size.padding, this.size.width-this.size.padding])
		
		let brushGroup = d3
			.select('#beeswarm')
			.select('.wrapper-group')
			.append("g")
			.attr('transform', `translate(0, ${this.size.axisPadding})`)
			.classed("brush", true);

		let that = this

		const xBrush = d3
			.brushX()
			.extent([[0, 0], [this.size.width, 150]])
			.on('start', _ => {console.log('started brushing!')})
			.on('end', function () {
				const selection = d3.brushSelection(this);
				const selectedData = [];

				console.log(selection)

				console.log(xScale(110.35))
				
				if (selection) {
					const [left, right] = selection;
					that.data.forEach((d, i) => {
						if (
							xScale(d.position) >= left &&
							xScale(d.position) <= right 
						) {
							selectedData.push(that.data[i]);
						}
					});
					that.table.updateData(selectedData)
				}
				else{
					that.table.updateData()
				}
				console.log(selectedData)
				
			})

		brushGroup.call(xBrush)
    }

    mouseOver(data){
        let round = (d) => Math.round(100*Math.abs(d))/100

        d3.select('.tooltip-header')
            .text(`${data.phrase.replace(/\b\w/g, c => c.toUpperCase())}`)

        d3.select('.tooltip-stats-l1')
            .text(`${data.position > 0 ? "R+" : "D+"}, ${round(data.position)}%`)
        d3.select('.tooltip-stats-l2')
            .text(`in ${Math.round((data.total/50)*100)}% of speeches`)


        d3.select('.tooltip')
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