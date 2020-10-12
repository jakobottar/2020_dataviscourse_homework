/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {

        this.data = data

        this.infoBox = d3.select('.inner-wrapper')
            .append('div')
            .attr('id', 'country-detail')

        let label = d3.select('#country-detail')
            .append("div")
            .classed("label", true)

        label.append('i')
            .attr('id', 'globe-icon')
            .classed("fas fa-globe-asia", true)

        label.append('span')
            .attr('id', 'info-box-label')
            .text("Select a country.")

        d3.select('#country-detail')
            .append('div')
            .attr('id', 'info-box-body')
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        let newData = []

        for (let key in this.data) {
            let countryData = this.data[key].find( ({ geo }) => geo === activeCountry )
            newData.push(new InfoBoxData(countryData.country, countryData.region, countryData.indicator_name, countryData[activeYear])) 
        }

        d3.select('#info-box-label').text(newData[0].country)
        d3.select('#globe-icon').classed(newData[0].region, true)

        let body = d3.select('#info-box-body')
            .selectAll('span')
            .data(newData)
        
        body.enter()
            .append('span')
            .text(d => `${d.indicator_name}: ${d.value}`)
            .classed("stat", true)

        body.text(d => `${d.indicator_name}: ${d.value}`)
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {
        d3.select('#info-box-label').text("Select a country.")
        d3.select('#globe-icon').attr('class', 'fas fa-globe-asia')

        d3.select('#info-box-body')
            .selectAll('span')
            .remove()
    }

}