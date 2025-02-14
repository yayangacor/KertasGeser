let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse events
    document.addEventListener("mousemove", (e) => {
      this.handleMove(e.clientX, e.clientY);
    });

    paper.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.handleStart(e.clientX, e.clientY);
      }
      if (e.button === 2) {
        this.rotating = true;
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

    // Gesture events for rotation on touch screens
    paper.addEventListener("gesturestart", (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener("gestureend", () => {
      this.rotating = false;
    });
  }

  handleMove(x, y) {
    if (!this.rotating) {
      this.velX = x - this.prevMouseX;
      this.velY = y - this.prevMouseY;
    }

    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = ((180 * angle) / Math.PI + 360) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = x;
      this.prevMouseY = y;

      this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
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
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.paper = paper; // Assign the paper element to the instance
  p.init(paper);
});
