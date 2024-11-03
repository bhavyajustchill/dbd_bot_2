const { GlobalKeyboardListener } = require("node-global-key-listener");
const robot = require("robotjs");
const readline = require("readline");

let running = false;
let clickCoordinates = {};
let selectedKillerActions = null;

const coordinates = [
  {
    name: "1920 x 1080",
    ready: { x: 1823, y: 920 },
    continue: { x: 1819, y: 1022 },
    popup: { x: 1372, y: 660 },
  },
  {
    name: "1280 x 720",
    ready: { x: 1216, y: 615 },
    continue: { x: 1213, y: 681 },
    popup: { x: 915, y: 440 },
  },
];

const killerActions = [
  {
    name: "The Doctor",
    actions: async function () {
      pressReleaseCtrl(3000);
      for (let i = 0; i < 5; i++) {
        if (!running) return;
        rightClick(3000);
        if (i % 5 === 0) {
          const { x, y } = robot.getMousePos();
          moveCameraRandomly(x, y);
          await sleep(2000);
          randomDirection();
        }
      }
      for (let i = 0; i < 2; i++) {
        if (!running) return;
        const { x, y } = robot.getMousePos();
        moveCameraRandomly(x, y);
        await sleep(2000);
        randomDirection();
        await leftClicks();
      }
      const { x, y } = robot.getMousePos();
      moveCameraRandomly(x, y);
      await sleep(2000);
      randomDirection();
    },
  },
  {
    name: "The Blight",
    actions: async function () {
      for (let i = 0; i < 3; i++) {
        if (!running) return;
        const duration = 20000;
        const startTime = Date.now();
        const spamRightClick = async () => {
          if (!running) return;
          while (Date.now() - startTime < duration) {
            rightClick(100);
            await sleep(100);
          }
        };
        const moveAndChangeDirection = async () => {
          if (!running) return;
          while (Date.now() - startTime < duration) {
            const { x, y } = robot.getMousePos();
            moveCameraRandomly(x, y);
            randomDirection();
            await sleep(300);
          }
        };
        if (running) {
          await Promise.all([spamRightClick(), moveAndChangeDirection()]);
        }
      }
    },
  },
  {
    name: "The Wraith",
    actions: async function () {
      for (let i = 0; i < 5; i++) {
        if (!running) return;
        rightClick(3000);
        const { x, y } = robot.getMousePos();
        moveCameraRandomly(x, y);
        await sleep(2000);
        randomDirection();
        rightClick(1500);
        const { x: newX, y: newY } = robot.getMousePos();
        moveCameraRandomly(newX, newY);
        await sleep(2000);
        randomDirection();
      }
    },
  },
  {
    name: "The Dark Lord",
    actions: async function () {
      for (let i = 0; i < 10; i++) {
        if (!running) return;
        robot.keyToggle("control", "down");
        robot.mouseClick("left");
        robot.keyToggle("control", "up");
        await sleep(3000);
      }
    },
  },
];

function printLogo() {
  console.log("\nWelcome to Dead By Daylight AFK Farming BOT by");
  console.log("______ _                               ___           _   _____ _     _ _ _ ");
  console.log("| ___ \\ |                             |_  |         | | /  __ \\ |   (_) | |");
  console.log("| |_/ / |__   __ ___   ___   _  __ _    | |_   _ ___| |_| /  \\/ |__  _| | |");
  console.log("| ___ \\ '_ \\ / _` \\ \\ / / | | |/ _` |   | | | | / __| __| |   | '_ \\| | | |");
  console.log("| |_/ / | | | (_| |\\ V /| |_| | (_| /\\__/ / |_| \\__ \\ |_| \\__/\\ | | | | | |");
  console.log(
    "\\____/|_| |_|\\__,_| \\_/  \\__, |\\__,_\\____/ \\__,_|___/\\__|\\____/_| |_|_|_|_|"
  );
  console.log("                          __/ |                                            ");
  console.log("                         |___/                                             ");
}

function selectKiller(rl) {
  return new Promise((resolve) => {
    console.log("\nPlease select your killer:");
    killerActions.forEach((killer, i) => {
      console.log(`${i + 1}. ${killer.name}`);
    });

    rl.question("Enter the number corresponding to your killer choice: ", (answer) => {
      try {
        const index = parseInt(answer) - 1;
        if (index < 0 || index >= killerActions.length) throw new Error("Invalid choice");
        selectedKillerActions = killerActions[index].actions;
        console.log(`\nKiller set to: ${killerActions[index].name}`);
        resolve();
      } catch (e) {
        console.log("\nInvalid choice! Defaulting to The Doctor.");
        selectedKillerActions = killerActions[0].actions;
        resolve();
      }
    });
  });
}

function intro() {
  printLogo();
  console.log("\nPlease select your screen resolution:");
  coordinates.forEach((res, i) => {
    console.log(`${i + 1}. ${res.name}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the number corresponding to your resolution choice: ", (answer) => {
    try {
      const index = parseInt(answer) - 1;
      if (index < 0 || index >= coordinates.length) throw new Error("Invalid choice");
      clickCoordinates = coordinates[index];
    } catch (e) {
      console.log("\nInvalid choice! Defaulting to 1920 x 1080 resolution.");
      clickCoordinates = coordinates[0];
    }

    selectKiller(rl).then(() => {
      rl.close();
      startBot();
    });
  });
}

function rightClick(delay) {
  robot.mouseToggle("down", "right");
  setTimeout(() => robot.mouseToggle("up", "right"), delay);
}

function pressReleaseCtrl(duration) {
  robot.keyToggle("control", "down");
  setTimeout(() => robot.keyToggle("control", "up"), duration);
}

async function leftClicks() {
  const numberOfClicks = Math.floor(Math.random() * 5) + 4;
  for (let i = 0; i < numberOfClicks; i++) {
    robot.mouseClick();
    await sleep(1000);
  }
  await sleep(3500);
}

function randomDirection() {
  const keys = ["w", "a", "s", "d"];
  const key = keys[Math.floor(Math.random() * keys.length)];
  robot.keyToggle(key, "down");
  const delay = Math.floor(Math.random() * 3001) + 3000;
  setTimeout(() => robot.keyToggle(key, "up"), delay);
}

function click(x, y) {
  robot.moveMouseSmooth(x, y, 1);
  robot.mouseClick();
}

function toggleRunning() {
  running = !running;
  if (running) {
    console.log("Bot started");
    botActions();
  } else {
    console.log("Bot stopped");
  }
}

function moveCameraRandomly(currentX, currentY) {
  const maxMovement = 1000;
  const newX = currentX + Math.floor(Math.random() * (2 * maxMovement + 1)) - maxMovement;
  const newY = currentY + Math.floor(Math.random() * (2 * maxMovement + 1)) - maxMovement;
  robot.moveMouseSmooth(newX, newY, 2);
}

async function botActions() {
  while (running) {
    click(clickCoordinates.ready.x, clickCoordinates.ready.y);
    await sleep(1000);
    click(clickCoordinates.continue.x, clickCoordinates.continue.y);
    await sleep(1000);
    click(clickCoordinates.popup.x, clickCoordinates.popup.y);
    await sleep(3000);
    if (selectedKillerActions) {
      await selectedKillerActions();
    } else {
      console.log("No killer actions defined. Defaulting to general actions.");
    }
    click(clickCoordinates.ready.x, clickCoordinates.ready.y);
    await sleep(1000);
    click(clickCoordinates.continue.x, clickCoordinates.continue.y);
    await sleep(1000);
    click(clickCoordinates.popup.x, clickCoordinates.popup.y);
    await sleep(3000);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startBot() {
  const keyListener = new GlobalKeyboardListener();

  keyListener.addListener(function (e, down) {
    if (e.state === "DOWN" && e.name === "F8") {
      toggleRunning();
    }
    if (e.state === "DOWN" && e.ctrl && e.name === "c") {
      process.exit(0);
    }
  });

  console.log("\nTo Start, Go to Play -> Killer");
  console.log("\nPress F8 to start or stop the Bot | Press CTRL + C to Exit!");
}

intro();
