const plugin = ({ widgets, simulator, vehicle }) => {
  const container = document.createElement("div");
  container.setAttribute("style", `height: 100%; width: 100%;`);
  container.innerHTML = `
    <style>
      * {
        padding: 0;
        margin: 0;
        font-family: sans-serif;
      }

      body {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
      }

      .container {
        position: relative;
        width: 100%;
        top: 100px;
        right:120px;
      }

      .container .text {
        font-size: 30px;
        color: #000;
        font-weight: bold;
      }

      .button {
        background: green;
        width: 100px;
        height: 50px;
        border-radius: 100px;
        cursor: pointer;
        position: relative;
        display: inline-block;
        transition: 0.2s;
        margin-bottom: 10px;
      }

      .span {
        position: absolute;
        background-color: #fff;
        width: 45px;
        height: 45px;
        border-radius: 100px;
        margin: 2.5px;
        transition: all 0.2s ease-out;
      }

      img {
        position: absolute;
        width: 25px;
        height: 25px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      input {
        display: none;
      }

      .status {
        position: absolute;
        bottom: 100px;
        left: 40px;
        margin: 20px;
      }

      .status .run {
        
      }
    </style>
    <div class="container">
      <div class="text"></div>
      <div style="display: flex; flex-direction: column; align-items: flex-end;"> <!-- Container for buttons -->
        <label for="check" class="button">
          <input type="checkbox" id="check">
          <span class="span" style="left: 50px;">
            <img src="https://it-dainb.github.io/Round_4/images/button_on.png" class="img">
          </span>
        </label>
      </div>
    </div>

    <div class="status" style="background-color: white; padding: 20px; text-align: center;">
      <div class="prior" style="color: #000; font-size: 25px; ">Automatic Priority: <span id="get_prior">ON</span></div>
    </div>
  `;

  const prior_controller = document.createElement("div");
  prior_controller.setAttribute("style", `height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`);
  prior_controller.innerHTML = `
    <div style="background-color: white; padding: 20px; text-align: center;">
      <div style="color: green; font-size: 30px;">Priority: <span id="get_status">0</span></div>
      <div style="margin-top: 10px; font-size: 16px;">
        <button id="car_speed_up" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8593;</button>
        <button id="car_speed_down" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8595;</button>
      </div>
    </div>
  `;

  const input = container.querySelector("#check");
  const img = container.querySelector(".img");
  const span = container.querySelector(".span");
  const button = container.querySelector(".button");

  let auto_prior = container.querySelector("#get_prior");
  let prior_state = true;
  let carSpeedUp = prior_controller.querySelector("#car_speed_up");
  let carSpeedDown = prior_controller.querySelector("#car_speed_down");
  let getStatus = prior_controller.querySelector("#get_status");

  let speed = 0; // Initial speed value
  let vel = 0;
  window.autoPrior = true;

  function updateSpeed(value) {
    getStatus.textContent = value;
    speed = value;
  }

  carSpeedUp.addEventListener("click", () => {
    console.log("carSpeedUp click");
    speed += vel;
  });

  carSpeedDown.addEventListener("click", () => {
    console.log("carSpeedDown click");
    if (speed > 0) {
      speed -= vel;
    }
  });

  button.onclick = function () {
    if (input.checked) {
      vel = 1;
      span.style.left = "0px";
      button.style.background = "red";
      img.src = "https://it-dainb.github.io/Round_4/images/power_off.png";
      
      auto_prior.textContent = "OFF";
      window.autoPrior = false;
    } else {
      vel = 0;
      span.style.left = "50px";
      button.style.background = "green";
      img.src = "https://it-dainb.github.io/Round_4/images/button_on.png";
      
      auto_prior.textContent = "ON";
      window.autoPrior = true;
    }
  };

  setInterval(() => {
    window.priValue = speed;

    if (window.car.autoP) {
      updateSpeed(window.car.priority);
    } else {
      updateSpeed(speed);

    }
  }, 10)

  widgets.register("ToggleButton", (box) => {
    box.injectNode(container);
  });

  widgets.register("Speed", (box) => {
    box.injectNode(prior_controller);
  });
};

export default plugin;