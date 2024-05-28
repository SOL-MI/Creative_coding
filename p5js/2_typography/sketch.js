let font;
let points = [];
let movers = [];
let text = "137.5";
let boundaries = [];

function preload() {
  font = loadFont("font/RedditSans-Black.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let offsetX = 100; // 시작 x 좌표
  let offsetY = windowHeight / 2; // 시작 y 좌표

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let tempMoversArr = [];

    // 글자별 포인트 만들어주기
    let charPoints = font.textToPoints(char, offsetX, offsetY, 192, {
      sampleFactor: 1.2,
      simplifyThreshold: 0,
    });

    // 각 포인트에 대한 Mover 객체 생성하고 movers에 저장해주기
    for (let p of charPoints) {
      let m = random(0.5, 4);
      let px = p.x + random(-4, 6);
      let py = p.y + random(-6, 4);
      tempMoversArr.push(new Mover(m, px, py));
    }
    movers.push(tempMoversArr);

    // 글자별 경계 저장하기
    let boundary = font.textBounds(char, offsetX, offsetY, 192);
    console.log(boundary);
    if (boundary.h < 70) {
      boundary = {
        ...boundary,
        h: 142,
        y: windowHeight / 2 - 142,
      };
    }
    boundaries.push(boundary);

    // 자간 설정
    offsetX += boundary.w + 20;

    angleMode(DEGREES);
  }
}

function draw() {
  colorMode(HSB, 360, 100, 100); // HSB 모드 설정, 최대 범위 지정
  background(220, 80, 10);

  for (let i = 0; i < boundaries.length; i++) {
    let boundary = boundaries[i];
    let moversArray = movers[i]; // 각 글자의 Mover 배열 접근
    // let gravity = createVector(0, 0.1);

    // 마우스가 해당 경계 내에 있는지 확인
    if (
      mouseX > boundary.x &&
      mouseX < boundary.x + boundary.w &&
      mouseY > boundary.y &&
      mouseY < boundary.y + boundary.h
    ) {
      for (let mover of moversArray) {
        mover.applyRandomVelocity();
        // 마우스와 mover 사이의 거리 계산을 통한 힘 적용하기
        let mouse = createVector(mouseX + 300, mouseY);
        let dir = p5.Vector.sub(mouse, mover.position);
        let distance = dir.mag();

        if (distance < 1000) {
          dir.normalize();
          let strength = distance / 100 + 5 / distance;
          dir.mult(strength);
          mover.applyForce(dir);
        }
        if (distance < 100) {
          dir.normalize();
          let strength = 100 / distance;
          dir.mult(strength);
          mover.applyForce(dir);
        }
      }
      stroke(255, 0, 0);
    } else {
      stroke(255);
    }

    movers[i] = moversArray.filter((mover) => mover.isActive);
    // noFill();
    // rect(boundary.x, boundary.y, boundary.w, boundary.h);
  }

  for (let i = 0; i < movers.length; i++) {
    let moversArray = movers[i]; // 각 글자의 Mover 배열 접근
    for (let j = 0; j < moversArray.length; j++) {
      let mover = moversArray[j];
      mover.update(j); // j는 movers[i] 배열 내에서의 인덱스를 제공합니다
      mover.display(j); // 수정된 부분: display 호출 시 index를 전달
      mover.checkEdges();
    }
  }
}
