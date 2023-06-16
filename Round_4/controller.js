var turn, brake;

function moveVehicle(turn) {
    window.TurnClick = turn;
}

const plugin = ({ widgets, simulator, vehicle }) => {
    const container = document.createElement("div");
    container.setAttribute("style", "height: 100%; width: 100%;");
    container.innerHTML = `
    <style>
    .controller {
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url("ps4-controller.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  
    .button {
      position: absolute;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 24px;
      text-align: center;
      line-height: 70px;
      cursor: pointer;
    }

      .button.up {
        bottom: 150px;
        left: 70px;
      }

      .button.down {
        bottom: 30px;
        left: 70px;
      }

      .button.left {
        bottom: 90px;
        left: 10px;
      }

      .button.right {
        bottom: 90px;
        left: 130px;
      }

      .button.active {
        background-color: red;
      }

      #btn_brake3 {
        position: absolute;
        bottom: 30px;
        right: 30px;
        width: 70px;
        height: 70px;
        border: 2px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        background-color: #fff;
        cursor: pointer;
      }

      #btn_brake1 {
        position: absolute;
        bottom: 100px;
        right: 30px;
        width: 70px;
        height: 70px;
        border: 2px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        background-color: #FF4040;
        cursor: pointer;
      }

      #btn_brake2 {
        position: absolute;
        bottom: 100px;
        right: 40px;
        width: 70px;
        height: 70px;
        border: 2px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        background-color: #fff;
        cursor: pointer;
      }


    </style>
    <div class="controller">
      <div id="btn_up" class="button up">U</div>
      <div id="btn_down" class="button down">D</div>
      <div id="btn_left" class="button left">L</div>
      <div id="btn_right" class="button right">R</div>
      <img id="btn_brake1" class="button img1" src="https://it-dainb.github.io/Round_4/images/handbrake.png" alt="Brake">
      <img id="btn_brake2" class="button img2" src="https://it-dainb.github.io/Round_4/images/reverse-handbrake.png" alt="Brake">
      <img id="btn_brake3" class="button img3" src="https://it-dainb.github.io/Round_4/images/bottom-handbrake.png" alt="Brake">
    </div>
  `;

    let btnUp = container.querySelector("#btn_up");
    let btnDown = container.querySelector("#btn_down");
    let btnLeft = container.querySelector("#btn_left");
    let btnRight = container.querySelector("#btn_right");
    let btnBrake1 = container.querySelector("#btn_brake1");
    let btnBrake2 = container.querySelector("#btn_brake2");
    let btnBrake3 = container.querySelector("#btn_brake3");

    if (btnUp) {
        btnUp.addEventListener("mousedown", () => {
            btnUp.classList.add("active");
            moveVehicle("up");
        });

        btnUp.addEventListener("mouseup", () => {
            btnUp.classList.remove("active");
        });
    }

    if (btnDown) {
        btnDown.addEventListener("mousedown", () => {
            btnDown.classList.add("active");
            moveVehicle("down");
        });

        btnDown.addEventListener("mouseup", () => {
            btnDown.classList.remove("active");
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener("mousedown", () => {
            btnLeft.classList.add("active");
            moveVehicle("left");
        });

        btnLeft.addEventListener("mouseup", () => {
            btnLeft.classList.remove("active");
        });
    }

    if (btnRight) {
        btnRight.addEventListener("mousedown", () => {
            btnRight.classList.add("active");
            moveVehicle("right");
        });

        btnRight.addEventListener("mouseup", () => {
            btnRight.classList.remove("active");
        });
    }

    btnBrake2.style.opacity = "1";
    btnBrake1.style.opacity = "0";

    brake = false;

    if (btnBrake3) {
        btnBrake3.addEventListener("click", () => {
            if (mustStop) {
                btnBrake1.style.opacity = "0";
                btnBrake2.style.opacity = "1";
                brake = false;
                window.brake = brake;
                btnBrake3.style.backgroundColor = "white";
            } else {
                btnBrake1.style.opacity = "1";
                btnBrake2.style.opacity = "0";
                brake = true;
                window.brake = brake;
                btnBrake3.style.backgroundColor = "#FF4040";
            }
        });
    }

    widgets.register("Controller", (box) => {
        box.injectNode(container);
    });
};

export default plugin;
