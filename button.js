const plugin = ({ widgets, simulator, vehicle }) => {
    let boxGlobal = null;
    const speedController = document.createElement("div");
    speedController.setAttribute(
        "style",
        `height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`
      );
    speedController.innerHTML = `
      <div style="background-color: white; padding: 20px; text-align: center;">
        <div style="color: green; font-size: 16px;">Status: <span id="get_status">Stable</span></div>
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
    <div style="color: green; font-size: 16px;">Direction: <span id="get_direction">Stable</span></div>
    <div style="margin-top: 10px;
    display: flex; justify-content: center; align-items: center; ">
      <button id="arrow_left" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8592;</button>
      <button id="arrow_right" style="padding: 8px; margin-left: 8px; background-color: white; color: black; font-size: 24px;">&#8594;</button>
    </div>
  </div>
`;



    let directionState = directionController.querySelector("#get_direction");
    let arrowUp = directionController.querySelector("#arrow_up");
    let arrowDown = directionController.querySelector("#arrow_down");
    let arrowLeft = directionController.querySelector("#arrow_left");
    let arrowRight = directionController.querySelector("#arrow_right");
    
    let speedState = speedController.querySelector("#get_status");
    let carSpeedUp = speedController.querySelector("#car_speed_up");
    let carSpeedDown = speedController.querySelector("#car_speed_down");
    let carReset = speedController.querySelector("#car_reset");
    
    if (arrowUp) {
        arrowUp.addEventListener("click", () => {
          console.log("arrowUp click");
          setDirectionStatus("Up");
        });
      }
      if (arrowDown) {
        arrowDown.addEventListener("click", () => {
          console.log("arrowDown click");
          setDirectionStatus("Down");
        });
      }
      if (arrowLeft) {
        arrowLeft.addEventListener("click", () => {
          console.log("arrowLeft click");
          setDirectionStatus("Left");
        });
      }
      if (arrowRight) {
        arrowRight.addEventListener("click", () => {
          console.log("arrowRight click");
          setDirectionStatus("Right");
        });
      }

    if (carSpeedUp) {
      carSpeedUp.addEventListener("click", () => {
        console.log("carSpeedUp click");
        setSpeedStatus("Speed Up");
      });
    }
    if (carSpeedDown) {
      carSpeedDown.addEventListener("click", () => {
        console.log("carSpeedDown click");
        setSpeedStatus("Speed Down");
      });
    }
  
    if (carReset) {
      carReset.addEventListener("click", () => {
        console.log("carReset click");
        setSpeedStatus("Stop");
      });
    }
  
    const renderDirection = (value) => {
        if (directionState) {
            directionState.innerHTML = value;
        }
      };
    
      const setDirectionStatus = (value) => {
        console.log("setDirectionStatus ---------------------------");
        renderDirection(value);
      };
    

    const renderSpeedStatus = (value) => {
      if (speedState) {
        speedState.innerHTML = value;
      }
    };
  
    const setSpeedStatus = (value) => {
      console.log("setSpeedStatus ---------------------------");
      renderSpeedStatus(value);
    };
  
    widgets.register("Speed", (box) => {
      box.injectNode(speedController);
    });
    
    widgets.register("Direction", (box) => {
        box.injectNode(directionController);
    });
      
  };
  
  export default plugin;
  