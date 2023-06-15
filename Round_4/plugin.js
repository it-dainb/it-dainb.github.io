// window.onload = function() {
//     // Access the carMarker variable from the global object
//     carMarker = window.carMarker;
//     chooseRoad = window.chooseRoad;

// };


const map = ({ widgets, simulator, vehicle }) => {
    const map_div = document.createElement("div");
    
    map_div.innerHTML = `
    <title>Car Drawing and Moving Map</title>
    <style>
        #map {
            position: relative;
            width: 500px;
            height: 300px;
            overflow: hidden;
            border: 1px solid black;
        }

        #carCanvas {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/it-dainb/it-dainb.github.io@main/Round_4/leaflet/leaflet.css"/>
    <div id="map"></div>
    <script src="https://cdn.jsdelivr.net/gh/it-dainb/it-dainb.github.io@main/Round_4/leaflet/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/it-dainb/it-dainb.github.io@main/Round_4/leaflet/leaflet.rotatedMarker.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/it-dainb/it-dainb.github.io@main/Round_4/script.js"></script>
    <!-- <script src="plugin.js"></script> -->
    `;

    // Append the div to the document body
    // document.body.appendChild(map_div);

    widgets.register("map", (box) => {
        box.injectNode(map_div);
    });

};

export default map;
