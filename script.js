let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15; // Rotasi awal acak
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    this.paper = paper;

    // Mouse events
    document.addEventListener("mousemove", (e) => {
      this.handleMove(e.clientX, e.clientY);
    });

    paper.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.handleStart(e.clientX, e.clientY);
      }
    });

    window.addEventListener("mouseup", () => {
      this.handleEnd();
    });

    // Touch events
    paper.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY);
    });

    paper.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      this.handleStart(touch.clientX, touch.clientY);
    });

    paper.addEventListener("touchend", () => {
      this.handleEnd();
    });
  }

  handleMove(x, y) {
    if (!this.holdingPaper) return;

    const deltaX = x - this.prevMouseX;
    const deltaY = y - this.prevMouseY;

    // Update velocity
    this.velX = deltaX * 0.8;
    this.velY = deltaY * 0.8;

    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;

    const dragDirection = Math.atan2(deltaY, deltaX); // Arah drag dalam radian
    let targetRotation = dragDirection * (180 / Math.PI); // Konversi ke derajat

    this.rotation = this.lerp(this.rotation, targetRotation, 0.1); // Smoothing factor

    this.rotation = Math.max(Math.min(this.rotation, 30), -30); // Batas rotasi antara -30 dan 30 derajat

    this.paper.style.transform = `
      translateX(${this.currentPaperX}px) 
      translateY(${this.currentPaperY}px) 
      rotateZ(${this.rotation}deg)
    `;

    this.prevMouseX = x;
    this.prevMouseY = y;
  }

  handleStart(x, y) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    this.paper.style.zIndex = highestZ;
    highestZ += 1;

    this.mouseTouchX = x;
    this.mouseTouchY = y;
    this.prevMouseX = x;
    this.prevMouseY = y;
  }

  handleEnd() {
    this.holdingPaper = false;

    this.applyMomentum();
  }

  applyMomentum() {
    const momentumFactor = 0.9;
    const minVelocity = 0.1;

    const apply = () => {
      if (
        Math.abs(this.velX) > minVelocity ||
        Math.abs(this.velY) > minVelocity
      ) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.velX *= momentumFactor;
        this.velY *= momentumFactor;

        this.paper.style.transform = `
          translateX(${this.currentPaperX}px) 
          translateY(${this.currentPaperY}px) 
          rotateZ(${this.rotation}deg)
        `;

        requestAnimationFrame(apply);
      }
    };

    requestAnimationFrame(apply);
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
