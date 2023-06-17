// var API = 'https://teamabcd.digitalauto.tech/api/data';
var API = 'https://it-dainb-github-io.vercel.app/api/data';
// var API = 'http://127.0.0.1:8090/api/data';

var carList = {}; // Array to store cars

window.carList = carList;

var pre_document = document.hidden;

function getRandomNumberInRange(a, b) {
    var max = Math.pow(2, b);
    return Math.floor(Math.random() * (max - a + 1)) + a;
}

async function sendData(car, box, carList, pre_document) {
    // console.log(car);
    var carListPos = {};

    for (let car_ID in carList) {
        carListPos[car_ID] = {};
        carListPos[car_ID]["x"] = carList[car_ID].getX();
        carListPos[car_ID]["y"] = carList[car_ID].getY();
        carListPos[car_ID]["turn"] = carList[car_ID].turn;
        carListPos[car_ID]["angle"] = carList[car_ID].angle;
    }

    let data = {
        ID: car.ID,
        x: car.getX(),
        y: car.getY(),
        speed: car.speed,
        angle: car.angle,
        turn: car.turn,
        carList: carListPos,
        hidden: document.hidden,
        priority: car.priority,
        dicision: car.dicision
    };

    // console.log("SEND DATA")
    try {
        const response = await fetch("https://it-dainb-github-io.vercel.app/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (car.ID === null) {
            car.ID = responseData.ID;
            console.log("MY ID", car.ID);
        }
        
        if (pre_document === true && document.hidden === false) {
            car.setPos([responseData.carY, responseData.carX]);
            car.turn = responseData.turn;
            car.angle = responseData.angle;
            car.setRotationAngle();

            if (car.turn === 's') {
                car.turnOff();
            } else if (car.turn === 'r') {
                car.turnRight();
            } else {
                car.turnLeft();
            }
            console.log("SET NEW");
        }

        var carRemove = responseData.Remove_car;
        // console.log(responseData.cars);

        for (const ID in responseData.cars) {
            const car_data = responseData.cars[ID];
            // console.log(carRemove)

            // if (car_data.ID === car.ID) {
            //     continue;
            // }

            let tempCar = null;
            if (!(car_data.ID in carList)) {
                console.log("CREATE CAR", car_data.ID);
                tempCar = box.createCar([car_data.y, car_data.x]);
                carList[car_data.ID] = tempCar;
            } else {
                tempCar = carList[car_data.ID];
            }
            
            tempCar.priority = car_data.priority;
            tempCar.dicision = car_data.dicision;
            
            if ((pre_document === true && document.hidden === false) || tempCar.ID === null) {
                console.log("SYNC")
                
                if (tempCar.ID === null) {
                    tempCar.ID = car_data.ID;
                }

                tempCar.setPos([car_data.y, car_data.x]);
    
                tempCar.angle = car_data.angle;
                tempCar.speed = car_data.speed;
                tempCar.turn = car_data.turn;
                
                tempCar.setRotationAngle();
            }

            if (tempCar.turn === 's') {
                tempCar.turnOff();
            } else if (tempCar.turn === 'r') {
                tempCar.turnRight();
            } else {
                tempCar.turnLeft();
            }

            if (tempCar.dicision !== 0) {
                tempCar.speed = car_data.speed;
            }
        }

        // console.log(carList);
        // console.log(carRemove);
        // console.log(carList);
        for (let idx in carRemove) {
            let carRID = carRemove[idx];
            for (let key in carList) {
                if (parseInt(key) === parseInt(carRID)) {
                    console.log("REMOVE CAR", carRID);
                    carList[key].remove();
                    delete carList[key];
                    break;
                }
            }
        }

        var collision_ID = car.collisionDetect(carList);
        
        // Case 2 xe cung chieu va xe collision o dang truoc
        for (var i = 0; i < collision_ID.length; i++) {
            let carID = collision_ID[i];
            let carTemp = carList[carID];
            
            // Giam toc khi xe dang truoc speed < xe minh | xe minh speed > 0
            if (carTemp.heading === car.heading) {
                if (car.heading === 'east' || car.heading === 'west') {
                    if (car.heading === 'east') {
                        if (carTemp.speed < car.speed && 1 * (carTemp.getX() - car.getX()) > 0) {
                            car.priority = carTemp.priority - 1;
                        }
                    } else {
                        if (carTemp.speed < car.speed && -1 * (carTemp.getX() - car.getX()) > 0) {
                            car.priority = carTemp.priority - 1;
                        }
                    }
                } else {
                    if (car.heading === 'north') {
                        if (carTemp.speed < car.speed && 1 * (carTemp.getY() - car.getY()) > 0) {
                            car.priority = carTemp.priority - 1;
                        }
                    } else {
                        if (carTemp.speed < car.speed && -1 * (carTemp.getY() - car.getY()) > 0) {
                            car.priority = carTemp.priority - 1;
                        }
                    }
                }
            }
        }

        // 0: go | 1: slow | 2: stop
        var dicision;
        var maxPri = car.priority;
        var countMax = 0;
        var countDup = 0;

        // Moi case o nga tu
        for (var i = 0; i < collision_ID.length; i++) {
            let carID = collision_ID[i];
            let carTemp = carList[carID];

            let carPri = carTemp.priority;

            if (carPri > maxPri) {
                countDup = 0;
                countMax += 1;
                maxPri = carPri;
            } else if ((carPri === maxPri) && (maxPri === car.priority)) {
                countDup += 1;
            }
        }

        // console.log(collision_ID);
        // console.log(countMax);
        // console.log(countDup);
        // console.log("=================");

        if (countMax === 0) {
            
            dicision = 0;
            if (countDup === 0) {
                car.penalty = 1;
            } else {
                car.penalty += 1;
                car.setPri();
                window.printTerminal("SOLVE AUTO PRIORITY -> " + car.priority);
            }

        } else if (countMax === 1) {
            dicision = 1;
        } else {
            dicision = 2;
        }

        if (car.collision === 2 && dicision !== 0) {
            dicision = 2;
        }

        // console.log(dicision);
        if (dicision === 1) {
            car.speed -= 0.05 * car.speed;
            // console.log("SPEED DOWN");
            if (car.speed < 1) {
                car.stop();
            }

            if (car.dicision != dicision) {
                window.printTerminal("DETECT LIGHT COLLISON -> SLOW DOWN")
            }
        } else if (dicision === 2) {
            car.stop()
            if (car.dicision != dicision) {
                window.printTerminal("DETECT DANGER COLLISON -> STOP")
            }
            // console.log("STOPPPPP");
        }

        car.dicision = dicision;

        if (document.hidden !== pre_document) {
            pre_document = document.hidden;
        }

        sendData(car, box, carList, pre_document);
    } catch (error) {
        // console.log("ERROR SEND AGAIN 50ms");
        console.log(error);
        setTimeout(() => {
            sendData(car, box, carList, pre_document);
        }, 50); // Retry after 1 second
    }
}

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
    let normalizedAngle = ((angle % 360) + 360) % 360;

    if (normalizedAngle === 0) {
        return 'east';
    }

    if (normalizedAngle === 90) {
        return 'south';
    }

    if (normalizedAngle === 180) {
        return 'west';
    }

    if (normalizedAngle === 270) {
        return 'north';
    }



}

var head_map = {
    "east": 1,
    "south": -2,
    "west": -1,
    "north": 2
}

class Box {
    constructor(window) {
        this.window = window;
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
    constructor(window, marker, zone = null) {
        this.marker = marker;
        this.speed = 0;
        this.angle = marker.options.rotationAngle;
        
        this.heading = findHeading(this.angle);
        this.pos = this.marker.getLatLng();
        this.L = window.L;
        this.zone = zone;
        this.turn = "s";
        this.signal = new TurnSignal(marker, window);
        this.window = window;
        
        this.status = null;
        this.turn_around = null;

        this.ID = null;
        this.priority = 0;

        this.count_cross = -1;
        this.oneTime = true;

        this.penalty = 1;
        this.autoP = true;

        this.collision = 0;
        this.dicision = 0;

        this.speedFactor = 0;
    }

    setPri(a = 0) {
        if (this.autoP) {
            this.priority = getRandomNumberInRange(this.priority + 1, this.penalty);
        } else {
            this.priority = a;
        }
    }

    canTurn() {
        var distance = calculateDistance(this.getPos(), this.carCenterMap());

        var canTurnBool = false;
        if (36 < distance && distance < 40) {
            // console.log(distance);
            canTurnBool = true;

            if (this.oneTime) {
                this.count_cross += 1;
                this.oneTime = false;
            }
        } else {
            if (this.count_cross === -1 || distance > 50 || this.count_cross === 2) {
                this.count_cross = 0;
            }

            // changeColor("y");
            this.oneTime = true;
        }

        return canTurnBool;
        
    }

    carCenterMap() {
        var mX = Math.floor(car.getX() / 250 / 2) * 500 + 250;
        var mY = Math.floor(car.getY() / 250 / 2) * 500 + 250;

        return this.L.latLng([mY, mX]);
    }

    getX() {
        return this.getPos().lng;
    }

    getY() {
        return this.getPos().lat;
    }

    getPos() {
        return this.marker.getLatLng();
    }

    move(speed) {
        this.speed = speed;
    }

    stop() {
        this.speed = 0;
        window.onBreak();
    }

    setRotationAngle() {
        this.marker.setRotationAngle(this.angle);
        this.heading = findHeading(this.angle);
    }

    rotate(angle) {
        this.angle += angle;
        this.setRotationAngle();
    }

    turnRight() {
        if (this.status === 'around') {
            return;
        }
        
        this.turnOff();
        
        this.turn = 'r';
        if (!this.signal.isTurnedOn) {
            this.signal.turnRight();
        }
    }
    
    turnLeft() {
        if (this.status === 'around') {
            return;
        }
        this.turnOff();

        this.turn = 'l'
        if (!this.signal.isTurnedOn) {
            this.signal.turnLeft();
        }
    }

    turnOff() {
        if (this.signal.isTurnedOn) {
            this.signal.turnOff();
        }
    }

    updateTurn() {
        if (this.turn === 's') {
            return;
        }

        if (this.turn === 'r' && !this.canTurn()) {
            return;
        }

        var distance = calculateDistance(this.getPos(), this.window.chooseRoad.getCenter());

        if (this.status === null && this.canTurn() === false && distance > 200) {
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


        if (this.canTurn()) {
            // console.log(count_cross);

            if (this.count_cross == 1 && this.turn === 'l') {
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
        this.marker.setLatLng(pos);
        // this.update(this.window.map);
    }

    update(map, autoPan = true) {
        this.updateTurn();

        let pos = this.marker.getLatLng();

        if (this.dicision !== 2) {
            let speed = this.speed / 1000 * 10;
            let angle = this.angle * Math.PI / 180;

            pos = this.L.latLng(pos.lat + -1 * Math.sin(angle) * speed, pos.lng + Math.cos(angle) * speed);
        }

        this.setPos(pos);
        this.signal.updatePos();

        if (autoPan) {
            map.panTo(pos);
        }
    }

    changeColor(color) {
        this.window.changeColor(this.zone, color);
    }

    collisionDetect(carList) {
        var collision_ID = [];
        var collision = 0;

        for (let car_ID in carList) {
            var car = carList[car_ID];
            var point = car.getPos();

            if ((head_map[this.heading] + head_map[car.heading]) === 0 && !this.canTurn()) {
                continue;
            }
            
            
            var distance = calculateDistance(point, this.zone.getLatLng());
            // console.log(point);

            // console.log(distance);

            if (distance < this.zone.getRadius() + 20) {
                collision = 1;

                if (distance < this.zone.getRadius() / 2) {
                    collision = 2;
                }
            }

            if (collision !== 0) {
                collision_ID.push(car_ID);
            }
        }

        if (collision === 1) {
            this.changeColor('y');
        } else if (collision === 2) {
            this.changeColor('r');
        } else {
            this.penalty = 1;
            this.changeColor('g');
        }

        this.collision = collision;

        return collision_ID;
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

    remove() {
        this.turnOff();
        this.marker.remove();
    }
}

var car;


function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
    });
}

function simulatorInit(simulator, car) {
    simulator("Vehicle.ADAS.CruiseControl.SpeedSet", "set", ({ args }) => {
        const [value] = args;
        // myCar.speed = int(value);
        car.speed = value;
    });
    
    simulator("Vehicle.CurrentLocation.Latitude", "get", () => {
        return car.getY();
    });
    
    simulator("Vehicle.CurrentLocation.Longitude", "get", () => {
        return car.getX();
    });

    simulator("Vehicle.Speed", "get", () => {
        return car.speed;
    });

    simulator("Vehicle.CurrentLocation.Heading", "get", () => {
        return toTitleCase(findHeading(car.angle));
    })
}

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
    
    let lane = parseInt(prompt("Enter the lane you want to put the car in (1 - 4):", "1"));
    while(lane < 1 || lane > 4) {
        lane = parseInt(prompt("Enter the lane you want to put the car in (1 - 4):", "1"));
    }

    var bound_lane = {
        1: [[200, 0], [250, 500]],
        2: [[250, 0], [300, 500]],
        3: [[0, 200], [500, 250]],
        4: [[0, 250], [500, 300]],
    }

    var angle_lane = {
        1: 0,
        2: 180,
        3: 90,
        4: -90,
    }

    var bound = bound_lane[lane]
    let latitude = parseInt(prompt("Enter latitude (" + bound[0][0] + " - " + bound[1][0]  +  ")", bound[0][0]));
    while (latitude < bound[0][0] || latitude > bound[1][0]) {
        latitude = parseInt(prompt("Enter latitude (" + bound[0][0] + " - " + bound[1][0]  +  ")", bound[0][0]));
    }

    let longitude = parseInt(prompt("Enter longitude (" + bound[0][1] + " - " + bound[1][1]  +  ")", bound[0][1]));
    while (longitude < bound[0][1] || longitude > bound[1][1]) {
        longitude = parseInt(prompt("Enter longitude (" + bound[0][1] + " - " + bound[1][1]  +  ")", bound[0][1]));
    }

    if (latitude === 200) {
        latitude += 20;
    } else if (latitude === 300) {
        latitude -= 20;
    }

    if (longitude === 200) {
        longitude += 20;
    } else if (longitude === 300) {
        longitude -= 20;
    }

    if (latitude === 250) {
        if (lane === 1) {
            latitude -= 20;
        } else if (lane === 2) {
            latitude += 20;
        }
    }
    
    if (longitude === 250) {
        if (lane === 3) {
            longitude -= 20;
        } else if (lane === 4) {
            longitude += 20;
        }
            
    }

    console.log(lane);

    
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
            console.log(angle_lane[lane])
            car.angle = angle_lane[lane];
            car.setRotationAngle();
            car.setPos([latitude, longitude]);
            car.update(map);
            // car.autoPri = autoPri;

            simulatorInit(simulator, car);

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
                car.autoP = window.autoPrior;

                if (!car.autoP) {
                    car.priority = window.priValue;
                }

                if (window.TurnClick === 'l') {
                    car.turnLeft();
                } else if (window.TurnClick === 'r') {
                    car.turnRight();
                }

                if (!window.brakeClick) {
                    let value = 20;
                    if (window.TurnClick === 'u') {
                        car.speed += value;
                    } else if (window.TurnClick === 'd') {
                        car.speed -= value;
                    }
                } else {
                    car.stop();
                }
                
                window.TurnClick = 's';

                car.update(map);

                for (let carID in carList) {
                    let tempCar = carList[carID];
                
                    tempCar.update(map, false);
                }
            }, 10)
            
            // send data
            sendData(car, box_obj, carList, pre_document);
        });

    });

    return {
        createCar: (pos, name) => {
            let box_car =  window.box.createCar(pos, name);
            // sendData(box_car, window.box, window.carList, pre_document);

            return box_car;
        }
    }

};

export default map;
