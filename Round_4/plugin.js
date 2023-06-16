function calculateDistance(point_1, point_2) {
    // Calculate the differences between the coordinates
    var x1 = point_1.lng;
    var y1 = point_1.lat;

    var x2 = point_2.lng;
    var y2 = point_2.lat;
    
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;

    // Calculate the squared distances
    var squaredDeltaX = deltaX * deltaX;
    var squaredDeltaY = deltaY * deltaY;

    // Calculate the squared distance between the two points
    var squaredDistance = squaredDeltaX + squaredDeltaY;

    // Calculate the absolute distance
    var distance = Math.sqrt(squaredDistance);

    // console.log(deltaX);
    // console.log(deltaY);

    return distance;
}


class TurnSignal {
    constructor(carMarker, window) {
        this.carMarker = carMarker;
        this.map = window.map;
        this.turnSignalLayer = window.L.layerGroup().addTo(this.map);
        this.blinkInterval = null;
        this.isTurnedOn = false;
        this.radius = 4;
        this.color = 'orange';
        this.L = window.L;
        this.turn = null;
    }

    turnLeft() {

        this.turnOff();
        this.turn = 'left';

        if (!this.isTurnedOn) {
        this.isTurnedOn = true;

        // Calculate the position for left turn signal based on car heading
        const carHeading = this.carMarker.options.rotationAngle;
        const leftSignalPos = this.calculateSignalPosition(carHeading, this.turn);

        // Create the turn signal circle
        const turnSignal = this.L.circle(leftSignalPos, {
            color: this.color,
            fillColor: this.color,
            fillOpacity: 1,
            radius: this.radius,
        });

        // Add the turn signal to the turnSignalLayer
        this.turnSignalLayer.addLayer(turnSignal);

        // Start blinking the turn signal circle
        this.blinkInterval = setInterval(() => {
            this.toggleTurnSignal();
        }, 500); // Blink interval in milliseconds
        }
    }

    turnRight() {

        this.turnOff();
        this.turn = 'right';

        if (!this.isTurnedOn) {
        this.isTurnedOn = true;

        // Calculate the position for right turn signal based on car heading
        const carHeading = this.carMarker.options.rotationAngle;
        const rightSignalPos = this.calculateSignalPosition(carHeading, 'right');

        // Create the turn signal circle
        const turnSignal = this.L.circle(rightSignalPos, {
            color: this.color,
            fillColor: this.color,
            fillOpacity: 1,
            radius: this.radius,
        });

        // Add the turn signal to the turnSignalLayer
        this.turnSignalLayer.addLayer(turnSignal);

        // Start blinking the turn signal circle
        this.blinkInterval = setInterval(() => {
            this.toggleTurnSignal();
        }, 500); // Blink interval in milliseconds
        }
    }

    turnOff() {
        this.turn = null;

        if (this.isTurnedOn) {
        this.isTurnedOn = false;

        // Clear the blinking interval and remove the turn signals from the turnSignalLayer
        if (this.blinkInterval !== null) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
        this.turnSignalLayer.clearLayers();
        }
    }

    updatePos() {
        if (this.turn !== null) {
            this.turnSignalLayer.eachLayer((turnSignal) => {
                turnSignal.setLatLng(this.calculateSignalPosition(this.carMarker.options.rotationAngle, this.turn))
            });
        }
    }

    toggleTurnSignal() {
        // Toggle the turn signal circles visibility
        this.turnSignalLayer.eachLayer((turnSignal) => {
        if (this.map.hasLayer(turnSignal)) {
            this.map.removeLayer(turnSignal);
        } else {
            turnSignal.addTo(this.map);
        }
        });
    }

    calculateSignalPosition(heading, side) {
        // Adjust the distance of the signal from the car's headlights
        const distance = 10; // Adjust as needed
        const car_size = this.carMarker.options.icon.options.iconSize;

        // Calculate the position based on the car's heading and side
        const angle = heading * (Math.PI / 180);
        const a = (side === 'right') ? 1 : -1;

        const carLatLng = this.carMarker.getLatLng();

        var offsetX;
        var offsetY;

        // console.log(heading);
        // console.log(Math.abs(heading) / 90);
        // console.log(Math.abs(heading) / 90 % 2);

        if (Math.abs(heading) / 90 % 2 === 0) {
            offsetX = car_size[0]/4 * Math.cos(angle) + 5 * Math.cos(angle + Math.PI);
            offsetY = a * distance * Math.cos(angle)  + 4 * a * Math.cos(angle + Math.PI);
        } else {
            offsetY = Math.cos(angle - Math.PI / 2) * car_size[0] / 4 + 5 * Math.cos(angle + Math.PI / 2);
            offsetX = a * distance * Math.cos(angle + Math.PI / 2)  + 4 * a * Math.cos(angle - Math.PI / 2);
        }
            
        const signalLatLng = this.L.latLng(carLatLng.lat - offsetY, carLatLng.lng + offsetX);

        return signalLatLng;
    }
}

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

var head_map = {
    "east": 1,
    "south": -1,
    "west": -1,
    "north": 1
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
    
        const car = new Car(this.window, carMarker);
        
        return car;
    }
}

class Car {
    constructor(window, element, zone = null) {
        this.element = element;
        this.speed = 0;
        this.angle = element.options.rotationAngle;
        
        this.heading = findHeading(this.angle);
        this.pos = this.element.getLatLng();
        this.L = window.L;
        this.zone = zone;
        this.turn = "s";
        this.canTurn = false;
        this.signal = new TurnSignal(element, window);
        this.window = window;
        
        this.status = null;
        this.turn_around = null;
    }

    getPos() {
        return this.element.getLatLng();
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
        this.signal.turnRight();
    }
    
    turnLeft() {
        this.turn = 'l'
        this.signal.turnLeft();
    }

    updateTurn() {
        if (this.turn === 's') {
            return;
        }

        if (this.turn === 'r' && !this.canTurn) {
            return;
        }

        var distance = calculateDistance(this.getPos(), this.window.chooseRoad.getCenter());

        if (this.status === null && this.canTurn === false && distance > 200) {
            // console.log("TURN");
            this.turnAround();
            if (this.turn === 'r') {
                this.rotate(90);
            } else if (this.turn === 'l') {
                this.rotate(-90);
            }
            return;
        }

        // console.log(this.turn_around);
        if (this.status === 'around') {
            if (this.turn_around > 0) {
                this.turn_around -= this.speed / 1000 * 10;
                return;
            }

            if (this.turn === 'r') {
                this.rotate(90);
            } else if (this.turn === 'l') {
                this.rotate(-90);
            }

            this.signal.turnOff();
            this.turn = 's';
            this.status = null;

        }


        if (this.canTurn) {
            let count_cross = this.window.count_cross;

            // console.log(count_cross);

            if (count_cross == 1 && this.turn === 'l') {
                return;
            }

            if (this.turn === 'r') {
                this.rotate(90);
            } else if (this.turn === 'l') {
                this.rotate(-90);
            }

            this.signal.turnOff();
            this.turn = 's';
            this.status = null;
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
        this.signal.updatePos();

        map.panTo(pos);
    }

    changeColor(color) {
        this.window.changeColor(this.zone, color);
    }

    collisionDetect(car) {
        var point = car.element.getLatLng();

        var distance = calculateDistance(point, this.zone.getLatLng());
        // console.log(point);

        console.log(distance);

        if (distance < this.zone.getRadius() + 20 && (head_map[this.heading] + head_map[car.heading]) !== 0) {
            
            if (distance < this.zone.getRadius() / 2 + 20) {
                this.changeColor('r');
                console.log("STOP");
                return;
            }

            this.changeColor('y');
            console.log("SLOW");
        } else {
            console.log("GOOO");
            this.changeColor('g');
        }
    }

    turnAround() {
        this.status = "around";

        var chooseRoad = this.window.chooseRoad;

        var point = chooseRoad.getCenter();

        var cX = point.lng;
        var cY = point.lat;

        var car_point = this.getPos();

        if (this.turn === 'l' && this.angle / 90 % 2 == 0) {
            this.turn_around = Math.abs(car_point.lat - cY) * 2;
        } else {
            this.turn_around = Math.abs(car_point.lng - cX) * 2;

        }
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
    
    widgets.register("map", (box) => {
        let box_window = box.window;
        let box_iframe = box_window.frameElement;
        let box_document = box_iframe.contentDocument;
        
        box_iframe.srcdoc = iframeContent;

        box_iframe.addEventListener("load", () => {            
            let carMarker = box_window.carMarker;
            let mapContainer = box_window.document.getElementById("map");
            let map = box_window.map;
            
            var box_obj = new Box(box_window);
            window.box = box_obj;


            // map.setZoom(1.5);
            car = new Car(box_window, carMarker, box_window.circle);

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
            
            box_window.addEventListener("resize", resizeMap);
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
