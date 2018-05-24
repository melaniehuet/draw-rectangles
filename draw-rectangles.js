(function() {
  class ColorGenerator {
    constructor() {}

    static random() {
      let chars = '0123456789ABCDEF', hex = '#';
      for (let i = 0; i < 6; i++) {
          hex += chars[Math.floor(Math.random() * 16)];
      }
      return hex;
    }
  }

  class Rect {
    static get ROTATION_TIME() {
      return 2000;
    }

    constructor(options) {
      options = options || {};
      this._color = options.color || ColorGenerator.random();
      this._parentElt = options.parentElement || document.querySelector("body");
      this._endRotationCallback = options.endRotationCallback || this.remove;
      this._isRotated = null;

      this.elt = document.createElement('div');
      this.elt.style.backgroundColor = this._color;
      this.elt.style.position = "absolute";
    }

    insert(originX, originY) {
      this.originX = originX;
      this.originY = originY
      this.elt.style.top = originY + "px";
      this.elt.style.left = originX + "px";

      this._parentElt.appendChild(this.elt);

      this.elt.addEventListener("dblclick", this.rotate.bind(this));
    }

    setSize(posX, posY) {
      this.elt.style.top = Math.min(posY, this.originY) + "px";
      this.elt.style.left = Math.min(posX, this.originX) + "px";
      this.elt.style.height = Math.abs(posY - this.originY) + "px";
      this.elt.style.width = Math.abs(posX - this.originX) + "px";
    }

    isValid() {
      if (parseInt(this.elt.style.height) && parseInt(this.elt.style.width))
        return true;

      this.elt.remove();
      return false;
    }

    rotate() {
      this._isRotated = true;
      this.elt.style.transform = "rotate(360deg)";
      this.elt.style.transition = Rect.ROTATION_TIME + "ms ease-in-out";

      let self = this;
      let rotationTimeout = setTimeout(function() {
        self._isRotated = false;
        self._endRotationCallback(rotationTimeout);
      }, Rect.ROTATION_TIME);
    }

    isRotating() {
      return this._isRotated;
    }

    remove() {
      this.elt.remove();
    }
  }

  class Draw {
    constructor(drawZoneSelector) {
      this.drawZoneElt = document.querySelector(drawZoneSelector);

      this._rects = [];

      this._bindStartDrawing = this.startDrawing.bind(this);
      this._bindDrawing = this.drawing.bind(this);
      this._bindStopDrawing = this.stopDrawing.bind(this);

      this.drawZoneElt.addEventListener("mousedown", this._bindStartDrawing);
    }

    startDrawing(event) {
      this.currentRect = new Rect({
        parentElement: this.drawZoneElt,
        endRotationCallback: this.removeRects.bind(this)
      });
      this.currentRect.insert(event.clientX, event.clientY);

      this.drawZoneElt.addEventListener("mousemove", this._bindDrawing);
      this.drawZoneElt.addEventListener("mouseup", this._bindStopDrawing);
    }

    drawing(event) {
      this.currentRect.setSize(event.clientX, event.clientY);
    }

    stopDrawing(event) {
      if (this.currentRect.isValid()) {
        this._rects.push(this.currentRect);
      };

      this.drawZoneElt.removeEventListener("mousemove", this._bindDrawing);
      this.drawZoneElt.removeEventListener("mouseup", this._bindStopDrawing);
    }

    removeRects(rotationTimeout) {
      let rotationOngoing = this._rects.find(rect => rect.isRotating());
      if (rotationOngoing) {
        clearTimeout(rotationTimeout);
      } else {
        this._rects = this._rects.filter((rect) => {
          if (rect.isRotating() === false) {
            rect.remove();
          } else {
            return rect;
          }
        });
      }
    }
  }

  new Draw("#js-draw-zone");
})();
