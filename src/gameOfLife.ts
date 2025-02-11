// GameOfLife.ts
import { GameBox } from "./gameBox";

export class GameOfLife {
  public gameCanvas: HTMLCanvasElement;
  public gridCanvas: HTMLCanvasElement;
  public gameCtx: CanvasRenderingContext2D;
  public gridCtx: CanvasRenderingContext2D;

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
    gameCanvas: HTMLCanvasElement,
    gridCanvas: HTMLCanvasElement,
    width: number,
    height: number,
    boxSize: number
  ) {
    this.gameCanvas = gameCanvas;
    this.gridCanvas = gridCanvas;
    this.width = width;
    this.height = height;
    this.boxSize = boxSize;

    this.gameCtx = gameCanvas.getContext("2d")!;
    this.gridCtx = gridCanvas.getContext("2d")!;

    this.board = this.createGrid();
    this.resizeCanvas();
    this.drawBoard();
    this.drawGridLines();

    // Bind event handlers
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
    const rect = this.gameCanvas.getBoundingClientRect();
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
  }

  public resizeCanvas = () => {
    this.gameCanvas.width = this.boxSize * this.width;
    this.gameCanvas.height = this.boxSize * this.height;
    this.gridCanvas.width = this.boxSize * this.width;
    this.gridCanvas.height = this.boxSize * this.height;

    window.addEventListener("resize", () => {
      this.gameCanvas.width = this.boxSize * this.width;
      this.gameCanvas.height = this.boxSize * this.height;
      this.gridCanvas.width = this.boxSize * this.width;
      this.gridCanvas.height = this.boxSize * this.height;
      this.drawBoard();
      this.drawGridLines();
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
    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        this.board[col][row].draw(this.gameCtx);
      }
    }
  };

  // Redraw a single cell
  public drawCell(col: number, row: number) {
    const cell = this.board[col][row];
    this.gameCtx.clearRect(cell.x, cell.y, cell.width, cell.height);
    cell.draw(this.gameCtx);
  }

  // Draw grid lines
  public drawGridLines() {
    this.gridCtx.strokeStyle = "#303030";
    this.gridCtx.lineWidth = 0.3;

    // Draw vertical lines
    for (let col = 0; col <= this.width; col++) {
      const x = col * this.boxSize;
      this.gridCtx.beginPath();
      this.gridCtx.moveTo(x, 0);
      this.gridCtx.lineTo(x, this.gridCanvas.height);
      this.gridCtx.stroke();
    }

    // Draw horizontal lines
    for (let row = 0; row <= this.height; row++) {
      const y = row * this.boxSize;
      this.gridCtx.beginPath();
      this.gridCtx.moveTo(0, y);
      this.gridCtx.lineTo(this.gridCanvas.width, y);
      this.gridCtx.stroke();
    }
  }
}
