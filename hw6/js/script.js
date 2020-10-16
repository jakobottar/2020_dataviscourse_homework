loadData().then(data => {
    let beeswarm = new Beeswarm(data)
    let table = new Table(data)

    // table.doSomething()
    // beeswarm.doSomething()
})

async function loadData(){
    return d3.json('./data/words.json')
}