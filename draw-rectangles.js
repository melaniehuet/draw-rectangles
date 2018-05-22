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
  constructor(draw, color) {
    this.draw = draw;

    this.isRotated = null;
    this.rotationTime = 2000;

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

    this.elt.addEventListener("dblclick", this.rotate.bind(this));
  }

  drawing(posX, posY) {
    this.elt.style.top = Math.min(posY, this.originY) + "px";
    this.elt.style.left = Math.min(posX, this.originX) + "px";
    this.elt.style.height = Math.abs(posY - this.originY) + "px";
    this.elt.style.width = Math.abs(posX - this.originX) + "px";
  }

  validate() {
    if (!parseInt(this.elt.style.height) || !parseInt(this.elt.style.width)) {
      this.elt.remove();
    }
  }

  rotate() {
    this.isRotated = true;
    this.elt.style.transform = "rotate(360deg)";
    this.elt.style.transition = this.rotationTime + "ms ease-in-out";

    var self = this;
    self.delete = setTimeout(function() {
      self.isRotated = false;
      let isRotationOngoing = self.draw.getRectangles().find(r => r.isRotated);
      if (isRotationOngoing) {
        clearTimeout(self.delete);
      } else {
        self.draw.getRectangles().forEach(r => { if (r.isRotated === false) r.elt.remove(); });
      }
    }, this.rotationTime);
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
    this._rects.push(this.currentRect);
    this.currentRect.insert(event.clientX, event.clientY);

    this.drawZoneElt.addEventListener("mousemove", this._bindDrawing);
    this.drawZoneElt.addEventListener("mouseup", this._bindStopDrawing);
  }

  drawing(event) {
    this.currentRect.drawing(event.clientX, event.clientY);
  }

  stopDrawing(event) {
    this.currentRect.validate();

    this.drawZoneElt.removeEventListener("mousemove", this._bindDrawing);
    this.drawZoneElt.removeEventListener("mouseup", this._bindStopDrawing);
  }

  getRectangles() {
    return this._rects;
  }
}


new Draw("#js-draw-zone");
