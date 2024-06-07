let angle = 0;
let v = 0;
let a = 0.001;
let movers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 20; i++) {
    movers.push(
      new Mover(
        random(width),
        random(height),
        color(100, random(100, 255), 200)
      )
    );
  }
}

function draw() {
  background(50, 50);

  fill(255);
  noStroke();
  push();
  rectMode(CENTER);
  translate(width / 2, height / 2);
  rotate(angle);
  ellipse(100, 0, 100, 100);
  rotate(angle * 2);
  ellipse(200, 0, 50, 50);
  rotate(angle);
  fill(100, 200, 255, 80);
  ellipse(230, 0, 20, 20);
  // rect(250, 0, 10, 50);
  pop();

  v += a;
  angle += v;
  for (let i = 0; i < movers.length; i++) {
    movers[i].update();
    movers[i].display();
  }
}
