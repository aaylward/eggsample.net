(function (){

  function makeCell(state, index) {
    let div = document.createElement("div");
    div.classList = "cell " + index;
    if (state.cells[index]) {
      div.classList = "cell on " + index;
    }

    return div;
  }
  
  function drawWorld(state) {
    state.speedDiv.innerText = state.speed;
    const numberOfCells = state.cells.length;
    state.appDiv.innerHtml = "";

    for (let i=0; i<state.cells.length; i++) {
      state.appDiv.appendChild(makeCell(state, i));
    }
  }

  function attachListeners(state) {
    state.appDiv.addEventListener("click", function(event) {
      debugger;
    });
  }

  function nextState(oldState) {
    
  }

  function start() {
    const appDiv = document.querySelector("div.app");
    const speedDiv = document.querySelector("div.speed-control div.value");
    let speed = 1;

    
    const cells = [];
    for (let i=0; i<4800; i++) {
      cells.push(false);
    }
    
    const state = {
      appDiv: appDiv,
      speedDiv: speedDiv,
      speed: speed,
      cells: cells,
      widthInPixels: 800,
      heightInPixels: 600,
      cellSizePixels: 8
    };

    drawWorld(state);
    attachListeners(state);
  }

  start();

})()
