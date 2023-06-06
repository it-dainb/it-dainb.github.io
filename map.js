function calculateDistance(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var road_making_ver = null;
var road_making_hor = null;

class Car {
    constructor(color, vehicle, document, map_div, randomPosition = -1) {
        this.ID = null;
        this.element = document.createElement("div");
        let head = document.createElement("div");
        head.className = "car-head"
        
        this.color = color;
        this.element.style.backgroundColor = this.color;
        this.speed = 0;
        this.vehicle = vehicle;

        this.element.className = "my-car";
        
        if (randomPosition == -1) {
            randomPosition = getRandomInteger(1, 4);
            var offsetPos = getRandomInteger(0, 300) + "px";
            // this.element.className = "my-car";
                
            switch (randomPosition) {
                case 1:
                    this.element.classList.add("one", "one");
                    this.element.style.left += offsetPos;
                    this.direction = "right";
                    this.totalRotation = 0;
                    this.lane = 1;
                    break;
                case 2:
                    this.element.classList.add("one", "three");
                    this.element.style.left += offsetPos;
                    this.direction = "left";
                    this.totalRotation = 180;
                    this.lane = 2;
                    break;
                case 3:
                    this.element.classList.add("two", "two");
                    this.element.style.top += offsetPos;
                    this.direction = "down";
                    this.totalRotation = 90;
                    this.lane = 3;
                    break;
                case 4:
                    this.element.classList.add("two", "four");
                    this.element.style.top += offsetPos;
                    this.direction = "up";
                    this.totalRotation = -90;
                    this.lane = 4;
                    break;
            }

        }   
        var currentTop = parseInt(
            window.getComputedStyle(this.element).getPropertyValue("top")
        );
        var currentLeft = parseInt(
            window.getComputedStyle(this.element).getPropertyValue("left")
        );

        this.element.style.backgroundColor = this.color;

        this.element.appendChild(head)
        map_div.appendChild(this.element);
    }

    setPosition(x, y) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    }

    showCar() {
        this.element.style.display = "block";
    }

    hideCar() {
        this.element.style.display = "none";
    }

    moveCarUp(vel) {
        // Calculate the new top and left positions based on the rotation angle
        this.speed += vel;
    }

    getX() {
        return parseInt(
            window.getComputedStyle(this.element).getPropertyValue("left")
        );
    }

    getY() {
        return parseInt(
            window.getComputedStyle(this.element).getPropertyValue("top")
        );
    }

    updatePosition() {
        var currentTop = parseInt(
            window.getComputedStyle(this.element).getPropertyValue("top")
        );
        var currentLeft = parseInt(
            window.getComputedStyle(this.element).getPropertyValue("left")
        );

        switch (this.direction) {
            case "right":
                this.element.style.left = currentLeft + this.speed + "px";
                break;
            case "down":
                this.element.style.top = currentTop + this.speed + "px";
                break;
            case "left":
                this.element.style.left = currentLeft - this.speed + "px";
                break;
            case "up":
                this.element.style.top = currentTop - this.speed + "px";
                break;
        }

        currentTop = parseInt(
            window.getComputedStyle(this.element).getPropertyValue("top")
        );
        currentLeft = parseInt(
            window.getComputedStyle(this.element).getPropertyValue("left")
        );

        if (road_making_hor) {
            if (this.direction == "right" || this.direction == "left") {
                // console.log(currentTop, road_making_hor)
                if (currentTop >= road_making_hor / 2) {
                    this.lane = 1;
                } else {
                    this.lane = 2;
                }
            }
        }

        if (road_making_ver) {
            if (this.direction == "up" || this.direction == "down") {
                // console.log(currentLeft, road_making_ver);
                if (currentLeft >= road_making_ver / 2) {
                    this.lane = 4;
                } else {
                    this.lane = 3;
                }
            }
        }
    }

    turnRight() {
        this.totalRotation += 90;
        this.element.style.transform = "rotate(" + this.totalRotation + "deg)";

        switch (this.direction) {
            case "right":
                this.direction = "down";
                break;
            case "down":
                this.direction = "left";
                break;
            case "left":
                this.direction = "up";
                break;
            case "up":
                this.direction = "right";
                break;
        }
    }

    turnLeft() {
        this.totalRotation -= 90;
        this.element.style.transform = "rotate(" + this.totalRotation + "deg)";
        switch (this.direction) {
            case "right":
                this.direction = "up";
                break;
            case "down":
                this.direction = "right";
                break;
            case "left":
                this.direction = "down";
                break;
            case "up":
                this.direction = "left";
        }
    }
}

const map = ({ widgets, simulator, vehicle }) => {
    const map_div = document.createElement("div");
    map_div.innerHTML = `
    <style>
    /* Style for the road */
    .road-horizontal {
      width: 100%;
      height: 150px;
      top: 50%;
      left:0;
      background-color: gray;
      position: absolute;
      transform: translateY(-50%);
    }

    /* Style for the road markings */
    .road-markings-horizontal {
        border: none;
        border-top: 10px dashed white;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

    .road-vertical {
        width: 150px;
        height: 100%;
        background-color: gray;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
      }

    .road-markings-vertical {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 10px; /* Adjust the width as needed */
        background-color: gray; /* Set the color of the line */
        left: 50%; /* Position the line in the middle of the container */
        transform: translateX(-50%); /* Center the line horizontally */
      }

    .road-markings-vertical::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        width: 0px; /* Adjust the width of the dashed line */
        border-left: 10px dashed white; /* Set the style and color of the dashed line */
        left: 0; /* Position the dashed line on the left side of the main line */
      }

    .my-car {
        width: 50px;
        height: 30px;
        background-color: red;
        position: absolute;
        transition: left 0.5s, top 0.5s, transform 0.5s;
    }

    .car-head {
        width: 40%;
        height: 100%;
        background-color: yellow;
        position: absolute;
        right: 0;
    }

    
    .my-car.one.one{
        top: calc(50% + 25px);
    }

    .my-car.one.three{
        top: calc(50% - 55px);
        transform: rotate(180deg);
    }

    .my-car.two.two{
        left: calc(50% - 65px);
        transform: rotate(90deg);
    }
    
    .my-car.two.four{
        top = 0px;
        left: calc(50% + 15px);
        transform: rotate(270deg);
    }


    .traffic-light {
        width: 4.5%;
        height: 70px;
        background-color: black;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: -80px;
        left: calc(50% - 115px);
        transform: rotate(180deg);
    }
    .light {
        width: 75%;
        height: 70%;
        border-radius: 50%;
        background-color: gray; /* Set default background color */
        margin: 10%;
    }
    
    .light.red.active{
    background-color: red; /* Set active red light color */
    }
    
    .light.yellow.active {
    background-color: yellow; /* Set active yellow light color */
    }
    
    .light.green.active {
    background-color: green; /* Set active green light color */
    }

    .traffic-light.one {
        left: calc(50% + 110px);
        top: calc(50% - 135px);
        transform: rotate(-90deg);
    }

    .traffic-light.two {
        top: 140px;
        left: calc(50% - 135px);
        transform: rotate(90deg);
    }
    
    .traffic-light.three {
        top: 160px;
        left: calc(50% + 88px);
        transform: rotate(0deg);
    }

    
    .note span {
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: left;
        width: 5.5%; /* Adjust the width to your preference */
        height: 40px; /* Adjust the height to your preference */
        border-radius: 50%;
      }
      
      .bold-text {
        font-weight: bold;
        font-size: 20px;
        margin-left: 60px;
      }
      
      .my-car-color {
        background-color: red;
        text-align: right;
      }
      
      .another-car-color {
        background-color: green;
        text-align: right;
      }
</style>
<div class="note">
<span class="my-car-color"><span class="bold-text">My car</span></span>
<br>
<span class="another-car-color"><span class="bold-text">Another car</span></span>
</div>

<div class="road-horizontal">
        <div class="traffic-light">
            <div class="light green"></div>
            <div class="light yellow"></div>
            <div class="light red"></div>
        </div>
        <div class="traffic-light one">
            <div class="light green"></div>
            <div class="light yellow"></div>
            <div class="light red"></div>
        </div>
        <div class="traffic-light two">
            <div class="light green"></div>
            <div class="light yellow"></div>
            <div class="light red"></div>
        </div>
        <div class="traffic-light three">
            <div class="light green"></div>
            <div class="light yellow"></div>
            <div class="light red"></div>
        </div>

    </div>
    <div class="road-vertical"></div>
    <div id="rmv" class="road-markings-vertical"></div>
    <div id="rmh" class="road-markings-horizontal"></div>
    `;

    // Append the div to the document body
    document.body.appendChild(map_div);

    road_making_ver = parseInt(
        window
            .getComputedStyle(document.getElementById("rmv"))
            .getPropertyValue("left")
    );
    road_making_hor = parseInt(
        window
            .getComputedStyle(document.getElementById("rmh"))
            .getPropertyValue("top")
    );

    var carList = {}; // Array to store cars

    const myCar = new Car("red", vehicle, document, map_div);

    function changeLights(trafficLight, activeIndex) {
        var lights = trafficLight.getElementsByClassName("light");

        // Turn off all lights and set them to the "inactive" class
        for (var i = 0; i < lights.length; i++) {
            lights[i].classList.remove("active");
            lights[i].classList.add("inactive");
        }

        // Turn on the next light by removing the "inactive" class and adding the "active" class
        lights[activeIndex].classList.remove("inactive");
        lights[activeIndex].classList.add("active");
    }

    var trafficLights = document.querySelectorAll(".traffic-light");

    async function fetchLightData() {
        try {
            const response = await fetch("http://localhost:5000/api/light", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(
                    "Request failed with status " + response.status
                );
            }

            const data = await response.json();

            // Handle the response data

            for (var i = 0; i < trafficLights.length; i++) {
                if (
                    trafficLights[i].classList.contains("one") ||
                    trafficLights[i].classList.contains("two")
                ) {
                    changeLights(trafficLights[i], data.light_2);
                } else {
                    changeLights(trafficLights[i], data.light_1);
                    // changeLights(trafficLights[i]);
                }
            }

            
            // console.log(data);
        } catch (error) {
            // Handle any errors that occurred during the fetch request
            console.error("Error:", error);
        }
    }

    setInterval(async () => {
        await fetchLightData();
    }, 100);

    // Start the traffic light sequence for each traffic light

    widgets.register("widget_map", (box) => {
        box.injectNode(map_div);
    });

    let boxGlobal = null;
    const speedController = document.createElement("div");
    speedController.setAttribute(
        "style",
        `height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`
    );
    speedController.innerHTML = `
      <div style="background-color: white; padding: 20px; text-align: center;">
        <div style="color: green; font-size: 30px;">Speed: <span id="get_status">0</span> km/h</div>
        <div style="margin-top: 10px; font-size: 16px;">
          <button id="car_speed_up" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8593;</button>
          <button id="car_speed_down" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8595;</button>
        </div>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px;">
        <button id="car_reset" style="width: 30px; height: 30px; background-color: gray; border-radius: 50%;"></button>
      </div>
    `;

    const directionController = document.createElement("div");
    directionController.setAttribute(
        "style",
        `height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`
    );

    directionController.innerHTML = `
  <div style="background-color: white; padding: 20px; text-align: center;">
    <div style="color: green; font-size: 30px;">Lane: <span id="get_lane">Stable</span></div>
    <div style="color: green; font-size: 30px;">Direction: <span id="get_direction">Stable</span></div>
    <div style="margin-top: 10px;
    display: flex; justify-content: center; align-items: center; ">
      <button id="arrow_left" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8592;</button>
      <button id="arrow_right" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8594;</button>
    </div>
  </div>
`;

    let directionState = directionController.querySelector("#get_direction");
    let laneState = directionController.querySelector("#get_lane");
    let arrowLeft = directionController.querySelector("#arrow_left");
    let arrowRight = directionController.querySelector("#arrow_right");

    let speedState = speedController.querySelector("#get_status");
    let carSpeedUp = speedController.querySelector("#car_speed_up");
    let carSpeedDown = speedController.querySelector("#car_speed_down");
    let carReset = speedController.querySelector("#car_reset");

    if (arrowLeft) {
        arrowLeft.addEventListener("click", () => {
            //   console.log("arrowLeft click");
            myCar.turnLeft();
        });
    }

    if (arrowRight) {
        arrowRight.addEventListener("click", () => {
            //   console.log("arrowRight click");
            myCar.turnRight();
        });
    }

    var vel = 5;
    if (carSpeedUp) {
        carSpeedUp.addEventListener("click", () => {
            // console.log("carSpeedUp click");
            myCar.moveCarUp(vel);
        });
    }
    if (carSpeedDown) {
        carSpeedDown.addEventListener("click", () => {
            // console.log("carSpeedDown click");
            myCar.moveCarUp(-1 * vel);
        });
    }

    if (carReset) {
        carReset.addEventListener("click", () => {
            // console.log("carReset click");
            myCar.moveCarUp(-1 * myCar.speed);
        });
    }

    const renderDirection = (value) => {
        if (directionState) {
            directionState.innerHTML = value;
        }
    };

    const renderLane = (value) => {
        if (laneState) {
            laneState.innerHTML = value;
        }
    };

    const renderSpeedStatus = (value) => {
        if (speedState) {
            speedState.innerHTML = value;
        }
    };

    const setlaneStatus = () => {
        // console.log("setLaneStatus ---------------------------");
        renderLane(myCar.lane);
    };

    const setDirectionStatus = (angle) => {
        // console.log("setDirectionStatus ---------------------------");
        var value = null;

        switch (angle) {
            case 0:
                value = "North";
                break;
            case 90:
                value = "East";
                break;
            case 180:
                value = "South";
                break;
            case 270:
                value = "West";
                break;
        }

        renderDirection(value);
    };

    const setSpeedStatus = (speed) => {
        //   console.log("setSpeedStatus ---------------------------");
        renderSpeedStatus(speed);
    };

    widgets.register("Speed", (box) => {
        box.injectNode(speedController);
    });

    widgets.register("Direction", (box) => {
        box.injectNode(directionController);
    });

    simulator("Vehicle.ADAS.CruiseControl.SpeedSet", "set", ({ args }) => {
        const [value] = args;
        // myCar.speed = int(value);
        myCar.speed = value;
    });

    simulator("Vehicle.Speed", "get", () => {
        return myCar.speed;
    });

    simulator("Vehicle.CurrentLocation.Heading", "get", () => {
        var angle = null;

        switch (myCar.direction) {
            case "up":
                angle = 0;
                break;
            case "right":
                angle = 90;
                break;
            case "down":
                angle = 180;
                break;
            case "left":
                angle = 270;
                break;
        }

        return angle;
    });

    async function update_map() {
        // console.log(myCar.ID);
        let data = {
            ID: myCar.ID,
            x: myCar.getX(),
            y: myCar.getY(),
            lane: myCar.lane,
            direction: myCar.direction,
            speed: myCar.speed,
            totalRotation: myCar.totalRotation,
        };

        try {
            const response = await fetch("http://localhost:5000/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (myCar.ID === null) {
                myCar.ID = responseData.ID;
                console.log("MY ID", myCar.ID);
            }

            var carRemove = responseData.Remove_car;
            console.log(responseData.cars);

            for (const key in responseData.cars) {
                const car_data = responseData.cars[key];
                // console.log(carRemove)

                // if (car_data.ID === myCar.ID) {
                //     continue;
                // }

                let car = null;
                if (!(car_data.ID in carList)) {
                    console.log("CREATE CAR", car_data.ID);
                    car = new Car("green", vehicle, document, map_div);
                } else {
                    car = carList[car_data.ID];
                }
                
                car.setPosition(car_data.x, car_data.y);
                car.totalRotation = car_data.totalRotation;
                car.ID = car_data.ID;
                car.speed = car_data.speed;
                car.lane = car_data.lane;
                car.direction = car_data.direction;

                car.element.style.transform =
                    "rotate(" + car.totalRotation + "deg)";

                if (!(car_data.ID in carList)) {
                    carList[car_data.ID] = car;
                }
            }

            // console.log(carList);
            // console.log(carRemove);
            // console.log(carList);
            for (let key in carList) {
                for (let idx in carRemove) {
                    let carRID = carRemove[idx];
                    if (parseInt(key) === parseInt(carRID)) {
                        // console.log(carList[key]);
                        carList[key].hideCar();
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    // CORE
    const avoid_distance = 50;
    const safe_distance = 20;
    function avoid_collision() {
        if (myCar.speed === 0) {
            return;
        }

        let offsetX = 0;
        let offsetY = 0;

        switch (myCar.direction) {
            case "up":
                offsetY = 35;
                break
            case "left":
                offsetX = 70;
                break

        }

        for (let key in carList) {
            let car = carList[key];

            let break_for = false;
            if (car.direction == myCar.direction && car.speed > myCar.speed) {

                switch (myCar.direction) {
                    case "up":
                        if (car.getY() < myCar.getY()) {
                            break_for = true;
                        }
                        break;
                    case "left":
                        if (car.getX() < myCar.getX()) {
                            break_for = true;
                        }
                        break;
                    case "down":
                        if (car.getY() > myCar.getY()) {
                            break_for = true;
                        }
                        break;
                    case "right":
                        if (car.getX() > myCar.getX()) {
                            break_for = true;
                        }
                        break;
                }
            }

            if (break_for) {
                continue;
            }

            const distance = calculateDistance(myCar.getX(), myCar.getY(), car.getX() + offsetX, car.getY() + offsetY);

            if (distance - safe_distance <= 0) {
                myCar.speed = 0;
            } else if (distance - safe_distance < avoid_distance) {
                myCar.speed = parseInt(myCar.speed * distance / avoid_distance)
            }
        }
    }


    setInterval(function () {
        var update = function () {
            avoid_collision();

            myCar.updatePosition();
            // setSpeedStatus();
            // setDirectionStatus();
            setlaneStatus();
            // update_map();
        };

        update();
    }, 100);

    setInterval(async () => {
        let speed = await vehicle["Speed"].get();
        setSpeedStatus(speed);

        let angle = await vehicle["CurrentLocation.Heading"].get();
        setDirectionStatus(angle);
    }, 100);


    async function test() {
        await update_map();
    }

    setInterval(async () => {
        await test();
    }, 500);


};

export default map;
