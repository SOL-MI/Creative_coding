let font;
let points = [];
let movers = [];
let text = "SOLMI";
let boundaries = [];

function preload() {
  font = loadFont("font/RedditSans-Black.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let offsetX = 100; // 시작 x 좌표
  let offsetY = 200; // 시작 y 좌표

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let tempMoversArr = [];

    // 글자별 포인트 만들어주기
    let charPoints = font.textToPoints(char, offsetX, offsetY, 192, {
      sampleFactor: 0.4,
      simplifyThreshold: 0,
    });

    // 각 포인트에 대한 Mover 객체 생성하고 movers에 저장해주기
    for (let p of charPoints) {
      let m = random(0.5, 4);
      tempMoversArr.push(new Mover(m, p.x, p.y));
    }
    movers.push(tempMoversArr);

    // 글자별 경계 저장하기
    let boundary = font.textBounds(char, offsetX, offsetY, 192);
    boundaries.push(boundary);

    // 자간 설정
    offsetX += boundary.w + 10;
  }
}

function draw() {
  background(0);

  for (let i = 0; i < boundaries.length; i++) {
    let boundary = boundaries[i];
    let moversArray = movers[i]; // 각 글자의 Mover 배열 접근
    let gravity = createVector(0, 0.1);

    // 마우스가 해당 경계 내에 있는지 확인
    if (
      mouseX > boundary.x &&
      mouseX < boundary.x + boundary.w &&
      mouseY > boundary.y &&
      mouseY < boundary.y + boundary.h
    ) {
      for (let mover of moversArray) {
        mover.applyRandomVelocity();
      }
      stroke(255, 0, 0);
    } else {
      stroke(255);
    }

    noFill();
    // rect(boundary.x, boundary.y, boundary.w, boundary.h);
  }

  for (let moverArray of movers) {
    for (let mover of moverArray) {
      mover.update();
      mover.display();
      mover.checkEdges();
    }
  }
}
