let beeswarm
let table

loadData().then(data => {
    beeswarm = new Beeswarm(data)
    table = new Table(data)

    // table.doSomething()
    // beeswarm.doSomething()
})

async function loadData(){
    return d3.json('./data/words.json')
}

function updatePlot(){
    let isChecked = document.getElementById('expandSwitch').checked
    beeswarm.updatePlot(isChecked)
}