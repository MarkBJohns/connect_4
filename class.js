// const newGame=document.getElementById('start');
const gameBoard=document.getElementById('board')

class Player{
    constructor(id,color){
        this.id=id;
        this.color=color;
    }
}

class Game {
    constructor(p1, p2, width, height) {
      this.players=[p1, p2];
      this.width = width;
      this.height = height;
      this.currPlayer = p1; // active player: 1 or 2
      this.board = []; // array of rows, each row is array of cells  (board[y][x])
      this.makeBoard();
      this.makeHtmlBoard();
    }
  
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {
      for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
      }
    }
  
    /** makeHtmlBoard: make HTML table and row of column tops. */
    makeHtmlBoard() {
      const board = document.getElementById('board');
  
      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', this.handleClick.bind(this));
  
      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
  
      board.append(top);
  
      // make main part of board
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');
  
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
  
        board.append(row);
      }
    }
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        // piece.classList.add(`p${this.currPlayer}`);
        piece.style.backgroundColor=this.currPlayer.color;
        piece.style.top = -50 * (y + 2);
    
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }
    
    handleClick(evt) {
        const x = +evt.target.id;
    
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
    
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        if(this.checkForWin()) {
            gameBoard.innerHTML='';
            return alert(`Player ${this.currPlayer.id} won!`);
        }
    
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
    checkForWin() {
        function _win(cells) {
          return cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer
          );
        }
    
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
            if (_win.call(this, horiz) || _win.call(this, vert) || _win.call(this, diagDR) || _win.call(this, diagDL)) {
              return true;
            }
          }
        }
    }
}

// newGame.addEventListener('click',function(){
//   gameBoard.innerHTML='';
//   new Game(6,7);
// });

document.querySelector('form').addEventListener('submit',function(e){
  e.preventDefault();
  gameBoard.innerHTML='';

  const p1Color=document.getElementById('p1').value;
  const p2Color=document.getElementById('p2').value;

  const player1=new Player(1,p1Color);
  const player2=new Player(2,p2Color);

  new Game(player1,player2,6,7);
})