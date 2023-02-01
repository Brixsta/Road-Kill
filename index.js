const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const sprite = new Image();
const grassBottom = new Image();
const grassTop = new Image();
const asphalt = new Image();
const splat = new Image();
const carsRight = new Image();
const carsLeft = new Image();

const createSplash = () => {
  const splash = document.createElement("div");
  splash.classList.add("splash");
  document.body.appendChild(splash);
};

const handleStartButtonClick = () => {
  const splash = document.querySelector(".splash");
  splash.remove();
  global.disableKeys = false;
  global.theme.play();
  global.theme.loop = true;
};

const createStartButton = () => {
  const startButton = document.createElement("button");
  const splash = document.querySelector(".splash");
  startButton.classList.add("start-button");
  splash.appendChild(startButton);
  startButton.innerHTML = "Start";
  startButton.addEventListener("click", handleStartButtonClick);
};

const isCollide = (rect1, rect2) => {
  let marginOfError = 10;
  return !(
    rect1.x > rect2.x + rect2.width ||
    rect1.x + rect1.width < rect2.x ||
    rect1.y > rect2.y + rect2.height - marginOfError ||
    rect1.y + rect1.height < rect2.y + marginOfError
  );
};

const generateRandomCarSpacing = () => {
  const carSpacing = [300, 350, 400];
  let randomNum = Math.floor(Math.random() * carSpacing.length);

  return carSpacing[randomNum];
};

const generateRandomCarSpeed = () => {
  const carSpeeds = [1, 2, 3];

  return carSpeeds[Math.floor(Math.random() * carSpeeds.length)];
};

const generateRandomCarWidth = () => {
  const carWidths = [200, 300, 350];
  return carWidths[Math.floor(Math.random() * carWidths.length)];
};

const global = {
  cars: {
    lane1: [],
    lane2: [],
    lane3: [],
    lane4: [],
    lane5: [],
  },
  spacing: {
    lane1: generateRandomCarSpacing(),
    lane2: generateRandomCarSpacing(),
    lane3: generateRandomCarSpacing(),
    lane4: generateRandomCarSpacing(),
    lane5: generateRandomCarSpacing(),
  },
  end: {
    lane1: null,
    lane2: null,
    lane3: null,
    lane4: null,
    lane5: null,
  },
  splats: [],
  gameSpeed: 1,
  gameScore: 0,
  dogAlive: true,
  dogPosition: 3,
  disableKeys: true,
  theme: new Audio("./audio/theme.wav"),
};

createSplash();

if (window.innerHeight <= 800 || window.innerWidth <= 800) {
  alert("Sorry this is a web-browser game only xD");
} else {
  createStartButton();
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const handleKeyDown = (e) => {
  if (
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft"
  ) {
    keys[e.key] = true;
  }
};

const handleKeyUp = (e) => {
  if (
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft"
  ) {
    keys[e.key] = false;
  }
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

class Dog {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 10;
    this.opacity = 1;
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    let yAdjustment = 10;
    const spriteWidth = 48;
    const spriteHeight = 48;
    sprite.src = "./images/dog.png";

    if (global.dogPosition === 3) {
      yAdjustment = 5;
    }

    ctx.drawImage(
      sprite,
      spriteWidth,
      spriteHeight * global.dogPosition,
      spriteWidth,
      spriteHeight,
      this.x,
      this.y - yAdjustment,
      50,
      50
    );
  }

  adjustOpacity() {
    this.opacity += 0.02;
  }

  move() {
    if (keys.ArrowUp && global.disableKeys === false) {
      dog.y -= this.speed;
      global.dogPosition = 3;
    }
    if (
      keys.ArrowDown &&
      dog.y < canvas.height - dog.height &&
      global.disableKeys === false
    ) {
      dog.y += this.speed;
      global.dogPosition = 0;
    }
    if (keys.ArrowLeft && dog.x > 0 && global.disableKeys === false) {
      dog.x -= this.speed;
      global.dogPosition = 1;
    }
    if (
      keys.ArrowRight &&
      dog.x < canvas.width - dog.width &&
      global.disableKeys === false
    ) {
      dog.x += this.speed;
      global.dogPosition = 2;
    }
  }
}

class Car {
  constructor(x, y, width, lane, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 100;
    this.speed = speed;
    this.lane = lane;
    this.model = null;
    this.determineModel();
  }

  determineModel() {
    if (this.width === 350) {
      const choices = [1, 2, 3];
      let ranNum = Math.floor(Math.random() * choices.length);
      this.model = choices[ranNum];
    } else if (this.width === 300) {
      const choices = [8, 9, 10, 11, 12];
      let ranNum = Math.floor(Math.random() * choices.length);
      this.model = choices[ranNum];
    } else if (this.width === 200) {
      const choices = [0, 5, 6, 7];
      let ranNum = Math.floor(Math.random() * choices.length);
      this.model = choices[ranNum];
    }
  }

  draw() {
    let spriteWidth = 63;
    let spriteHeight = 32;

    if (this.speed > 0) {
      carsRight.src = "./images/cars.png";
      if (this.width === 350) {
        ctx.drawImage(
          carsRight,
          spriteWidth * 0,
          spriteHeight * this.model,
          spriteWidth,
          spriteHeight,
          this.x - 3,
          this.y,
          this.width + 10,
          this.height - 5
        );
      } else if (this.width === 200) {
        ctx.drawImage(
          carsRight,
          spriteWidth * 0,
          spriteHeight * this.model,
          spriteWidth + 1,
          spriteHeight,
          this.x + 3,
          this.y,
          this.width - 1,
          this.height
        );
      } else if (this.width === 300) {
        ctx.drawImage(
          carsRight,
          spriteWidth * 0,
          spriteHeight * this.model,
          spriteWidth + 1,
          spriteHeight,
          this.x + 2,
          this.y,
          this.width - 1,
          this.height
        );
      }
    } else if (this.speed < 0) {
      carsLeft.src = "./images/cars-reversed.png";
      if (this.width === 350) {
        ctx.drawImage(
          carsLeft,
          352 - spriteWidth * 2,
          spriteHeight * this.model,
          spriteWidth,
          spriteHeight,
          this.x - 3,
          this.y,
          this.width + 10,
          this.height - 5
        );
      } else if (this.width === 200) {
        ctx.drawImage(
          carsLeft,
          351 - spriteWidth * 2,
          spriteHeight * this.model,
          spriteWidth,
          spriteHeight,
          this.x,
          this.y,
          this.width - 2,
          this.height
        );
      } else if (this.width === 300) {
        ctx.drawImage(
          carsLeft,
          351 - spriteWidth * 2,
          spriteHeight * this.model,
          spriteWidth + 1,
          spriteHeight,
          this.x + 2,
          this.y,
          this.width,
          this.height
        );
      }
    }
  }

  move() {
    this.x += this.speed * global.gameSpeed;
    if (this.speed > 0) {
      if (this.x > global.end[this.lane]) {
        const laneStart = findLaneStart(this);
        this.x = laneStart - global.spacing[this.lane];
      }
    } else if (this.speed < 0) {
      if (this.x < global.end[this.lane]) {
        const laneStart = findLaneStart(this);
        this.x = laneStart + global.spacing[this.lane];
      }
    }
  }

  detectCollision() {
    if (isCollide(this, dog)) {
      if (global.dogAlive) {
        const images = [
          "./images/splat1.png",
          "./images/splat2.png",
          "./images/splat3.png",
          "./images/splat4.png",
        ];
        const splat = new Splat(
          dog.x - 15,
          dog.y - 12,
          images[Math.floor(Math.random() * images.length)]
        );
        global.splats.push(splat);
        global.dogAlive = false;
        const audio = [
          "./audio/crunch.wav",
          "./audio/ouch.wav",
          "./audio/pop.wav",
        ];
        const sound = new Audio();
        sound.src = audio[Math.floor(Math.random() * audio.length)];
        sound.play();
        respawnDog();
      }
    }
  }
}

class Splat {
  constructor(x, y, src) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.src = src;
  }

  draw() {
    ctx.shadowColor = "transparent";
    if (this.opacity <= 0) {
      this.opacity = 0;
    }
    ctx.globalAlpha = this.opacity;
    splat.src = this.src;
    ctx.drawImage(splat, this.x, this.y);

    if (global.splats.length > 50) {
      global.splats.shift();
    }
  }

  adjustOpacity() {
    setTimeout(() => {
      this.opacity -= 0.01;
    }, 2000);
  }
}

const findLaneEnd = (lane, speed) => {
  if (speed > 0) {
    const arrayNum = global.cars[lane].length - 1;
    const frontCar = global.cars[lane][arrayNum];
    const width = frontCar.width;
    const x = frontCar.x;
    return width + x;
  } else if (speed < 0) {
    const frontCar = global.cars[lane][0];
    const x = frontCar.x;
    return x;
  }
};

const findLaneStart = (obj) => {
  let cars = global.cars[obj.lane];
  if (obj.speed > 0) {
    let lowestX = Infinity;
    for (let i = 0; i < cars.length; i++) {
      let current = cars[i];
      if (current.x < lowestX) {
        lowestX = current.x;
      }
    }
    return lowestX - obj.width;
  } else if (obj.speed < 0) {
    let largestX = -Infinity;
    let lastCarWidth = 0;
    for (let i = 0; i < cars.length; i++) {
      let current = cars[i];
      if (current.x > largestX) {
        largestX = current.x;
        lastCarWidth = current.width;
      }
    }
    return largestX + lastCarWidth;
  }
};

const createLaneCars = (lane, y, speed) => {
  let x = -1500;
  let prevCarWidth = 0;

  for (let i = 0; i < 10; i++) {
    let spacing = global.spacing[lane];
    let carWidth = generateRandomCarWidth();
    x += prevCarWidth + spacing;

    global.cars[lane].push(new Car(x, y, carWidth, lane, speed));
    prevCarWidth = carWidth;
  }
  global.end[lane] = findLaneEnd(lane, speed);
};

const initLanes = () => {
  // lane 1
  createLaneCars("lane1", canvas.height - 180, generateRandomCarSpeed());
  // lane 2
  createLaneCars("lane2", canvas.height - 290, -generateRandomCarSpeed());
  // lane 3
  createLaneCars("lane3", canvas.height - 400, generateRandomCarSpeed());
  // lane 4
  createLaneCars("lane4", canvas.height - 510, -generateRandomCarSpeed());
  // lane 5
  createLaneCars("lane5", canvas.height - 620, generateRandomCarSpeed());
};

const respawnDog = () => {
  const teleport = new Audio("./audio/teleport.wav");

  setTimeout(() => {
    teleport.play();
  }, 300);
  global.disableKeys = true;
  global.dogPosition = 3;
  dog.opacity = 0;
  dog.y = canvas.height - 50;
  dog.x = canvas.width / 2 - 25;
  global.dogAlive = true;

  setTimeout(() => {
    global.disableKeys = false;
  }, 1000);
};

const incrementScore = () => {
  ctx.globalAlpha = 1;

  if (dog.y < 0) {
    const audio = new Audio("./audio/success.wav");
    audio.play();
    respawnDog();
    global.gameSpeed += 0.25;
    global.gameScore++;
  }
};

const drawCanvas = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawAsphalt = () => {
  asphalt.src = "./images/asphalt.png";
  ctx.drawImage(asphalt, 0, 0);
};

const drawLines = () => {
  ctx.strokeStyle = "rgba(255,255,0,.9)";
  ctx.lineWidth = 10;
  ctx.setLineDash([120, 200]);
  let x = 0;
  let y = 185;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    y += 110;
  }
};

const drawScoreBoard = () => {
  ctx.fillStyle = "white";
  ctx.font = " bold 25px Arial";
  let score = `Score: ${global.gameScore}`;
  ctx.fillText(score, 5, 30);
  let gameSpeed = `Game Speed: ${global.gameSpeed}`;
  ctx.fillText(gameSpeed, 5, 60);
};

const drawGrass = (y) => {
  ctx.shadowColor = "rgba(0,0,0,1)";
  ctx.shadowOffsetX = 0;
  ctx.shadowBlur = 4;
  grassBottom.src = "./images/grass-bottom.png";
  grassTop.src = "./images/grass-top.png";
  if (y < 100) {
    ctx.drawImage(grassBottom, 0, y);
  } else {
    ctx.drawImage(grassTop, 0, y);
  }
};

const drawScenery = () => {
  drawCanvas();
  drawAsphalt();
  drawLines();
  drawGrass(canvas.height - 80);
  drawGrass(0);
  drawScoreBoard();
};

// create dog
let dog = new Dog(canvas.width / 2 - 25, canvas.height - 50, 50, 50);

//create lanes
initLanes();

// animation loop
const animate = () => {
  drawScenery();
  dog.draw();
  dog.move();
  dog.adjustOpacity();
  global.splats.forEach((splat) => {
    splat.draw();
    splat.adjustOpacity();
  });
  incrementScore();
  for (let i = 1; i < 6; i++) {
    global.cars[`lane${i}`].forEach((car) => {
      car.move();
      car.draw();
      car.detectCollision();
    });
  }

  requestAnimationFrame(animate);
};

window.onload = () => {
  animate();
};
