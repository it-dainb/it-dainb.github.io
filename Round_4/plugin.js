// window.onload = function() {
//     // Access the carMarker variable from the global object
//     carMarker = window.carMarker;
//     chooseRoad = window.chooseRoad;

// };


const map = ({ widgets, simulator, vehicle }) => {
    const map_div = document.createElement("div");
    

    var head = `
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
    <link rel="stylesheet" href="https://it-dainb.github.io/Round_4/leaflet/leaflet.css"/>
    <script src="https://it-dainb.github.io/Round_4/leaflet/leaflet.js"></script>
    <script src="https://it-dainb.github.io/Round_4/leaflet/leaflet.rotatedMarker.js"></script>
    `;
    
    var body = `
    <div id="map"></div>
    <script src="https://it-dainb.github.io/Round_4/script.js"></script>
    <!-- <script src="plugin.js"></script> -->
    `;

    map_div.innerHTML = `
        
    `;

    // Append the div to the document body
    // document.body.appendChild(map_div);

    widgets.register("map", (box) => {
        let box_document = box.window["frameElement"].contentDocument;
        let box_head = box_document.head;
        let box_body = box_document.body;

        box_head.innerHTML = head;
        box_body.innerHTML = body;
        // box.document.head.innerHTML = head;
        // box.injectNode(map_div);
    });

};

export default map;
