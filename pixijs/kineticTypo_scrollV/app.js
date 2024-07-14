import { Visual } from "./visual.js";
import { Wave } from "./wave.js";

class App {
  constructor() {
    this.fragSource = `
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
    this.backgroundColor = 0x69dcff; // 초기 배경 색상
    this.uniformData = {
      // 초기 uniform 데이터 설정
      threshold: 0.5,
      mr: 1.0,
      mg: 0.39,
      mb: 0.0,
    };
    this.setWebgl(this.backgroundColor, this.uniformData);

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

  setWebgl(bgColor, uniformData) {
    if (!this.renderer) {
      this.renderer = new PIXI.Renderer({
        width: document.body.clientWidth,
        height: window.innerHeight,
        antialias: true,
        transparent: false,
        resolution: window.devicePixelRatio > 1 ? 2 : 1,
        autoDensity: true,
        powerPreference: "high-performance",
        background: bgColor,
      });
      document.body.appendChild(this.renderer.view);

      this.stage = new PIXI.Container();

      const blurFilter = new PIXI.filters.BlurFilter();
      blurFilter.blur = 5;
      blurFilter.autoFit = true;

      //   const fragSource = `
      //   precision mediump float;
      //   varying vec2 vTextureCoord;
      //   uniform sampler2D uSampler;
      //   uniform float threshold;
      //   uniform float mr;
      //   uniform float mg;
      //   uniform float mb;
      //   void main(void){
      //     vec4 color = texture2D(uSampler, vTextureCoord);
      //     vec3 mcolor = vec3(mr, mg, mb);
      //     if(color.a > threshold){
      //       gl_FragColor = vec4(mcolor, 1.0);
      //     } else {
      //       gl_FragColor = vec4(vec3(0.0), 0.0);
      //     }
      //   }
      // `;

      // // 글자 생상을 변경하는 필터
      // const uniformData = {
      //   threshold: 0.5,
      //   mr: 255.0 / 255.0,
      //   mg: 100.0 / 255.0,
      //   mb: 0.0 / 255.0,
      // };

      const thresholdFilter = new PIXI.Filter(
        null,
        this.fragSource,
        this.uniformData
      );
      // this.thresholdFilter = new PIXI.Filter(null, fragSource, uniformData);

      this.stage.filters = [blurFilter, thresholdFilter];
      this.stage.filterArea = this.renderer.screen;
    } else {
      console.log("bgColor", bgColor);
      this.renderer.backgroundColor = bgColor; // 기존 렌더러의 배경 색상 업데이트
      const thresholdFilter = new PIXI.Filter(
        null,
        this.fragSource,
        this.uniformData
      );
      // this.thresholdFilter.uniforms = uniformData; // uniformData 업데이트
    }
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = window.innerHeight;

    this.renderer.resize(this.stageWidth, this.stageHeight);

    const input = document.getElementById("user-input");
    if (this.visual) {
      this.visual.show(
        this.stageWidth,
        this.stageHeight,
        this.stage,
        input.value
      );
    }
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this));

    this.visual.animate();
    // this.wave.update();

    this.renderer.render(this.stage);
  }

  initGUI() {
    const gui = new dat.GUI();

    const textOptions = {
      fontSize: 300,
      bgColor: "#69dcff",
      filterColor: "#ff6400",
    };

    gui.add(textOptions, "fontSize", 100, 500).onChange((value) => {
      this.visual.updateTextOptions(
        { fontSize: value },
        this.stage,
        this.stageWidth,
        this.stageHeight
      );
    });

    gui.addColor(textOptions, "bgColor").onChange((value) => {
      console.log("value", value);
      const hexColor = parseInt(value.replace(/^#/, ""), 16); // 색상을 16진수로 변환

      this.backgroundColor = hexColor;
      textOptions.bgColor = value;

      this.setWebgl(hexColor, this.uniformData);
      // this.resize();
    });

    gui.addColor(textOptions, "filterColor").onChange((value) => {
      const color = parseInt(value.replace(/^#/, ""), 16); // 16진수로 변환
      this.uniformData.mr = ((color >> 16) & 0xff) / 255.0;
      this.uniformData.mg = ((color >> 8) & 0xff) / 255.0;
      this.uniformData.mb = (color & 0xff) / 255.0;
      this.setWebgl(this.backgroundColor, this.uniformData);
      // this.resize();

      textOptions.filterColor = value;
      console.log(textOptions);
    });
  }
}

window.onload = () => {
  new App();
};
