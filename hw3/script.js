/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
let barChart = document.getElementById("aBarChart")

for(let i = 0; i < barChart.childElementCount; i++){
	barChart.children[i].setAttribute("width", String(i*10 + 30))
}

}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
	/**
	 * D3 loads all CSV data as strings. While Javascript is pretty smart
	 * about interpreting strings as numbers when you do things like
	 * multiplication, it will still treat them as strings where it makes
	 * sense (e.g. adding strings will concatenate them, not add the values
	 * together, or comparing strings will do string comparison, not numeric
	 * comparison).
	 *
	 * We need to explicitly convert values to numbers so that comparisons work
	 * when we call d3.max()
	 **/

	for (let d of data) {
		d.cases = +d.cases; //unary operator converts string to number
		d.deaths = +d.deaths; //unary operator converts string to number
	}

	// Set up the scales
	let barChart_width = 345;
	let areaChart_width = 295;
	let maxBar_width = 240;
	let data_length = 15;
	let aScale = d3
		.scaleLinear()
		.domain([0, d3.max(data, d => d.cases)])
		.range([0, maxBar_width]);
	let bScale = d3
		.scaleLinear()
		.domain([0, d3.max(data, d => d.deaths)])
		.range([0, maxBar_width]);
	let iScale_line = d3
		.scaleLinear()
		.domain([0, data.length])
		.range([10, 500]);
	let iScale_area = d3
		.scaleLinear()
		.domain([0, data_length])
		.range([0, 260]);

	// Draw axis for Bar Charts, Line Charts and Area Charts (You don't need to change this part.)
	d3.select("#aBarChart-axis").attr("transform", "translate(0,210)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([barChart_width, barChart_width-maxBar_width])).ticks(5));
	d3.select("#aAreaChart-axis").attr("transform", "translate(0,245)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([areaChart_width, areaChart_width-maxBar_width])).ticks(5));
	d3.select("#bBarChart-axis").attr("transform", "translate(5,210)").call(d3.axisBottom(bScale).ticks(5));
	d3.select("#bAreaChart-axis").attr("transform", "translate(5,245)").call(d3.axisBottom(bScale).ticks(5));
	let aAxis_line = d3.axisLeft(aScale).ticks(5);
	d3.select("#aLineChart-axis").attr("transform", "translate(50,15)").call(aAxis_line);
	d3.select("#aLineChart-axis").append("text").text("New Cases").attr("transform", "translate(50, -3)")
	let bAxis_line = d3.axisRight(bScale).ticks(5);
	d3.select("#bLineChart-axis").attr("transform", "translate(550,15)").call(bAxis_line);
	d3.select("#bLineChart-axis").append("text").text("New Deaths").attr("transform", "translate(-50, -3)")

	// ****** TODO: PART III (you will also edit in PART V) ******

	// Select and update the 'a' bar chart bars
	let aBar = d3
		.select('#aBarChart')
		.selectAll('rect')
		.data(data)
		.on("mouseover", mouseOver)
		.on("mouseout", mouseOut)
		
	aBar.transition()
		.duration(150)
		.attr("width", d => aScale(d.cases))

	aBar.exit()
		.transition()
		.duration(150)
		.attr("width", 0)

	// Select and update the 'b' bar chart bars
	let bBar = d3
		.select('#bBarChart')
		.selectAll('rect')
		.data(data)

	let bBarEnter = bBar.enter()
		.append("rect")
		.attr("height", 12)
		.on("mouseover", mouseOver)
		.on("mouseout", mouseOut)

	bBarEnter.transition()
		.duration(150)
		.attr("transform", (d,i) => "translate(0, "+14*i+")")
		.attr("width", d => bScale(d.deaths))

	bBar.transition()
		.duration(150)
		.attr("width", d => bScale(d.deaths))

	bBar.exit()
		.transition()
		.duration(150)
		.attr("width", 0)

	// TODO: Make animation look better
	// Select and update the 'a' line chart path using this line generator
	let aLineGenerator = d3
		.line()
		.x((d, i) => iScale_line(i))
		.y(d => aScale(d.cases));

	let aPathString = aLineGenerator(data)

	let aLine = d3
		.select('#aLineChart')
		.transition()
		.duration(150)
		.attr("d", aPathString)

	// Select and update the 'b' line chart path (create your own generator)
	let bLineGenerator = d3
		.line()
		.x((d, i) => iScale_line(i))
		.y(d => bScale(d.deaths));

	let bPathString = bLineGenerator(data)

	let bLine = d3
		.select('#bLineChart')
		.transition()
		.duration(150)
		.attr("d", bPathString)

	// Select and update the 'a' area chart path using this area generator
	let aAreaGenerator = d3
		.area()
		.x((d, i) => iScale_area(i))
		.y0(0)
		.y1(d => aScale(d.cases));

	let aAreaString = aAreaGenerator(data)

	let aArea = d3
		.select('#aAreaChart')
		.transition()
		.duration(150)
		.attr("d", aAreaString)

	// Select and update the 'b' area chart path (create your own generator)
	let bAreaGenerator = d3
		.area()
		.x((d, i) => iScale_area(i))
		.y0(0)
		.y1(d => bScale(d.deaths));

	let bAreaString = bAreaGenerator(data)

	let bArea = d3
		.select('#bAreaChart')
		.transition()
		.duration(150)
		.attr("d", bAreaString)

	// Select and update the scatterplot points

	// new b scale to invert the y axis (display it properly)
	let bScale2 = d3
		.scaleLinear()
		.domain([0, d3.max(data, d => d.deaths)])
		.range([maxBar_width, 0]);

	d3.select("#x-axis").call(d3.axisBottom(aScale).ticks(5));
	d3.select("#y-axis").call(d3.axisLeft(bScale2).ticks(5));

	let plot = d3
		.select('#scatterplot')
		.selectAll('circle')
		.data(data)

	let plotEnter = plot.enter()
		.append("circle")
		.on("mouseover", mouseOver)
		.on("mouseout", mouseOut)
		.on("click", function () {
			let data = d3.select(this).data()[0]
			console.log('Date: ' + data.date + '\n' + 'Cases: ' + data.cases + '\n' + 'Deaths: ' + data.deaths)
		})

	plotEnter.transition()
		.duration(150)
		.attr("cx", d => aScale(d.cases))
		.attr("cy", d => bScale2(d.deaths))
		.attr("r", 4)

	plotEnter.append("svg:title")
        .text(function(d, i) { return "Cases: " + d.cases + ", Deaths: " + d.deaths });
		
	plot.transition()
		.duration(150)
		.attr("opacity", 1)
		.attr("cx", d => aScale(d.cases))
		.attr("cy", d => bScale2(d.deaths))

	plot.exit()
		.transition()
		.duration(150)
		.attr("opacity", 0)

	// ****** TODO: PART IV ******
}

function mouseOver(d, i) {
	d3.select(this).classed('hovered', true)
}
function mouseOut(d, i) {
	d3.select(this).classed('hovered', false)
}

/**
 * Update the data according to document settings
 */
async function changeData() {
	//  Load the file indicated by the select menu
	let dataFile = document.getElementById("dataset").value;
	try {
		const data = await d3.csv("data/" + dataFile + ".csv");
		if (document.getElementById("random").checked) {
		// if random
		update(randomSubset(data)); // update w/ random subset of data
		} else {
		// else
		update(data); // update w/ full data
		}
	} catch (error) {
		console.log(error)
		alert("Could not load the dataset!");
	}
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  	return data.filter(d => Math.random() > 0.5);
}
