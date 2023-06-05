const plugin = ({widgets, simulator, vehicle}) => {
    widgets.register("map", (box) => {
        const div = document.createElement("div");
        div.innerHTML = "Hello World";

        box.injecNode(div);
    })
}

export default plugin;