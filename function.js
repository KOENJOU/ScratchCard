let cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
var radius; // 繪製的圖形大小
var sec; // 跑一次座標的秒數

var scratchcardStatus; // 刮刮樂的狀態

function openScratchcard() {
  $("#loading").css("display", "flex");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  $("#canvas").css("display", "block");
  setTimeout(() => {
    drawMainStage();
  }, 1000);
}

/**
 * 繪製刮刮樂
 */
function drawMainStage() {
  let imgCleaner = new Image();
  canvas.width = "300";
  canvas.height = "450";
  canvas.style.width = "300px";
  canvas.style.height = "450px";
  imgCleaner.src = "images/gray.png";
  imgCleaner.onload = () => {
    $("#loading").css("display", "none");
    w = canvas.width * (imgCleaner.height / imgCleaner.width);
    ctx.globalAlpha = 1;
    produceCoordinate(canvas.width, canvas.height);
    ctx.drawImage(imgCleaner, 0, 0, canvas.width, w);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 120;
    ctx.globalCompositeOperation = "destination-out";
  };
}

let coordinate; // 座標陣列
let coinCoordinate; // 錢幣座標陣列
let start, end;
/**
 * 計算要刮的座標
 * @param {Number} width canvas寬度
 * @param {Number} height canvas高度
 */
function produceCoordinate(width, height) {
  coordinate = [];
  coinCoordinate = [];
  start = new Date().getTime();
  // 更新圖形半徑
  radius = width / 10;
  // 寬12等份 高15等份
  let partX = width / 12;
  let partY = height / 15;
  // 第一個座標位置
  let initX = parseInt(partX);
  let initY = parseInt(partY);
  coordinate = [[initX + 20, initY + 20]];
  let x = initX;
  let y = initY;
  for (a = 0; a < partX * 2; a++) {
    let rand = Math.floor(Math.random() * 10) + 5;
    x = x + rand;
    y = y + rand;
    for (i = 0; i < partX; i++) {
      let rand = Math.floor(Math.random() * 20) + 10;
      //偶數x減少 y增加
      if (a % 2 == 0) {
        x -= rand;
        y += rand;
      } else {
        x += rand;
        y -= rand;
      }
      // 設定邊界不可小於初始座標 大於 寬/高-初始座標
      if (x > partX && x < width - partX && y > partY && y < height - partY) {
        coordinate.push([x, y]);
      }
    }
  }
  // 設定最大最小長度
  let minLength = parseInt(width / 2);
  let maxLength = width;
  if (width > 500) {
    minLength = 450;
    maxLength = 550;
  }
  if (coordinate.length <= minLength || coordinate.length >= maxLength) {
    produceCoordinate(canvas.width, canvas.height);
    return;
  }
  // 硬幣位置距離刮開位置要偏移20
  for (a = 0; a < coordinate.length; a++) {
    if (a == 0) {
      coinCoordinate = [
        [parseInt(coordinate[a][0] + 20), parseInt(coordinate[a][1] - 40)],
      ];
    } else {
      coinCoordinate.push([
        parseInt(coordinate[a][0] + 20),
        parseInt(coordinate[a][1] - 40),
      ]);
    }
  }
}

/**
 * 設定刮刮樂刮的形狀
 * @param {Number} x X座標
 * @param {Number} y Y座標
 */
function drawline(x, y) {
  ctx.save();
  ctx.beginPath();
  var array = [
    radius * 0.5,
    radius * 0.4,
    radius * 0.3,
    radius * 0.2,
    radius * 0.1,
  ];
  var rand = Math.floor(Math.random() * 5);
  ctx.ellipse(x,y,array[rand],radius * 1.2,(35 * Math.PI) / 180,0,2 * Math.PI); // 橢圓
  ctx.fill();
  ctx.restore();
}

/**
 * 開始跑刮刮樂動畫
 */
let idx = 0;
function draw() {
  $("#start").css("display", "none");
  $("#refresh").css("display", "block");
  $("#loading").css("display", "none");
  if (idx === coordinate.length - 5) {
    $("#canvas").fadeOut();
  }
  if (idx >= coordinate.length) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame;
    end = new Date().getTime();
    $("#coin").hide();

    setTimeout(() => {
      $("#congratulationsMask").show();
      scrollAnimation();
    }, 100);
    setTimeout(() => {
      $("#congratulationsMask").hide();
    }, 3000);
  } else {
    drawline(coordinate[idx][0], coordinate[idx][1], ctx);
    showCoin(idx, coinCoordinate);
    idx++;
    sec = parseInt(2000 / coordinate.length);
    setTimeout(() => {
      draw(coordinate, ctx);
    }, sec);
  }
}

/**
 * 顯示硬幣
 * @param {*} idx
 * @param {*} coinCoordinate
 */
function showCoin(idx, coinCoordinate) {
  if (idx === 0) {
    $("#coin").show();
  }

  $("#coin").css("left", coinCoordinate[idx][0]);
  $("#coin").css("top", coinCoordinate[idx][1]);
}

/**
 * 恭喜卷軸動畫
 */
function scrollAnimation() {
  $("#centerScroll").css("height", "170px");
  $("#leftScroll").animate({ left: "32.2%" }, 1700);
  $("#rightScroll").animate({ right: "32.2%" }, 1700);
  $("#centerScroll").animate({ width: "350px" }, 1700, function () {
    $("#scrollContent").css("color", "#c03c3c").hide().fadeIn(10);
    $("#scrollRhinestone").css("opacity", "1").hide().fadeIn(10);
  });
}
