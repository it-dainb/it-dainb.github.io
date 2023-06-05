class Car {
    constructor(x, y, direction, color) {
      this.x = x;
      this.y = y;
      this.direction = direction;
      this.element = document.getElementById("Car");
      this.totalRotation = 0;
      this.color = color;
      this.element.style.backgroundColor = this.color;
    }
    
    moveCarUp(vel) {
    // Calculate the new top and left positions based on the rotation angle
        const radians = totalRotation * (Math.PI / 180) * -1; // Convert the angle to radians
        const topOffset = Math.sin(radians) * vel;
        const leftOffset = Math.cos(radians) * vel;

        // Update the top and left positions
        const currentTop = parseInt(window.getComputedStyle(this.element).getPropertyValue("top"));
        const currentLeft = parseInt(window.getComputedStyle(this.element).getPropertyValue("left"));
        this.element.style.top = (currentTop - topOffset) + "px";
        this.element.style.left = (currentLeft + leftOffset) + "px";
    }
  
    turnRight() {
        this.totalRotation += 90
        this.element.style.transform = "rotate(" +  this.totalRotation + "deg)";
    }
    
    turnLeft() {
        this.totalRotation -= 90
        this.element.style.transform = "rotate(" + this.totalRotation + "deg)";
    }
}

const plugin = ({ widgets, simulator, vehicle }) => {
    const div = document.createElement("div");
    div.innerHTML = `
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
        top: calc(50% + 25px);
        transition: left 0.5s, top 0.5s, transform 0.5s;
    }

    .car-head {
        width: 40%;
        height: 100%;
        background-color: yellow;
        position: absolute;
        right: 0;
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
        margin-left: 40px;
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
    <div class="road-markings-vertical"></div>
    <div class="road-markings-horizontal"></div>
    <span id="Car" class="my-car">
        <div class="car-head"></div>
    </span>
  
    `;

    // Append the div to the document body
    document.body.appendChild(div);

    const myCar = new Car(0, 0, "right", "red");

    function changeLights(trafficLight, activeIndex = -1) {
        var lights = trafficLight.getElementsByClassName("light");
      
        // Find the currently active light
        for (var i = 0; i < lights.length; i++) {
          if (lights[i].classList.contains("active")) {
            activeIndex = i;
            break;
          }
        }
      
        // Turn off all lights and set them to the "inactive" class
        for (var i = 0; i < lights.length; i++) {
          lights[i].classList.remove("active");
          lights[i].classList.add("inactive");
        }
      
        // Determine the next light in sequence based on the current active light
        var nextIndex = (activeIndex + 1) % lights.length;
      
        // Turn on the next light by removing the "inactive" class and adding the "active" class
        lights[nextIndex].classList.remove("inactive");
        lights[nextIndex].classList.add("active");
      
        // Set the delay time for the next light change based on the current light
        var delayTime = 0;
        if (nextIndex === 0) {
          // Green to yellow transition (10 seconds)
          delayTime = 2000;
        } else if (nextIndex === 1) {
          // Yellow to red transition (5 seconds)
          delayTime = 1000;
        } else if (nextIndex === 2) {
          // Red to green transition (20 seconds)
          delayTime = 2000;
        }
      
       // Call the changeLights function again after the delay time
        setTimeout(function() {
            changeLights(trafficLight);
        }, delayTime);
      }
      
      // Start the traffic light sequence for each traffic light
    var trafficLights = document.querySelectorAll(".traffic-light");
    for (var i = 0; i < trafficLights.length; i++) {
        if (trafficLights[i].classList.contains("one") || trafficLights[i].classList.contains("two")) {
            
            changeLights(trafficLights[i], 1);
        } else {
            changeLights(trafficLights[i]);
        }
    }

    widgets.register("widget_map", 
    (box) => {
        box.injectNode(div)
    })
}

export default plugin;