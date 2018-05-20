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
  constructor(drawZoneElt, color) {
    this.drawZoneElt = drawZoneElt;
    this.elt = document.createElement('div');
    this.elt.style.backgroundColor = color;
    this.elt.style.position = "absolute";

    this.elt.addEventListener("dblclick", this.rotate.bind(this));
  }

  insert(originX, originY) {
    this.originX = originX;
    this.originY = originY
    this.elt.style.top = originY + "px";
    this.elt.style.left = originX + "px";

    this.drawZoneElt.appendChild(this.elt);
  }

  draw(posX, posY) {
    let height = Math.abs(posY - this.originY);
    let width = Math.abs(posX - this.originX);

    this.elt.style.height = height + "px";
    this.elt.style.width = width + "px";
  }

  rotate() {
    this.elt.style.transform = "rotate(360deg)";
    this.elt.style.transition = "1s ease-in-out";

    var self = this;
    setTimeout(function() {
      self.elt.remove();
    }, 1000);
  }
}

class Draw {
  constructor(drawZoneSelector) {
    this.drawZoneElt = document.querySelector(drawZoneSelector);

    this.bindStartDrawing = this.startDrawing.bind(this);
    this.bindDrawing = this.drawing.bind(this);
    this.bindStopDrawing = this.stopDrawing.bind(this);

    this.drawZoneElt.addEventListener("mousedown", this.bindStartDrawing);
  }

  startDrawing(event) {
    console.log("mousedown");
    let color = ColorGenerator.random();
    this.rect = new Rect(this.drawZoneElt, color);
    this.rect.insert(event.clientX, event.clientY);

    this.drawZoneElt.addEventListener("mousemove", this.bindDrawing);

    this.drawZoneElt.addEventListener("mouseup", this.bindStopDrawing);
  }

  drawing(event) {
    console.log("mousemove");
    this.rect.draw(event.clientX, event.clientY);
  }

  stopDrawing(event) {
    console.log("mouseup");
    this.drawZoneElt.removeEventListener("mousemove", this.bindDrawing);
    this.drawZoneElt.removeEventListener("mouseup", this.bindStopDrawing);
  }
}


new Draw("#js-draw-zone");
