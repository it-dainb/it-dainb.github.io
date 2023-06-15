const plugin = ({ widgets, simulator, vehicle }) => {
    const sampleDiv = document.createElement("div")
    sampleDiv.innerHTML = `
    <div style='font-size:20px;width:100%;height:100%;background-color:yellow;color:red;text-align:center;margin:auto;'>
        <div> Wiper status:  <span id="wiper">Unknown</span></div>
    </div>
    `

    let wiper = sampleDiv.querySelector("#wiper")

    setInterval(async () => {
        let value = await vehicle['Body.Windshield.Front.Wiping.Mode'].get()
        wiper.innerHTML = value
    }, 500)

    widgets.register("map", 
    (box) => {
        box.injectNode(sampleDiv)
    })
}

export default plugin;