// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
let movers = [];

let attractor = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    movers[i] = new Mover(random(width), random(height), random(0.5, 3));
  }
  for (let i = 0; i < 2; i++) {
    attractor[i] = new Attractor(random(width), random(height));
  }
}

function draw() {
  background(255);

  for (let i = 0; i < movers.length; i++) {
    let force1 = attractor[0].attract(movers[i]);
    let force2 = attractor[1].attract(movers[i]);
    if (i % 2 === 0) {
      movers[i].applyForce(force2);
    } else {
      movers[i].applyForce(force1);
    }

    movers[i].update();
    movers[i].show();
  }

  for (let i = 0; i < attractor.length; i++) {
    attractor[i].show();
  }
}

function mouseMoved(i) {
  attractor[i].handleHover(mouseX, mouseY);
}

function mousePressed() {
  attractor.handlePress(mouseX, mouseY);
}

function mouseDragged() {
  attractor.handleHover(mouseX, mouseY);
  attractor.handleDrag(mouseX, mouseY);
}

function mouseReleased() {
  attractor.stopDragging();
}
