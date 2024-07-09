// export class Wave {
//   constructor(renderer, stage) {
//     this.renderer = renderer;
//     this.stage = stage;
//     this.points = [];
//     this.numPoints = 100;
//     this.waveHeight = 30;
//     this.waveLength = 20;

//     // 선을 생성하고 초기화
//     this.line = new PIXI.Graphics();
//     this.line.x = 0;
//     this.line.y = this.renderer.height / 2;
//     this.stage.addChild(this.line);

//     // 점 초기화
//     for (let i = 0; i < this.numPoints; i++) {
//       this.points.push({
//         x: (i / this.numPoints) * window.innerWidth,
//         y: 0,
//       });
//     }

//     this.lastTime = 0;
//     this.animate = this.animate.bind(this);
//     this.animate();
//   }

//   animate() {
//     requestAnimationFrame(this.animate);

//     let currentTime = performance.now();
//     let delta = (currentTime - this.lastTime) / 1000;
//     this.lastTime = currentTime;

//     this.update(delta);
//   }

//   update(delta) {
//     this.line.clear();
//     this.line.lineStyle(2, 0xffffff, 1);
//     this.line.moveTo(this.points[50].x, this.points[50].y);

//     for (let i = 1; i < this.numPoints; i++) {
//       this.line.moveTo(this.points[i].x, this.points[i].y);

//       const point = this.points[i];
//       // 각 점의 y 위치를 시간과 인덱스에 따라 사인파로 조정
//       point.y = Math.sin(i * 0.2 + performance.now() * 0.002) * this.waveHeight;
//       this.line.lineTo(point.x, point.y + this.line.y);
//     }
//   }
// }

export class Wave {
  constructor(renderer, stage) {
    this.renderer = renderer;
    this.stage = stage;
    this.points = [];
    this.numPoints = 500;
    this.maxWaveHeight = 30;
    this.movementRadius = 50; // 각 점이 움직일 수 있는 최대 반경

    // 선을 생성하고 초기화
    this.line = new PIXI.Graphics();
    this.stage.addChild(this.line);

    // 점 초기화 및 무작위 위치 설정
    for (let i = 0; i < this.numPoints; i++) {
      const x = (i / this.numPoints) * this.renderer.width;
      const y = Math.random() * this.renderer.height;
      this.points.push({
        originX: x,
        originY: y,
        x: x,
        y: y,
        vx: Math.random() * 2 - 1, // 무작위 속도
        vy: Math.random() * 2 - 1,
      });
    }

    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.stage);
  }

  update() {
    this.line.clear();
    this.line.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.numPoints; i++) {
      const point = this.points[i];

      // 점의 위치 업데이트
      point.x += point.vx;
      point.y += point.vy;

      // 원점에서의 거리 계산
      const dist = Math.sqrt(
        Math.pow(point.x - point.originX, 2) +
          Math.pow(point.y - point.originY, 2)
      );
      if (dist > this.movementRadius) {
        // 거리가 움직임 반경을 벗어난 경우 방향 반전
        point.vx *= -1;
        point.vy *= -1;
      }

      // 불규칙한 선 굵기와 흰색으로 점들을 선으로 연결
      this.line.lineStyle(Math.random() * 5, 0xffffff, 1); // 선의 굵기는 불규칙하며 색상은 흰색
      this.line.lineTo(point.x, point.y);
    }
  }
}
