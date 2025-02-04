// GameOfLife.ts
import { GameBox } from "./gameBox";

export class GameOfLife {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public board: GameBox[][];

  public activeBlocks: Set<number> = new Set();

  public height: number;
  public width: number;
  public boxSize: number;

  public lastToggled: number | null = null;
  public firstToggledVal: boolean | null = null;
  public isDragging: boolean = false;

  private static readonly neighborDirections: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    boxSize: number
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.boxSize = boxSize;

    this.board = this.createGrid();
    this.resizeCanvas();
    this.drawBoard();

    // Bind event handlers
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    window.addEventListener("keydown", (event) => this.handleKey(event.key));
  }

  public handleKey(key: string) {
    // Apply the rules to the boxes if space was pressed
    if (key === " ") {
      this.nextGeneration();
    }
  }

  public handleMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.lastToggled = null;
    this.handleInteraction(event);
  }

  public handleMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.handleInteraction(event);
    }
  }

  public handleMouseUp() {
    this.isDragging = false;
    this.lastToggled = null;
    this.firstToggledVal = null;
  }

  public handleMouseLeave() {
    this.isDragging = false;
    this.lastToggled = null;
    this.firstToggledVal = null;
  }

  public handleInteraction(event: MouseEvent) {
    // Get coordinates of the click in relation of the canvas
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Calculate the clicked box
    const col = Math.floor(clickX / this.boxSize);
    const row = Math.floor(clickY / this.boxSize);
    const index = col + row * this.width;

    // Prevent toggling the same cell repeatedly during dragging
    if (this.lastToggled !== index) {
      // Save the value of the first box when dragging
      if (this.firstToggledVal === null) {
        this.firstToggledVal = this.board[col][row].state;
      }

      // Change the state and update it
      const newState = !this.firstToggledVal;
      this.board[col][row].state = newState;

      // Add or remove the block from the active blocks
      if (newState) {
        this.activeBlocks.add(index);
      } else {
        this.activeBlocks.delete(index);
      }

      this.drawCell(col, row);
      this.lastToggled = index;
    }
  }

  // Check neighbors using precomputed offsets
  public checkNeighbours(col: number, row: number): number {
    let count = 0;
    for (const [dx, dy] of GameOfLife.neighborDirections) {
      const nCol = col + dx;
      const nRow = row + dy;
      if (nCol >= 0 && nCol < this.width && nRow >= 0 && nRow < this.height) {
        if (this.board[nCol][nRow].state) count++;
      }
    }
    return count;
  }

  public nextGeneration() {
    // Use a Set to hold the indices of cells that need to be processed
    const cellsToProcess: Set<number> = new Set();

    // Add every live cell and its neighbors.
    for (const index of this.activeBlocks) {
      const col = index % this.width;
      const row = Math.floor(index / this.width);
      cellsToProcess.add(index);
      for (const [dx, dy] of GameOfLife.neighborDirections) {
        const nCol = col + dx;
        const nRow = row + dy;
        if (nCol >= 0 && nCol < this.width && nRow >= 0 && nRow < this.height) {
          cellsToProcess.add(nCol + nRow * this.width);
        }
      }
    }

    // Compute the new state for cells in cellsToProcess
    const updates = new Map<number, boolean>();
    const newActiveBlocks: Set<number> = new Set();

    cellsToProcess.forEach((index) => {
      const col = index % this.width;
      const row = Math.floor(index / this.width);
      const currentState = this.board[col][row].state;
      const liveNeighbors = this.checkNeighbours(col, row);
      let newState = currentState;

      if (currentState) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          newState = false;
        }
      } else {
        if (liveNeighbors === 3) {
          newState = true;
        }
      }
      updates.set(index, newState);
      if (newState) {
        newActiveBlocks.add(index);
      }
    });

    // Apply updates and redraw only cells that changed
    updates.forEach((newState, index) => {
      const col = index % this.width;
      const row = Math.floor(index / this.width);
      if (this.board[col][row].state !== newState) {
        this.board[col][row].state = newState;
        this.drawCell(col, row);
      }
    });

    // Replace active blocks with the newly computed set
    this.activeBlocks = newActiveBlocks;
    this.drawGridLines();
  }

  public resizeCanvas = () => {
    this.canvas.width = this.boxSize * this.width;
    this.canvas.height = this.boxSize * this.height;

    window.addEventListener("resize", () => {
      this.canvas.width = this.boxSize * this.width;
      this.canvas.height = this.boxSize * this.height;
      this.drawBoard();
    });
  };

  // Create the board as a 2D array of GameBox objects
  public createGrid(): GameBox[][] {
    const grid: GameBox[][] = new Array(this.width);
    for (let col = 0; col < this.width; col++) {
      grid[col] = new Array(this.height);
      for (let row = 0; row < this.height; row++) {
        grid[col][row] = new GameBox(
          col * this.boxSize,
          row * this.boxSize,
          this.boxSize,
          this.boxSize,
          false
        );
      }
    }
    return grid;
  }

  // Redraw the entire board
  public drawBoard = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        this.board[col][row].draw(this.ctx);
      }
    }
    this.drawGridLines();
  };

  // Redraw a single cell
  public drawCell(col: number, row: number) {
    const cell = this.board[col][row];
    this.ctx.clearRect(cell.x, cell.y, cell.width, cell.height);
    cell.draw(this.ctx);
  }

  // Draw grid lines (if desired)
  public drawGridLines() {
    // // Vertical lines.
    // for (let col = 1; col < this.width; col++) {
    //   const x = col * this.boxSize;
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(x, 0);
    //   this.ctx.lineTo(x, this.canvas.height);
    //   this.ctx.strokeStyle = "#1f1f1f";
    //   this.ctx.lineWidth = 0.3;
    //   this.ctx.stroke();
    // }
    // // Horizontal lines.
    // for (let row = 1; row < this.height; row++) {
    //   const y = row * this.boxSize;
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(0, y);
    //   this.ctx.lineTo(this.canvas.width, y);
    //   this.ctx.strokeStyle = "#1f1f1f";
    //   this.ctx.lineWidth = 0.3;
    //   this.ctx.stroke();
    // }
  }
}
