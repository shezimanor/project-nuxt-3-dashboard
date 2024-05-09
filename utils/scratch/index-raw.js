export class Scratch {
  constructor({
    containerRef,
    containerId = 'myScratchContainer',
    data = {},
    height = 1024,
    width = 1792,
    on = {
      init(index) {
        console.log('init', index);
      },
      firstScratch() {},
      showResult() {}
    }
  }) {
    const _this = this;
    this.data = data;
    this.container = document.getElementById(containerId);
    // 確認資料是否正確
    if (isEmptyObject(this.data) || !this.container)
      throw new Error(`No data provided`);
    // 初始化 canvas
    this.canvasMain = document.createElement('canvas'); // 刮刮樂圖層
    this.canvasPath = document.createElement('canvas'); // 路徑圖層
    this.canvasSmall = document.createElement('canvas'); // 路徑縮小圖層
    this.canvasMain.className = 'w-full';
    this.canvasPath.className = 'w-full';
    this.ctxMain = this.canvasMain.getContext('2d');
    this.ctxPath = this.canvasPath.getContext('2d');
    this.ctxSmall = this.canvasSmall.getContext('2d', {
      willReadFrequently: true
    });
    // 設定尺寸
    this.height = height;
    this.width = width;
    this.ratio = width / height;
    // other
    this.containerRef = containerRef;
    this.firstScratchFlag = false;
    this.r = 80;
    this.x = 0;
    this.y = 0;
    // 門檻
    this.threshold = 0.3;
    this.pressed = false;
    this.isFinish = false;
    // 結果動畫圓半徑
    this.finalR = ref(0);
    this.finalRenderR = useTransition(this.finalR, {
      duration: 1600,
      transition: [0.75, 0, 0.25, 1],
      onFinished() {
        _this.on.showResult();
      }
    });

    // 隨機選擇一種結果
    this.index = Math.floor(Math.random() * this.data.results.length);
    this.resultObj = this.data.results[this.index];
    this.imageResultFile = this.resultObj.image;
    this.imageCoverFile = this.data.imageCover;

    // hooks
    this.on = on;

    // 讀取圖片
    this.preloadImages();
  }

  setMouseEvent() {
    const extractor = (event) => {
      const rect = this.container.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };
    const { pressed } = useMousePressed({ target: this.containerRef });
    const { x, y } = useMouse({ target: this.containerRef, type: extractor });
    watchEffect(() => {
      if (this.isFinish) return;
      this.pressed = pressed.value;
      this.x = x.value;
      this.y = y.value;
      // 第一次互動
      if (pressed.value && !this.firstScratchFlag) {
        this.on.firstScratch();
        this.firstScratchFlag = true;
        // return; 這是為了擋掉第一次的x:0,y:0
        return;
      }
      // 互動中
      if (pressed.value) {
        this.resizeHandler();
        this.scratchCanvas(this.x, this.y);
      }
      // 中斷互動
      else {
        this.ctxMain.closePath();
        this.ctxPath.closePath();

        // 把被刮掉的部分存起來
        this.imageCover = this.canvasMain;

        // 將路徑縮小後存起來
        this.ctxSmall.drawImage(
          this.canvasPath,
          0,
          0,
          this.canvasSmall.width,
          this.canvasSmall.height
        );

        // 確認進度
        this.checkScratchProcess();
      }
    });
  }

  scratchCanvas(x, y) {
    const mx = x / this.scale;
    const my = y / this.scale;

    this.ctxMain.drawImage(
      this.imageCover,
      0,
      0,
      this.imageCover.width,
      this.imageCover.height,
      0,
      0,
      this.canvasMain.width,
      this.canvasMain.height
    );
    this.ctxMain.globalCompositeOperation = 'destination-out';
    this.ctxMain.beginPath();
    this.ctxMain.arc(mx, my, this.r, 0, Math.PI * 2, false);
    this.ctxMain.fill();
    this.ctxMain.globalCompositeOperation = 'destination-over';
    this.ctxMain.drawImage(
      this.imageResult,
      0,
      0,
      this.imageResult.width,
      this.imageResult.height,
      0,
      0,
      this.canvasMain.width,
      this.canvasMain.height
    );
    this.ctxMain.globalCompositeOperation = 'source-over';

    this.ctxPath.beginPath();
    this.ctxPath.arc(mx, my, this.r, 0, Math.PI * 2, false);
    this.ctxPath.fill();
  }

  checkScratchProcess() {
    if (this.isFinish) return;
    let imgData = this.ctxSmall.getImageData(
      0,
      0,
      this.canvasSmall.width,
      this.canvasSmall.height
    );
    const length = imgData.data.length;
    const all = length / 4;
    // 儲存被刮掉的點數
    let count = 0;
    // imgData 取出來的陣列，4個為一組(分別為rbga)，表一個 px
    for (let i = 0; i < length; i += 4) {
      // rgba 為255表已刮掉
      if (imgData.data[i + 3] === 255) {
        count++;
      }
    }
    // 如果刮掉比例大於 this.threshold 以上就結束
    if (count / all > this.threshold) {
      this.isFinish = true;
      this.setFinishAnimation();
    }
  }

  async preloadImages() {
    // 預先載入圖片後再初始化
    try {
      const imagesResponse = await Promise.all(
        [
          `/images/prototype/${this.imageCoverFile}`,
          `/images/prototype/${this.imageResultFile}`
        ].map(loadImage)
      );
      const [imageCover, imageResult] = imagesResponse;
      this.imageCover = imageCover;
      this.imageResult = imageResult;
      this.init();
    } catch (error) {
      console.error(error);
    }
  }

  init() {
    console.log('init');
    this.resizeHandler();
    this.canvasPath.width = this.canvasMain.width = this.width;
    this.canvasPath.height = this.canvasMain.height = this.height;
    this.canvasSmall.width = (this.width / 16) | 0;
    this.canvasSmall.height = (this.height / 16) | 0;
    this.ctxPath.lineWidth = this.ctxMain.lineWidth = 80;
    this.ctxPath.lineCap = this.ctxMain.lineCap = 'round';
    this.ctxPath.lineJoin = this.ctxMain.lineJoin = 'round';
    this.ctxMain.drawImage(
      this.imageCover,
      0,
      0,
      this.imageCover.width,
      this.imageCover.height,
      0,
      0,
      this.canvasMain.width,
      this.canvasMain.height
    );
    this.container.appendChild(this.canvasMain);
    this.on.init(this.index);
    this.setStopOverscroll();
    this.setMouseEvent();
  }

  resizeHandler() {
    this.scale = this.container.clientWidth / this.width;
  }

  setFinishAnimation() {
    watch(this.finalRenderR, (newR) => {
      this.ctxMain.save();
      this.ctxMain.beginPath();
      this.ctxMain.arc(
        this.width / 2,
        this.height / 2,
        newR,
        0,
        Math.PI * 2,
        false
      );
      this.ctxMain.clip();
      this.ctxMain.drawImage(
        this.imageResult,
        0,
        0,
        this.imageResult.width,
        this.imageResult.height,
        0,
        0,
        this.canvasMain.width,
        this.canvasMain.height
      );
      this.ctxMain.restore();
    });
    // start
    this.finalR.value = (this.height * 2) / 3;
  }

  setStopOverscroll() {
    // 設置 passive 為 false 以啟用 preventDefault
    window.addEventListener('touchmove', stopOverscroll, { passive: false });
  }

  unsetStopOverscroll() {
    window.removeEventListener('touchmove', stopOverscroll, { passive: false });
  }

  destroy() {
    this.unsetStopOverscroll();
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    // 創建一個圖片元素
    const img = document.createElement('img');
    img.src = url;
    // resolve Promise
    img.onload = () => resolve(img);
    // reject Promise
    img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
  });
}

function stopOverscroll(event) {
  // 取得頁面的滾動位置
  var top = document.documentElement.scrollTop;
  var totalScroll = document.documentElement.scrollHeight - window.innerHeight;

  // 判斷是否滾動到頂部或底部
  if (top === 0 || top === totalScroll) {
    event.preventDefault(); // 阻止滾動
  }
}
