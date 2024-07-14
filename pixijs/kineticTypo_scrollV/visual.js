import { Text } from "./text.js";
import { Particle } from "./particle.js";

export class Visual {
  constructor() {
    this.text = new Text();

    this.texture = PIXI.Texture.from("particle.png");

    this.particles = [];

    this.circles = [
      {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.min(window.innerWidth, window.innerHeight) * 0.01,
      },
      {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.min(window.innerWidth, window.innerHeight) * 0.087,
      },
    ];

    this.mouse = {
      x: 0,
      y: 0,
      radius: Math.min(window.innerWidth, window.innerHeight) * 0.05,
    };

    document.addEventListener("pointermove", this.onMove.bind(this), false);
    this.setMouseRadius();

    // 주기적으로 원의 위치를 변경
    setInterval(this.updateCirclePositions.bind(this), 100);
  }

  setMouseRadius() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    this.mouse.radius = Math.min(screenWidth, screenHeight) * 0.1;
  }

  show(stageWidth, stageHeight, stage, inputValue) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    this.pos = this.text.setText(inputValue ?? "", 3, stageWidth, stageHeight);
    this.container = new PIXI.ParticleContainer(this.pos.length, {
      vertices: false,
      position: true,
      rotation: false,
      scale: false,
      uvs: false,
      tint: false,
    });
    stage.addChild(this.container);

    this.particles = [];

    // for (let i = 0; i < this.pos.length; i++) {
    //   const item = new Particle(this.pos[i], this.texture);
    //   this.container.addChild(item.sprite);
    //   this.particles.push(item);
    // }

    const particleCount = Math.floor(this.pos.length * 0.28); // 원하는 비율로 입자 수 조절
    for (let i = 0; i < particleCount; i++) {
      const index = Math.floor(Math.random() * this.pos.length);
      const item = new Particle(this.pos[index], this.texture);
      if (!this.particles.includes(item)) {
        // 중복 제거
        this.container.addChild(item.sprite);
        this.particles.push(item);
      }
    }
  }

  updateCirclePositions() {
    this.circles.forEach((circle) => {
      circle.x = Math.random() * window.innerWidth;
      circle.y = Math.random() * window.innerHeight;
    });
  }

  updateTextOptions(options, stage, stageWidth, stageHeight) {
    this.text.updateStyle(options); // 스타일 업데이트
    const input = document.getElementById("user-input").value; // 현재 입력값 가져오기
    this.show(stageWidth, stageHeight, stage, input); // 텍스트 갱신
  }

  animate() {
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];

      // 두 원 & 파티클 간의 충돌 처리
      this.circles.forEach((circle) => {
        let dx = circle.x - item.x;
        let dy = circle.y - item.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let minDist = item.radius + circle.radius;

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          const tx = item.x + Math.cos(angle) * minDist;
          const ty = item.y + Math.sin(angle) * minDist;
          const ax = tx - circle.x;
          const ay = ty - circle.y;
          item.vx -= ax;
          item.vy -= ay;
        }
      });

      // 마우스와의 충돌 처리
      let dx = this.mouse.x - item.x;
      let dy = this.mouse.y - item.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x + Math.cos(angle) * minDist;
        const ty = item.y + Math.sin(angle) * minDist;
        const ax = tx - this.mouse.x;
        const ay = ty - this.mouse.y;
        item.vx -= ax;
        item.vy -= ay;
      }

      item.draw();
    }
  }

  onMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }
}
