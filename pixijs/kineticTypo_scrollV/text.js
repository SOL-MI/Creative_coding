export class Text {
  constructor() {
    this.canvas = document.createElement("canvas");
    // this.canvas.style.position = "absolute";
    // this.canvas.style.left = "0";
    // this.canvas.style.top = "0";
    // document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.textStyle = {
      fontWidth: 700,
      fontSize: window.innerWidth - 100 > 800 ? 400 : window.innerWidth / 3,
      fontName: "Hind",
      fillStyle: "rgba(0, 0, 0, 0.3)",
    };
  }

  setText(str, density, stageWidth, stageHeight) {
    this.canvas.width = stageWidth;
    this.canvas.height = stageHeight;

    const myText = str.split("\n"); // 줄바꿈을 기준으로 텍스트를 분리
    const { fontWidth, fontName, fillStyle } = this.textStyle;
    let fontSize = this.textStyle.fontSize;

    // const fontWidth = 700;
    // const fontSize =
    //   window.innerWidth - 100 > 800 ? 400 : window.innerWidth / 3;

    this.ctx.clearRect(0, 0, stageWidth, stageHeight);
    this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
    this.ctx.fillStyle = fillStyle;
    this.ctx.textBaseline = `middle`;

    // 텍스트가 화면을 넘는지 검사하는 함수
    const isTextOverflowing = () => {
      this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
      const lineHeight = fontSize * 1.2;
      const totalTextHeight = lineHeight * myText.length;
      if (totalTextHeight > stageHeight) {
        return true;
      }

      for (let line of myText) {
        const fontPos = this.ctx.measureText(line);
        if (fontPos.width > stageWidth) {
          return true;
        }
      }
      return false;
    };

    // 텍스트가 화면을 넘어갈 때만 글씨 크기를 줄임
    while (isTextOverflowing()) {
      fontSize *= 0.9; // 글씨 크기를 줄임
    }

    // 각 줄의 높이와 시작 지점을 계산
    const lineHeight = fontSize * 1.2; // 줄 간격을 설정
    const totalTextHeight = lineHeight * myText.length;
    let startY = (stageHeight - totalTextHeight) / 2 + lineHeight / 2;

    myText.forEach((line, index) => {
      const fontPos = this.ctx.measureText(line);
      this.ctx.fillText(
        line,
        (stageWidth - fontPos.width) / 2,
        startY + index * lineHeight
      );
    });

    return this.dotPos(
      density,
      Math.floor(stageWidth),
      Math.floor(stageHeight)
    );
  }

  dotPos(density, stageWidth, stageHeight) {
    stageWidth = Math.floor(stageWidth);
    stageHeight = Math.floor(stageHeight);
    const imageData = this.ctx.getImageData(0, 0, stageWidth, stageHeight).data;
    const particles = [];
    let pixel;

    for (let height = 0; height < stageHeight; height += density) {
      for (let width = 0; width < stageWidth; width += density) {
        pixel = imageData[(width + height * stageWidth) * 4 - 1];

        if (
          pixel !== 0 &&
          width > 0 &&
          width < stageWidth &&
          height > 0 &&
          height < stageHeight
        ) {
          particles.push({
            x: width,
            y: height,
          });
        }
      }
    }

    return particles;
  }

  updateStyle(styleOptions) {
    console.log("styleOptions", styleOptions);

    if (styleOptions.fontSize !== undefined) {
      this.textStyle.fontSize = styleOptions.fontSize;
    }
    if (styleOptions.fillStyle !== undefined) {
      this.textStyle.fillStyle = styleOptions.fillStyle;
    }
    if (styleOptions.fontWidth !== undefined) {
      this.textStyle.fontWidth = styleOptions.fontWidth;
    }
  }
}
