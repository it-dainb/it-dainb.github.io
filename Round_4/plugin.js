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

class Box {
    constructor(element) {
        this.window = element;
    }

    createCar(pos, name = "car") {
        const images_path = "https://it-dainb.github.io/Round_4/images/";
        const iconUrl = images_path + name + '.png';
        
        var iconSize = 90  * this.window.scale;
        const carIcon = this.window.L.icon({
            iconUrl: iconUrl, // Replace with the URL to your car icon image
            iconSize: [iconSize, iconSize],
            iconAnchor: [iconSize / 2, iconSize / 2],
        });
    
        const carMarker = this.window.L.marker(
            pos,
            {   icon: carIcon ,
                rotationAngle: 0,
                rotationOrigin: "center",
            }
        ).addTo(this.window.map);
    
        const car = new Car(carMarker, this.window.L);
        
        return car;
    }
}

class Car {
    constructor(element, L, zone = null) {
        this.element = element;
        this.speed = 0;
        this.angle = element.options.rotationAngle;
        
        this.heading = findHeading(this.angle
            );
        this.pos = this.element.getLatLng();
        this.L = L;
        this.zone = zone;
        this.turn = "s";
        this.canTurn = false;
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

    turnRight() {
        this.turn = 'r';
    }

    turnLeft() {
        this.turn = 'l'
    }

    updateTurn() {
        if (this.canTurn && this.turn !== 's') {
            if (this.turn === 'r') {
                this.rotate(90);
            } else if (this.turn === 'l') {
                this.rotate(-90);
            }

            this.turn = 's';
        }
    }

    setPos(pos) {
        this.element.setLatLng(pos);
    }

    update(map) {
        this.updateTurn();


        let pos = this.element.getLatLng();
        let speed = this.speed / 1000 * 10;
        let angle = this.angle * Math.PI / 180;

        pos = this.L.latLng(pos.lat + -1 * Math.sin(angle) * speed, pos.lng + Math.cos(angle) * speed);
        this.setPos(pos);

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
            
            var box_obj = new Box(box_window);
            window.box = box_obj;

            // map.setZoom(1.5);
            car = new Car(carMarker, box_window.L, box_window.circle);

            window.car = car;
            // window.testCar = box_obj.createCar([300, 200]);;

            // car.zone.changeColor('y');

            // car.rotate(90);
            // car.move(60);
            // car.turnRight();
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
                car.canTurn = box_window.canTurn;




                car.update(map);
            }, 10)
        });
    });

};

export default map;
