/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data, updateCountry) {
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
    }

    /**
     * Renders the map
     * @param world the json data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        let that = this

        let path = d3.geoPath()
            .projection(this.projection);

        d3.select('#map-chart')
            .append('svg')
            .append('g')
            .attr('id', 'mapLayer')

        d3.select("#mapLayer").selectAll("path")
			.data(world.features)
			.join("path")
            .attr("d", path)
            .attr("id", d => `${d.id.toLowerCase()}-map`)
            .attr("class", d => { 
                let popData = this.populationData.find( ({ geo }) => geo === d.id.toLowerCase() )
                if(typeof popData !== 'undefined'){
                    return popData.region
                }
                return "countries"
            })
            .classed('boundary', true)
            .on('click', function(d) {
                that.updateCountry(d.id.toLowerCase())
            })

        let graticule = d3.geoGraticule();
        d3.select("#mapLayer")
            .append('path')
            .datum(graticule)
            .classed('graticule', true)
            .attr('d', path)

        d3.select("#mapLayer")
            .append("path")
            .datum(graticule.outline)
            .classed("graticule outline", true)
            .attr("d", path);
            
    }

    /**
     * Highlights the selected country and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        d3.select(`#${activeCountry}-map`).classed('selected-country', true)
    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        d3.select("#mapLayer").selectAll("path").classed('selected-country', false)
    }
}
