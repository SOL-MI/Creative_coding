import { Visual } from "./visual.js";
import { Wave } from "./wave.js";

class App {
  constructor() {
    this.setWebgl();
    WebFont.load({
      google: {
        families: ["Hind:700"],
      },
      fontactive: () => {
        this.visual = new Visual();
        // this.wave = new Wave(this.renderer, this.stage); // Wave 객체 생성
        // console.log(this.wave);
        window.addEventListener("resize", this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));

        // input 요소에 이벤트 리스너 추가
        const input = document.getElementById("user-input");
        input.addEventListener("input", () => {
          this.visual.show(
            this.stageWidth,
            this.stageHeight,
            this.stage,
            input.value
          );
        });

        this.initGUI();
      },
    });
  }

  setWebgl() {
    this.renderer = new PIXI.Renderer({
      width: document.body.clientWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      powerPreference: "high-performance",
      background: 0x69dcff,
    });
    document.body.appendChild(this.renderer.view);

    this.stage = new PIXI.Container();

    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 5;
    blurFilter.autoFit = true;

    const fragSource = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float threshold;
      uniform float mr;
      uniform float mg;
      uniform float mb;
      void main(void){
        vec4 color = texture2D(uSampler, vTextureCoord);
        vec3 mcolor = vec3(mr, mg, mb);
        if(color.a > threshold){
          gl_FragColor = vec4(mcolor, 1.0);
        } else {
          gl_FragColor = vec4(vec3(0.0), 0.0);
        }
      }
    `;

    // 글자 생상을 변경하는 필터
    const uniformData = {
      threshold: 0.5,
      mr: 255.0 / 255.0,
      mg: 100.0 / 255.0,
      mb: 0.0 / 255.0,
    };

    const thresholdFilter = new PIXI.Filter(null, fragSource, uniformData);
    this.stage.filters = [blurFilter, thresholdFilter];
    this.stage.filterArea = this.renderer.screen;
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = window.innerHeight;

    this.renderer.resize(this.stageWidth, this.stageHeight);

    this.visual.show(this.stageWidth, this.stageHeight, this.stage);
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this));

    this.visual.animate();
    // this.wave.update();

    this.renderer.render(this.stage);
  }
}

window.onload = () => {
  new App();
};
