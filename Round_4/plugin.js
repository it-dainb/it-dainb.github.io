function findHeading(angle) {
    let heading;
    
    if (angle % 360 == 0) {
        heading = "east";
    } else if (angle % 90 == 0) {
        heading = "south";
    } else if (angle % 180 == 0) {
        heading = "west";
    } else {
        heading = "north";
    }

    return heading;
}

class Car {
    constructor(element, L, zone) {
        this.element = element;
        this.speed = 0;
        this.angle = element.options.rotationAngle;
        
        this.heading = findHeading(this.angle
            );
        this.pos = this.element.getLatLng();
        this.L = L;
        this.zone = zone;
    }

    move(speed) {
        this.speed = speed;
    }

    stop() {
        this.speed = 0;
    }

    rotate(angle) {
        this.angle += angle;
        this.element.setRotationAngle(this.angle);

        this.heading = findHeading(this.angle);
    }

    update(map) {
        let pos = this.element.getLatLng();
        let speed = this.speed / 1000 * 10;
        let angle = this.angle * Math.PI / 180;

        pos = this.L.latLng(pos.lat + -1 * Math.sin(angle) * speed, pos.lng + Math.cos(angle) * speed);
        this.element.setLatLng(pos);

        map.panTo(pos);
    }
}

var car;

const map = ({ widgets, simulator, vehicle }) => {
    var iframe_head = `
    <style>
        #map {
            position: relative;
            width: 733px;
            height: 733px;
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
    
    var iframe_body = `
    <div id="map"></div>
    <script src="http://localhost:5500/Round_4/script.js"></script>
    <!-- <script src="plugin.js"></script> -->
    `;


    // Append the div to the document body
    // document.body.appendChild(map_div);

    var iframeContent = '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            iframe_head +
            '</head>' +
            '<body>' +
            iframe_body +
            '</body>' +
            '</html>';
    
    var oneTime = true;
    
    widgets.register("map", (box) => {
        let box_window = box.window;
        let box_iframe = box_window.frameElement;
        let box_document = box_iframe.contentDocument;
        
        box_iframe.srcdoc = iframeContent;

        box_iframe.addEventListener("load", () => {
            let iframeWindow = box_iframe.contentWindow;
            
            let carMarker = iframeWindow.carMarker;
            let mapContainer = iframeWindow.document.getElementById("map");
            let map = iframeWindow.map;
            
            // map.setZoom(1.5);
            car = new Car(carMarker, iframeWindow.L, box_window.circle);

            box_window.changeColor('y');

            // car.rotate(90);
            car.move(60);
            // car.update();

            // Adjust map container dimensions
            function resizeMap() {
                const width = box_iframe.clientWidth;
                const height = box_iframe.clientHeight;
                mapContainer.style.width = width + "px";
                mapContainer.style.height = height + "px";
            }

            // resizeMap();
            
            box_iframe.contentWindow.addEventListener("resize", resizeMap);
            // Access the carMarker variable here
            setInterval(() => {
                // console.log(box_window.canTurn);

                if (box_window.canTurn && oneTime) {
                    car.rotate(90);
                    oneTime = false;
                } else if (!box_window.canTurn) {
                    oneTime = true;
                }



                car.update(map);
            }, 10)
        });
    });

};

export default map;
