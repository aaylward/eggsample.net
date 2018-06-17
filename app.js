(function (){

  function makeCell(state, row, col) {
    const div = document.createElement("div");
    div.classList = "" + row + " " + col + " cell";

    if (state.cells[row][col]) {
      div.classList = "" + row + " " + col + " cell on";
    }

    return div;
  }
  
  function drawWorld(state) {
    state.speedDiv.innerText = state.speed;
    while (state.appDiv.firstChild) {
      state.appDiv.removeChild(state.appDiv.firstChild);
    }

    for (let row=0; row<state.rows; row++) {
      for (let col=0; col<state.cols; col++) {
        state.appDiv.appendChild(makeCell(state, row, col));
      }
    }
  }

  function computeState(state, row, col) {
    let numberOfLiveNeighbors = 0;
    const oldCells = state.cells;
    const up = (row + state.rows - 1) % state.rows;
    const down = (row + state.rows + 1) % state.rows;
    const left = (col + state.cols - 1) % state.cols;
    const right = (col + state.cols + 1) % state.cols;

    const alive = oldCells[row][col];

    if (oldCells[up][left]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[up][col]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[up][right]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[row][left]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[row][right]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[down][left]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[down][col]) {
      numberOfLiveNeighbors++;
    }
    if (oldCells[down][right]) {
      numberOfLiveNeighbors++;
    }

    if (alive && numberOfLiveNeighbors < 2) {
      return false;
    }

    if (alive && (numberOfLiveNeighbors === 2 || numberOfLiveNeighbors === 3)) {
      return true;
    }

    if (alive && numberOfLiveNeighbors > 3) {
      return false;
    }
    if (!alive && numberOfLiveNeighbors === 3) {
      return true;
    }
    return false;
  }

  function attachListeners(state) {
    state.appDiv.addEventListener("click", function(event) {
      event.preventDefault();
      const target = event.target;
      const row = parseInt(target.classList[0], 10);
      const col = parseInt(target.classList[1], 10);
      let on = state.cells[row][col] = !state.cells[row][col];
      if (on) {
        target.classList.add("on");
      } else {
        target.classList.remove("on");
      }
      return false;
    });

    state.pause.addEventListener("click", function(event) {
      event.preventDefault();
      const target = event.target;
      if (state.paused) {
        target.innerText = "pause";
      } else {
        target.innerText = "start";
      }

      state.paused = !state.paused;
      if (!state.paused) {
        nextState(state);
      }

      return false;
    });
  }

  function nextState(state) {
    let newCells = [];
    for (let row=0; row<state.rows; row++) {
      newCells[row] = [];
      for (let col=0; col<state.cols; col++) {
        newCells[row][col] = computeState(state, row, col);
      }
    }

    state.cells = newCells;
    drawWorld(state);
    console.log("drew world")
    if (!state.paused) {
      setTimeout(nextState, 500, state);
    }
  }

  function start() {
    const appDiv = document.querySelector("div.app");
    const speedDiv = document.querySelector("div.speed-control div.value");
    const pause = document.querySelector("div.start-stop");
    let speed = 1;
    
    const cells = [];
    for (let row=0; row<60; row++) {
      cells[row] = [];
      for (let col=0; col<80; col++) {
        cells[row][col] = false;
      }
    }
    
    const state = {
      paused: true,
      appDiv: appDiv,
      speedDiv: speedDiv,
      pause: pause,
      speed: speed,
      cells: cells,
      rows: 60,
      cols: 80
    };

    drawWorld(state);
    attachListeners(state);
  }

  start();

})()
