// 「桶」理心 - 垃圾分類小達人（行動裝置安全相容版）
let gameState = "START";
let score = 0;
let currentIdx = 0;
let audioCtx = null;

let questions = [];
let itemImages = [];
let particles = [];

function preload() {
  let rawData = [
    { item: "用過的紙餐盒", category: "紙類", desc: "紙餐盒雖然有防水膜，但在本專案中歸類為紙類回收！", type: "box" },
    { item: "吃剩的雞骨頭", category: "廚餘", desc: "雞骨頭屬於一般肉類廚餘（非硬骨），可投入廚餘桶。", type: "bone" },
    { item: "廢紙箱", category: "紙類", desc: "乾淨的紙箱請拆開壓平，投入紙類回收桶。", type: "carton" },
    { item: "塑膠寶特瓶", category: "塑膠容器", desc: "寶特瓶洗淨後壓扁，投入塑膠容器桶。", type: "bottle" },
    { item: "用過的衛生紙", category: "一般垃圾", desc: "用過的衛生紙髒汙無法回收，應丟一般垃圾。", type: "tissue" },
    { item: "果皮", category: "廚餘", desc: "天然果皮屬於堆肥廚餘。", type: "peel" },
    { item: "布丁塑膠盒", category: "塑膠容器", desc: "洗淨後的布丁杯、豆腐盒等塑膠容器屬於塑膠容器回收。", type: "pudding" },
    { item: "舊筆記本", category: "紙類", desc: "一般紙張與筆記本屬於紙類回收。", type: "book" },
    { item: "喝完的飲料紙盒", category: "紙類", desc: "牛奶盒、飲料紙盒請清洗乾淨後回收。", type: "drinkbox" },
    { item: "塑膠免洗杯", category: "塑膠容器", desc: "塑膠杯洗淨後投入塑膠容器回收桶。", type: "plasticcup" },
    { item: "蛋殼", category: "廚餘", desc: "碎蛋殼屬於廚餘類。", type: "egg" },
    { item: "吃完的便當塑膠袋", category: "一般垃圾", desc: "被油汙污染嚴重的塑膠袋無法回收，丟一般垃圾。", type: "bag" },
    { item: "舊報紙", category: "紙類", desc: "報紙、雜誌請整齊綑綁投入紙類回收。", type: "newspaper" },
    { item: "保麗龍盒", category: "一般垃圾", desc: "保麗龍材質較特殊，一般多歸類於一般垃圾或指定回收。", type: "styrofoam" },
    { item: "茶葉渣", category: "廚餘", desc: "泡完的茶葉渣、咖啡渣屬於廚餘。", type: "tea" },
    { item: "塑膠玩具", category: "一般垃圾", desc: "複合材質的塑膠玩具通常無法直接回收。", type: "toy" },
    { item: "廣告傳單", category: "紙類", desc: "各類宣傳單、DM 屬於紙類回收。", type: "flyer" },
    { item: "蔬菜葉", category: "廚餘", desc: "煮菜剩下的菜葉屬於堆肥廚餘。", type: "veggie" },
    { item: "洗髮精塑膠瓶", category: "塑膠容器", desc: "用完的洗髮精空瓶清洗乾淨後可塑膠容器回收。", type: "shampoo" },
    { item: "破掉的陶瓷馬克杯", category: "一般垃圾", desc: "陶瓷、玻璃碎片屬於一般垃圾（需包好以防割傷）。", type: "mug" }
  ];

  for (let i = 0; i < rawData.length; i++) {
    let pg = createGraphics(140, 95);
    pg.background(255, 245, 248);
    pg.smooth();
    
    let t = rawData[i].type;
    pg.push();
    pg.translate(70, 47);
    
    if (t === "box") {
      pg.fill(210, 170, 120);
      pg.stroke(150, 110, 70);
      pg.strokeWeight(2);
      pg.rect(-45, -25, 90, 50, 6);
      pg.fill(240, 210, 170);
      pg.rect(-45, -25, 90, 15, 6);
    } else if (t === "bone") {
      pg.fill(245, 235, 210);
      pg.stroke(180, 160, 130);
      pg.strokeWeight(2);
      pg.ellipse(-35, 0, 24, 24);
      pg.ellipse(35, 0, 24, 24);
      pg.rect(-35, -10, 70, 20, 8);
    } else if (t === "carton") {
      pg.fill(160, 110, 60);
      pg.stroke(100, 70, 30);
      pg.strokeWeight(2);
      pg.rect(-35, -32, 70, 64, 4);
      pg.stroke(220, 190, 150);
      pg.line(-20, -10, 20, -10);
      pg.line(-20, 10, 20, 10);
    } else if (t === "bottle") {
      pg.fill(135, 206, 250, 220);
      pg.stroke(70, 130, 180);
      pg.strokeWeight(2);
      pg.rect(-18, -25, 36, 55, 12);
      pg.fill(200);
      pg.rect(-8, -38, 16, 13, 3);
    } else if (t === "tissue") {
      pg.fill(255);
      pg.stroke(210, 210, 210);
      pg.strokeWeight(1.5);
      pg.beginShape();
      pg.vertex(-15, -12);
      pg.vertex(15, -12);
      pg.vertex(25, -35);
      pg.vertex(-25, -35);
      pg.endShape(CLOSE);
      pg.fill(255, 225, 235);
      pg.stroke(220, 130, 160);
      pg.strokeWeight(2);
      pg.rect(-42, -12, 84, 42, 8);
      pg.fill(255, 105, 140);
      pg.noStroke();
      pg.ellipse(0, 8, 22, 10);
    } else if (t === "peel") {
      pg.fill(255, 220, 50);
      pg.stroke(180, 130, 0);
      pg.strokeWeight(2);
      pg.arc(-15, 0, 50, 40, HALF_PI, PI + HALF_PI);
      pg.arc(15, 0, 50, 40, -HALF_PI, HALF_PI);
      pg.fill(255, 250, 200);
      pg.rect(-8, -18, 16, 36, 6);
    } else if (t === "pudding") {
      pg.fill(255, 220, 150, 230);
      pg.stroke(180, 120, 40);
      pg.strokeWeight(2);
      pg.quad(-30, -22, 30, -22, 20, 28, -20, 28);
      pg.fill(200, 100, 30);
      pg.noStroke();
      pg.ellipse(0, 22, 26, 8);
    } else if (t === "book") {
      pg.fill(65, 105, 225);
      pg.stroke(30, 60, 150);
      pg.strokeWeight(2);
      pg.rect(-35, -30, 70, 60, 4);
      pg.fill(255);
      pg.rect(-25, -20, 55, 45, 2);
    } else if (t === "drinkbox") {
      pg.fill(255, 245, 220);
      pg.stroke(200, 160, 120);
      pg.strokeWeight(2);
      pg.rect(-25, -32, 50, 64, 6);
      pg.fill(220, 40, 40);
      pg.triangle(0, -15, -15, 10, 15, 10);
    } else if (t === "plasticcup") {
      pg.fill(175, 238, 238, 200);
      pg.stroke(70, 150, 150);
      pg.strokeWeight(2);
      pg.quad(-25, -30, 25, -30, 20, 30, -20, 30);
      pg.fill(220);
      pg.rect(-28, -38, 56, 8, 3);
    } else if (t === "egg") {
      pg.fill(255, 248, 220);
      pg.stroke(210, 190, 150);
      pg.strokeWeight(2);
      pg.ellipse(0, 0, 38, 48);
    } else if (t === "bag") {
      pg.fill(112, 128, 144);
      pg.stroke(70, 80, 90);
      pg.strokeWeight(2);
      pg.rect(-35, -20, 70, 45, 12);
      pg.noFill();
      pg.stroke(112, 128, 144);
      pg.strokeWeight(3);
      pg.arc(0, -20, 25, 20, PI, 0);
    } else if (t === "newspaper") {
      pg.fill(235, 235, 235);
      pg.stroke(180, 180, 180);
      pg.strokeWeight(2);
      pg.rect(-38, -28, 76, 56, 3);
      pg.fill(100);
      pg.noStroke();
      pg.rect(-28, -18, 56, 8);
      pg.rect(-28, -2, 45, 6);
      pg.rect(-28, 8, 50, 6);
    } else if (t === "styrofoam") {
      pg.fill(255, 255, 255);
      pg.stroke(200, 200, 200);
      pg.strokeWeight(2);
      pg.rect(-40, -20, 80, 40, 6);
      pg.fill(230, 230, 230);
      pg.rect(-40, -30, 80, 12, 5);
    } else if (t === "tea") {
      pg.fill(101, 67, 33);
      pg.stroke(60, 40, 20);
      pg.strokeWeight(2);
      pg.ellipse(0, 10, 60, 30);
      pg.fill(70, 45, 20);
      pg.noStroke();
      pg.ellipse(0, 5, 45, 18);
    } else if (t === "toy") {
      pg.fill(255, 69, 0);
      pg.stroke(180, 40, 0);
      pg.strokeWeight(2);
      pg.rect(-30, -20, 60, 40, 10);
      pg.fill(255, 215, 0);
      pg.ellipse(-15, 5, 12, 12);
      pg.ellipse(15, 5, 12, 12);
    } else if (t === "flyer") {
      pg.fill(255, 182, 193);
      pg.stroke(200, 100, 120);
      pg.strokeWeight(2);
      pg.rect(-32, -32, 64, 64, 3);
      pg.fill(255, 105, 180);
      pg.noStroke();
      pg.rect(-20, -15, 40, 15);
    } else if (t === "veggie") {
      pg.fill(34, 139, 34);
      pg.stroke(20, 90, 20);
      pg.strokeWeight(2);
      pg.beginShape();
      pg.vertex(0, -32);
      pg.bezierVertex(35, -10, 35, 25, 0, 35);
      pg.bezierVertex(-35, 25, -35, -10, 0, -32);
      pg.endShape(CLOSE);
    } else if (t === "shampoo") {
      pg.fill(186, 85, 211);
      pg.stroke(120, 50, 140);
      pg.strokeWeight(2);
      pg.rect(-20, -22, 40, 52, 10);
      pg.fill(220);
      pg.rect(-10, -35, 20, 14, 4);
    } else if (t === "mug") {
      pg.fill(220, 20, 60);
      pg.stroke(150, 10, 40);
      pg.strokeWeight(2);
      pg.rect(-25, -25, 50, 50, 8);
      pg.noFill();
      pg.stroke(220, 20, 60);
      pg.strokeWeight(5);
      pg.arc(25, 0, 22, 30, -HALF_PI, HALF_PI);
    }
    
    pg.pop();
    itemImages.push(pg);
  }
}

let bins = [
  { name: "一般垃圾", x: 140, y: 470, w: 110, h: 95, col: "#6c757d", icon: "🗑️" },
  { name: "廚餘", x: 310, y: 470, w: 110, h: 95, col: "#d90429", icon: "🍲" },
  { name: "塑膠容器", x: 480, y: 470, w: 110, h: 95, col: "#2b9348", icon: "♻️" },
  { name: "紙類", x: 650, y: 470, w: 110, h: 95, col: "#3a86ff", icon: "📰" }
];

let itemObj = {
  x: 400,
  y: 235,
  w: 170,
  h: 130,
  isDragging: false
};

let isCorrect = false;
let feedbackAlpha = 0;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  startGame();
  gameState = "START"; 
  windowResized();
}

function windowResized() {
  let s = min(windowWidth / 800, windowHeight / 600);
  resizeCanvas(800, 600);
  let canvasElem = document.querySelector('canvas');
  if (canvasElem) {
    canvasElem.style.width = (800 * s) + 'px';
    canvasElem.style.height = (600 * s) + 'px';
  }
}

function draw() {
  background(255, 200, 221);
  
  if (gameState === "START") {
    drawStartScreen();
  } else if (gameState === "QUIZ") {
    drawQuizScreen();
  } else if (gameState === "FEEDBACK") {
    drawFeedbackScreen();
  } else if (gameState === "END") {
    drawEndScreen();
  }
}

function drawStartScreen() {
  fill(255, 175, 204);
  noStroke();
  rect(150, 65, 500, 70, 20);
  
  fill(80);
  textSize(30);
  text("「桶」理心 - 垃圾分類小達人", width / 2, 100);
  
  fill(255, 240, 245);
  rect(220, 160, 360, 220, 15);
  
  drawMiniBin(300, 260, "#d90429", "🍲");
  drawMiniBin(400, 250, "#2b9348", "♻️");
  drawMiniBin(500, 260, "#3a86ff", "📰");
  
  fill(100);
  textSize(16);
  text("✨ 題目隨機不重複・共 20 題 100 分！ ✨", width / 2, 350);
  
  fill(255, 105, 180);
  rect(300, 420, 200, 60, 30);
  fill(255);
  textSize(24);
  text("START", width / 2, 450);
}

function drawMiniBin(bx, by, bCol, bIcon) {
  fill(bCol);
  rect(bx - 25, by, 50, 60, 8);
  fill(255);
  rect(bx - 30, by - 8, 60, 10, 4);
  textSize(20);
  text(bIcon, bx, by + 28);
}

function drawQuizScreen() {
  fill(255, 175, 204);
  rect(50, 20, 700, 45, 10);
  fill(80);
  textSize(18);
  text(`📊 題數: ${currentIdx + 1} / ${questions.length}`, 180, 42);
  text(`⭐ 目前得分: ${score}`, 620, 42);
  
  fill(255, 240, 245);
  rect(150, 85, 500, 310, 15);
  
  fill(50);
  textSize(20);
  text(`請將物品拖曳至下方正確的垃圾桶：`, width / 2, 115);
  
  if (itemObj.isDragging) {
    itemObj.x = constrain(mouseX, 50, width - 50);
    itemObj.y = constrain(mouseY, 50, height - 50);
  } else {
    itemObj.x = width / 2;
    itemObj.y = 220;
  }
  
  fill(255);
  stroke(255, 105, 180);
  strokeWeight(2);
  rect(itemObj.x - itemObj.w/2, itemObj.y - itemObj.h/2, itemObj.w, itemObj.h, 12);
  noStroke();
  
  let qObj = questions[currentIdx];
  if (itemImages[qObj.origIndex]) {
    imageMode(CENTER);
    image(itemImages[qObj.origIndex], itemObj.x, itemObj.y - 18, 120, 80);
    imageMode(CORNER);
  }
  
  fill(50);
  textSize(16);
  text(qObj.item, itemObj.x, itemObj.y + 42);
  
  for (let b of bins) {
    fill(b.col);
    rect(b.x - b.w/2, b.y, b.w, b.h, 12);
    fill(255, 255, 255, 200);
    rect(b.x - b.w/2 - 5, b.y - 10, b.w + 10, 12, 5);
    
    textSize(24);
    text(b.icon, b.x, b.y + 32);
    fill(255);
    textSize(15);
    text(b.name, b.x, b.y + 72);
  }
}

function drawFeedbackScreen() {
  drawQuizScreen();
  
  feedbackAlpha = constrain(feedbackAlpha + 15, 0, 220);
  fill(0, 0, 0, feedbackAlpha);
  rect(0, 0, width, height);
  
  fill(255);
  rect(150, 130, 500, 320, 20);
  
  let qObj = questions[currentIdx];
  if (isCorrect) {
    fill(46, 139, 87);
    textSize(34);
    text("✔ 答對了！太棒囉！", width / 2, 180);
  } else {
    fill(220, 20, 60);
    textSize(34);
    text("✖ 答錯囉～再接再厲！", width / 2, 180);
  }
  
  fill(80);
  textSize(18);
  text(`正確分類：【 ${qObj.category} 】`, width / 2, 250);
  textSize(15);
  text(qObj.desc, width / 2, 310);
  
  textSize(14);
  fill(150);
  text("（點擊任意處繼續下一題）", width / 2, 395);
}

function drawEndScreen() {
  fill(255, 175, 204);
  rect(200, 70, 400, 80, 15);
  fill(80);
  textSize(30);
  text("🎉 闖關結算 🎉", width / 2, 110);
  
  fill(255, 240, 245);
  rect(200, 170, 400, 200, 15);
  fill(80);
  textSize(24);
  text(`總得分：${score} / 100 分`, width / 2, 220);
  
  if (score >= 85) {
    text("🌟 太神啦！環保超級小達人！", width / 2, 275);
    
    if (frameCount % 10 === 0 && particles.length < 80) {
      particles.push({
        x: random(width),
        y: random(height / 2),
        vx: random(-2, 2),
        vy: random(2, 5),
        col: color(random(255), random(100, 200), random(200, 255)),
        size: random(6, 12)
      });
    }
    
    for (let p of particles) {
      fill(p.col);
      noStroke();
      ellipse(p.x, p.y, p.size);
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > height) p.y = 0;
    }
  } else {
    text("💪 還差一點點！再加油喔～", width / 2, 265);
    
    push();
    translate(width / 2, 315);
    fill(100, 180, 255);
    noStroke();
    let tearY = (frameCount % 30) * 1.5;
    ellipse(-25, tearY, 8, 12);
    ellipse(25, tearY, 8, 12);
    fill(80);
    textSize(28);
    text("😢", 0, -10);
    pop();
  }
  
  fill(255, 105, 180);
  noStroke();
  rect(230, 410, 150, 50, 25);
  fill(255);
  textSize(18);
  text("再玩一次", 305, 435);
  
  fill(100, 150, 255);
  rect(420, 410, 150, 50, 25);
  fill(255);
  text("回首頁", 495, 435);
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  initAudio();
  if (!audioCtx) return;
  
  let osc = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  let now = audioCtx.currentTime;
  
  if (type === "click") {
    osc.frequency.setValueAtTime(400, now);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === "correct") {
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === "wrong") {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(100, now + 0.15);
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

function mousePressed() {
  handlePress();
}

function touchStarted() {
  handlePress();
  return false;
}

function handlePress() {
  initAudio();
  playSound("click");
  
  if (gameState === "START") {
    if (mouseX > 300 && mouseX < 500 && mouseY > 420 && mouseY < 480) {
      startGame();
      gameState = "QUIZ";
    }
  } else if (gameState === "QUIZ") {
    let xMin = width/2 - itemObj.w/2;
    let xMax = width/2 + itemObj.w/2;
    let yMin = 220 - itemObj.h/2;
    let yMax = 220 + itemObj.h/2;
    
    if (mouseX > xMin && mouseX < xMax && mouseY > yMin && mouseY < yMax) {
      itemObj.isDragging = true;
    }
  } else if (gameState === "FEEDBACK") {
    currentIdx++;
    if (currentIdx >= questions.length) {
      gameState = "END";
    } else {
      gameState = "QUIZ";
    }
  } else if (gameState === "END") {
    if (mouseX > 230 && mouseX < 380 && mouseY > 410 && mouseY < 460) {
      startGame();
      gameState = "QUIZ";
    }
    if (mouseX > 420 && mouseX < 570 && mouseY > 410 && mouseY < 460) {
      gameState = "START";
    }
  }
}

function mouseReleased() {
  handleRelease();
}

function touchEnded() {
  handleRelease();
}

function handleRelease() {
  if (gameState === "QUIZ" && itemObj.isDragging) {
    itemObj.isDragging = false;
    
    let qObj = questions[currentIdx];
    for (let i = 0; i < bins.length; i++) {
      let b = bins[i];
      let bXmin = b.x - b.w/2;
      let bXmax = b.x + b.w/2;
      let bYmin = b.y - 10;
      let bYmax = b.y + b.h;
      
      if (mouseX > bXmin && mouseX < bXmax && mouseY > bYmin && mouseY < bYmax) {
        if (b.name === qObj.category) {
          isCorrect = true;
          score += 5;
          playSound("correct");
        } else {
          isCorrect = false;
          playSound("wrong");
        }
        feedbackAlpha = 0;
        gameState = "FEEDBACK";
        break;
      }
    }
  }
}

function startGame() {
  score = 0;
  currentIdx = 0;
  particles = [];
  
  let rawDataRef = [
    { item: "用過的紙餐盒", category: "紙類", desc: "紙餐盒雖然有防水膜，但在本專案中歸類為紙類回收！", type: "box" },
    { item: "吃剩的雞骨頭", category: "廚餘", desc: "雞骨頭屬於一般肉類廚餘（非硬骨），可投入廚餘桶。", type: "bone" },
    { item: "廢紙箱", category: "紙類", desc: "乾淨的紙箱請拆開壓平，投入紙類回收桶。", type: "carton" },
    { item: "塑膠寶特瓶", category: "塑膠容器", desc: "寶特瓶洗淨後壓扁，投入塑膠容器桶。", type: "bottle" },
    { item: "用過的衛生紙", category: "一般垃圾", desc: "用過的衛生紙髒汙無法回收，應丟一般垃圾。", type: "tissue" },
    { item: "果皮", category: "廚餘", desc: "天然果皮屬於堆肥廚餘。", type: "peel" },
    { item: "布丁塑膠盒", category: "塑膠容器", desc: "洗淨後的布丁杯、豆腐盒等塑膠容器屬於塑膠容器回收。", type: "pudding" },
    { item: "舊筆記本", category: "紙類", desc: "一般紙張與筆記本屬於紙類回收。", type: "book" },
    { item: "喝完的飲料紙盒", category: "紙類", desc: "牛奶盒、飲料紙盒請清洗乾淨後回收。", type: "drinkbox" },
    { item: "塑膠免洗杯", category: "塑膠容器", desc: "塑膠杯洗淨後投入塑膠容器回收桶。", type: "plasticcup" },
    { item: "蛋殼", category: "廚餘", desc: "碎蛋殼屬於廚餘類。", type: "egg" },
    { item: "吃完的便當塑膠袋", category: "一般垃圾", desc: "被油汙污染嚴重的塑膠袋無法回收，丟一般垃圾。", type: "bag" },
    { item: "舊報紙", category: "紙類", desc: "報紙、雜誌請整齊綑綁投入紙類回收。", type: "newspaper" },
    { item: "保麗龍盒", category: "一般垃圾", desc: "保麗龍材質較特殊，一般多歸類於一般垃圾或指定回收。", type: "styrofoam" },
    { item: "茶葉渣", category: "廚餘", desc: "泡完的茶葉渣、咖啡渣屬於廚餘。", type: "tea" },
    { item: "塑膠玩具", category: "一般垃圾", desc: "複合材質的塑膠玩具通常無法直接回收。", type: "toy" },
    { item: "廣告傳單", category: "紙類", desc: "各類宣傳單、DM 屬於紙類回收。", type: "flyer" },
    { item: "蔬菜葉", category: "廚餘", desc: "煮菜剩下的菜葉屬於堆肥廚餘。", type: "veggie" },
    { item: "洗髮精塑膠瓶", category: "塑膠容器", desc: "用完的洗髮精空瓶清洗乾淨後可塑膠容器回收。", type: "shampoo" },
    { item: "破掉的陶瓷馬克杯", category: "一般垃圾", desc: "陶瓷、玻璃碎片屬於一般垃圾（需包好以防割傷）。", type: "mug" }
  ];

  let tempArr = [];
  for (let i = 0; i < rawDataRef.length; i++) {
    tempArr.push(i);
  }
  
  for (let i = tempArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = tempArr[i];
    tempArr[i] = tempArr[j];
    tempArr[j] = temp;
  }
  
  questions = [];
  for (let idx of tempArr) {
    let itemData = rawDataRef[idx];
    itemData.origIndex = idx;
    questions.push(itemData);
  }
}