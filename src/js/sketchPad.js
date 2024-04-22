import { draw } from "../js/draw.js";
export class Sketchpad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.undoBtn = document.createElement("button");
    this.undoBtn.textContent = "Clear";
    this.undoBtn.classList.add("clear-button");

    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
     
      background-color: white;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
      `;

    container.appendChild(this.canvas);
    container.appendChild(this.undoBtn);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.#addEventListeners();

    this.paths = [];
    this.isDrawing = false;
  }

  #addEventListeners() {
    this.canvas.onmousedown = (event) => {
      this.paths.push([this.#getMouse(event)]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = (event) => {
      if (this.isDrawing) {
        const lastPath = this.paths[this.paths.length - 1];
        //Add coordinates to the last path
        lastPath.push(this.#getMouse(event));
        this.#redraw();
      }
    };

    this.canvas.onmouseup = () => {
      this.isDrawing = false;
    };

    this.canvas.ontouchstart = (event) => {
      const loc = event.touches[0];
      this.canvas.onmousedown(loc);
    };
    this.canvas.ontouchmove = (event) => {
      const loc = event.touches[0];
      this.canvas.onmousemove(loc);
    };
    this.canvas.ontouchend = () => {
      this.canvas.onmouseup(loc);
    };

    this.undoBtn.onclick = () => {
      this.#undo();
    };
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
    if (this.paths.length > 0) {
      this.undoBtn.ariaDisabled = "false";
      this.undoBtn.disabled = false;
    } else {
      this.undoBtn.ariaDisabled = "true";
      this.undoBtn.disabled = true;
    }
  }

  #getMouse = (event) => {
    const rect = this.canvas.getBoundingClientRect();

    return [
      Math.round(event.clientX - rect.left),
      Math.round(event.clientY - rect.top),
    ];
  };

  #undo() {
    this.paths.pop();
    this.#redraw();
  }
}
