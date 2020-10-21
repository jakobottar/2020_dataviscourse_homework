let beeswarm
let table

loadData().then(data => {
    table = new Table(data)
    beeswarm = new Beeswarm(data, table)

    // table.doSomething()
    // beeswarm.doSomething()
})

async function loadData(){
    return d3.json('./data/words.json')
}

function updatePlot(){
    let isChecked = document.getElementById('expandSwitch').checked
    beeswarm.updatePlot(isChecked)
    table.updateTable()
}