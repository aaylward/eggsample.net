(function (){
  function makeCell(state, row, col) {
    const div = document.createElement("div");
    if (state.cells[row][col]) {
      div.classList = "" + row + " " + col + " cell on";
    } else {
      div.classList = "" + row + " " + col + " cell";
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

  function up(row, rows) {
    return (row + rows - 1) % rows;
  }

  function down(row, rows) {
    return (row + rows + 1) % rows;
  }
  
  function left(col, cols) {
    return (col + cols - 1) % cols;
  }

  function right(col, cols) {
    return (col + cols + 1) % cols;
  }

  function computeLiveNeighbors(state, row, col) {
    let numberOfLiveNeighbors = 0;
    const oldCells = state.cells;
    const rowUp = up(row, state.rows);
    const rowDown = down(row, state.rows);
    const colLeft = left(col, state.cols);
    const colRight = right(col, state.cols);

    if (oldCells[rowUp][colLeft]) numberOfLiveNeighbors++;
    if (oldCells[rowUp][col]) numberOfLiveNeighbors++;
    if (oldCells[rowUp][colRight]) numberOfLiveNeighbors++;
    if (oldCells[row][colLeft]) numberOfLiveNeighbors++;
    if (oldCells[row][colRight]) numberOfLiveNeighbors++;
    if (oldCells[rowDown][colLeft]) numberOfLiveNeighbors++;
    if (oldCells[rowDown][col]) numberOfLiveNeighbors++;
    if (oldCells[rowDown][colRight]) numberOfLiveNeighbors++;

    return numberOfLiveNeighbors;
  }

  function computeState(state, row, col) {
    const numberOfLiveNeighbors = computeLiveNeighbors(state, row, col);

    if (state.cells[row][col]) {
      return numberOfLiveNeighbors === 2 || numberOfLiveNeighbors === 3;
    }
    return numberOfLiveNeighbors === 3;
  }

  function handlePauseButton(state, event) {
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
  }

  function handleCellTouch(state, event) {
    event.preventDefault();
    const target = event.target;
    const row = parseInt(target.classList[0], 10);
    const col = parseInt(target.classList[1], 10);
    state.cells[row][col] = (!state.cells[row][col]);
    let on = state.cells[row][col];
    if (on) {
      target.classList.add("on");
    } else {
      target.classList.remove("on");
    }
    return false;
  }

  function handleFasterTouch(state, event) {
    event.preventDefault();
    if (state.speed < 7) {
      state.speed++;
    }
    drawWorld(state);
    return false;
  }

  function handleSlowerTouch(state, event) {
    event.preventDefault();
    if (state.speed > 1) {
      state.speed--;
    }
    drawWorld(state);
    return false;
  }

  function handleClear(state, event) {
    event.preventDefault();
    state.cells.fill(false);
    drawWorld(state);
    return false;
  }

  function attachListeners(state) {
    const pauseHandler = handlePauseButton.bind(null, state);
    const cellHandler = handleCellTouch.bind(null, state);
    const fasterHandler = handleFasterTouch.bind(null, state);
    const slowerHandler = handleSlowerTouch.bind(null, state);
    const clearHandler = handleClear.bind(null, state);

    state.appDiv.addEventListener("click", cellHandler);
    state.appDiv.addEventListener("touchStart", cellHandler);

    state.pause.addEventListener("click", pauseHandler);
    state.pause.addEventListener("touchStart", pauseHandler);
    
    state.fasterDiv.addEventListener("click", fasterHandler);
    state.fasterDiv.addEventListener("touchStart", fasterHandler);

    state.slowerDiv.addEventListener("click", slowerHandler);
    state.slowerDiv.addEventListener("touchStart", slowerHandler);

    state.clearDiv.addEventListener("click", clearHandler);
    state.clearDiv.addEventListener("touchStart", clearHandler);
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
    if (!state.paused) {
      setTimeout(nextState, 500 / state.speed, state);
    }
  }

  function blinker(state, row, col) {
    state.cells[up(row, state.rows)][col] = true;
    state.cells[row][col] = true;
    state.cells[down(row, state.rows)][col] = true;
  }

  function blonker(state, row, col) {
    state.cells[row][left(col, state.cols)] = true;
    state.cells[row][col] = true;
    state.cells[row][right(col, state.cols)] = true;
  }

  function glider(state, row, col) {
    blonker(state, row, col);
    state.cells[up(row, state.rows)][col + 1] = true;
    state.cells[up(up(row, state.rows), state.rows)][col] = true;
  }

  function probe(state, row, col) {
    blinker(state, row, col);
    blonker(state, row, col + 3);
    blinker(state, row, col + 6);
    blonker(state, row, col + 9);
  }

  function pulsar(state, row, col) {
    blonker(state, row, col);
    blonker(state, row + 2, col);

    blonker(state, row, col + 6);
    blonker(state, row + 2, col + 6);

    blonker(state, row - 5, col + 6);
    blonker(state, row - 5, col);

    blonker(state, row + 7, col + 6);
    blonker(state, row + 7, col);

    blinker(state, row - 2, col + 2);
    blinker(state, row - 2, col + 4);

    blinker(state, row + 4, col + 2);
    blinker(state, row + 4, col + 4);

    blinker(state, row + 4, col + 9);
    blinker(state, row + 4, col - 3);

    blinker(state, row - 2, col + 9);
    blinker(state, row - 2, col - 3);
  }

  function initializeSomeShapes(state) {
    probe(state, 10, 10);
    probe(state, 10, 25);
    probe(state, 10, 50);

    pulsar(state, 30, 20);
    pulsar(state, 30, 60);

    glider(state, 55, 10);
    glider(state, 55, 15);
    glider(state, 55, 20);
    glider(state, 45, 10);
    glider(state, 45, 20);
  }

  function start() {
    const appDiv = document.querySelector("div.app");
    const speedDiv = document.querySelector("div.speed-control div.value");
    const fasterDiv = document.querySelector("div.speed-control div.faster");
    const slowerDiv = document.querySelector("div.speed-control div.slower");
    const pause = document.querySelector("div.start-stop");
    const clearDiv = document.querySelector("div.clear-state");
    
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
      fasterDiv: fasterDiv,
      slowerDiv: slowerDiv,
      pause: pause,
      clearDiv: clearDiv,
      speed: 3,
      cells: cells,
      rows: 60,
      cols: 80
    };

    initializeSomeShapes(state);

    drawWorld(state);
    attachListeners(state);
  }

  start();

})()
