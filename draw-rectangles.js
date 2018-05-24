class ColorGenerator {
  constructor() {}

  static random() {
    var chars = '0123456789ABCDEF';
    var hex = '#';
    for (var i = 0; i < 6; i++) {
        hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
  }
}

class Rect {
  static get ROTATION_TIME() {
    return 2000;
  }

  constructor(draw, color) {
    this.draw = draw;

    this._isRotated = null;

    this.elt = document.createElement('div');
    this.elt.style.backgroundColor = color;
    this.elt.style.position = "absolute";
  }

  insert(originX, originY) {
    this.originX = originX;
    this.originY = originY
    this.elt.style.top = originY + "px";
    this.elt.style.left = originX + "px";

    this.draw.drawZoneElt.appendChild(this.elt);

    this.elt.addEventListener("dblclick", this.startRotation.bind(this));
  }

  drawing(posX, posY) {
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

  startRotation() {
    this._isRotated = true;
    this.elt.style.transform = "rotate(360deg)";
    this.elt.style.transition = Rect.ROTATION_TIME + "ms ease-in-out";

    this.draw.removeRect(this);
  }

  isRotating() {
    return this._isRotated;
  }

  stopRotation() {
      this._isRotated = false;
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
    let color = ColorGenerator.random();
    this.currentRect = new Rect(this, color);
    this.currentRect.insert(event.clientX, event.clientY);

    this.drawZoneElt.addEventListener("mousemove", this._bindDrawing);
    this.drawZoneElt.addEventListener("mouseup", this._bindStopDrawing);
  }

  drawing(event) {
    this.currentRect.drawing(event.clientX, event.clientY);
  }

  stopDrawing(event) {
    if (this.currentRect.isValid()) {
      this._rects.push(this.currentRect);
    };

    this.drawZoneElt.removeEventListener("mousemove", this._bindDrawing);
    this.drawZoneElt.removeEventListener("mouseup", this._bindStopDrawing);
  }

  removeRect(rect) {
    var self = this;
    let removeRectTimeout = setTimeout(function() {
        rect.stopRotation();
        let rotationOngoing = self._rects.find(r => r.isRotating());
        if (rotationOngoing) {
          clearTimeout(removeRectTimeout);
        } else {
          self._rects = self._rects.filter((r, i) => {
            if (r.isRotating() === false) {
              r.remove();
            } else {
              return r;
            }
          });

        }
    }, Rect.ROTATION_TIME);
  }
}


new Draw("#js-draw-zone");
