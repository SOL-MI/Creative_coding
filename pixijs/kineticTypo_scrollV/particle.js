const FRICTION = 0.5;
const MOVE_SPEED = 0.05;
const RANDOM_FORCE = 5; // 무작위 힘

export class Particle {
  constructor(pos, texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.scale.set(0.3);
    this.sprite.tint = Math.random() * 0x2f2f2f;

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    // this.vx = 0;
    // this.vy = 0;

    // 초기 속도에 무작위 요소 추가
    this.vx = (Math.random() - 0.5) * 2 * RANDOM_FORCE;
    this.vy = (Math.random() - 0.5) * 2 * RANDOM_FORCE;

    this.radius = 10;
  }

  draw() {
    // 자기 자리로 돌아가려는 힘 + 무작위 힘
    this.vx +=
      ((this.savedX - this.x) * MOVE_SPEED +
        (Math.random() - 0.5) * RANDOM_FORCE) *
      0.5;
    this.vy +=
      ((this.savedY - this.y) * MOVE_SPEED +
        (Math.random() - 0.5) * RANDOM_FORCE) *
      0.5;

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
  // draw() {
  //   const distance = Math.sqrt(
  //     (this.savedX - this.x) ** 2 + (this.savedY - this.y) ** 2
  //   );
  //   const slowdownRadius = 60; // 거리 임계값

  //   let speedAdjustmentFactor = 1;
  //   if (distance < slowdownRadius) {
  //     // 거리가 임계값보다 작으면, 감쇠 계수를 거리에 비례하여 증가
  //     speedAdjustmentFactor = distance / slowdownRadius;
  //   }

  //   // 자기 자리로 돌아가려는 힘 + 무작위 힘
  //   this.vx +=
  //     ((this.savedX - this.x) * MOVE_SPEED * (Math.random() - 0.5) +
  //       (Math.random() - 0.5) * RANDOM_FORCE) *
  //     speedAdjustmentFactor;
  //   this.vy +=
  //     ((this.savedY - this.y) * MOVE_SPEED +
  //       (Math.random() - 0.5) * RANDOM_FORCE) *
  //     speedAdjustmentFactor;

  //   this.vx *= FRICTION;
  //   this.vy *= FRICTION;

  //   this.x += this.vx;
  //   this.y += this.vy;

  //   this.sprite.x = this.x;
  //   this.sprite.y = this.y;
  // }
}
