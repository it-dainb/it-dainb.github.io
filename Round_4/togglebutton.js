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
        top: 50px;
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
        bottom: 60px;
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
          <span class="span">
            <img src="https://LuuXiFer0.github.io/img/button_on.png" class="img">
          </span>
        </label>
        <label for="check2" class="button">
          <input type="checkbox" id="check2">
          <span class="span">
            <img src="https://LuuXiFer0.github.io/img/button_on.png" class="img">
          </span>
        </label>
      </div>
    </div>

    <div class="status" style="background-color: white; padding: 20px; text-align: center;">
      <div class="run" style="color: #000; font-size: 25px;">Auto Driving: <span id="get_run">ON</span></div>
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
  const input2 = container.querySelector("#check2");
  const img = container.querySelector(".img");
  const span = container.querySelector(".span");
  const button = container.querySelector(".button");
  const img2 = container.querySelectorAll(".img")[1]; // Reference to the second button's image
  const span2 = container.querySelectorAll(".span")[1]; // Reference to the second button's span
  const button2 = container.querySelectorAll(".button")[1];

  let auto_run = container.querySelector("#get_run");
  let auto_prior = container.querySelector("#get_prior");
  let prior_state = true;
  let carSpeedUp = prior_controller.querySelector("#car_speed_up");
  let carSpeedDown = prior_controller.querySelector("#car_speed_down");
  let getStatus = prior_controller.querySelector("#get_status");

  let speed = 0; // Initial speed value

  button.onclick = function () {
    if (input.checked) {
      span.style.left = "50px";
      button.style.background = "red";
      img.src = "https://LuuXiFer0.github.io/img/power_off.png";

      auto_run.textContent = "OFF";
    } else {
      span.style.left = "0px";
      button.style.background = "green";
      img.src = "https://LuuXiFer0.github.io/img/button_on.png";

      auto_run.textContent = "ON";
    }
  };

  button2.onclick = function () {
    if (input2.checked) {
      span2.style.left = "50px";
      button2.style.background = "red";
      img2.src = "https://LuuXiFer0.github.io/img/power_off.png";

      auto_prior.textContent = "OFF";
      prior_state = false;

      carSpeedUp.addEventListener("click", () => {
        console.log("carSpeedUp click");
        speed++;
        getStatus.textContent = speed;
      });

      carSpeedDown.addEventListener("click", () => {
        console.log("carSpeedDown click");
        if (speed > 0) {
          speed--;
          getStatus.textContent = speed;
        }
      });
    } else {
      span2.style.left = "0px";
      button2.style.background = "green";
      img2.src = "https://LuuXiFer0.github.io/img/button_on.png";

      auto_prior.textContent = "ON";
      prior_state = true;

      carSpeedUp.removeEventListener("click", () => {});
      carSpeedDown.removeEventListener("click", () => {});
    }
  };

  widgets.register("ToggleButton", (box) => {
    box.injectNode(container);
  });

  widgets.register("Speed", (box) => {
    box.injectNode(prior_controller);
  });
};

export default plugin;
