(function() {

  'use strict';

  var cellCoords = [],
      columns = 7,
      rows = 6,
      cell = null,
      turn = 1,
      counters = {'player1': 0, 'player2': 0};

  newGame();

  function newGame() {
    prepareBoard();

    $('#board .cell').click(function() {
      cell = new Cell($(this), turn)
      cell.dropToBoard();
    }).hover(function() {
      var y = $(this).attr('y');
      $('#board .cell[y='+y+']:not(".placed")').css({border: '1px solid black'})
    }).mouseout(function() {
      $('#board .cell:not(".placed")').css({border: '1px solid #DDD'});
    });

  }

  function prepareBoard() {
    for(var i=0; i<rows; i++) {
      cellCoords[i] = [];
      for(var j=0; j<columns; j++) {
        cellCoords[i].push(0);
        $('#board').append('<div x="'+i+'" y="'+j+'" class="cell"></div>');
      }
    }
  }

  function resetBoard() {
    $('#board').empty();
    $("#controls .turn").text('Player 1');
    cellCoords = []; turn = 1; counters = {'player1': 0, 'player2': 0};
    newGame();
  }

  $("#reset").click(resetBoard);

  function Cell($this, playerID) {

    this.x = $this.attr('x');
    this.y = $this.attr('y');
    this.id = playerID;

    this.color = this.id == 1 ? 'yellow' : 'red';
    this.name = this.id == 1 ? 'Player 1' : 'Player 2';
    this.availableCell = null;

    /**
     * Used to drop a cell into the board
     */
    this.dropToBoard = function() {

      // Check first if there's available cell to insert
      if(this.getAvailableCellIndex() > 0) {
        this.getAvailableCell().pinToBoard();
        this.setCellData().updateCounters();

        // Check total inputs from player before checking victory
        if(counters['player'+this.id] >= 4 && this.checkVictory()) {
          alert(this.name + ' wins!');
          // Reset board after 3 seconds
          setTimeout(function() {
            resetBoard();
          }, 1500);
        } else {
          if(this.checkDrawState()) { // Check draw state
            alert('DRAW!');
            resetBoard();
            return false;
          }
          this.setNextTurn();
          $this.trigger('mouseenter');
        }
      }
    };

    this.checkVictory = function() {
      if(this.verticalCheck()) return true;
      if(this.horizontalCheck()) return true;
      if(this.leftDiagonalCheck()) return true;
      if(this.rightDiagonalCheck()) return true;
      return false;
    };

    this.verticalCheck = function() {
      var currX = this.getX(), currY = this.getY();

      // Can't connect 4 if more than 2
      if(currX > 2) return false;

      // Start from current X -> down
      for(var i=currX; i <= (currX+3); i++) {
        if(cellCoords[i][currY] != this.id) {
          return false;
        }
      }
      return true;
    };

    this.horizontalCheck = function() {
      var currX = this.getX(), currY = this.getY(), cnt = 1;

      // Check player inputs from left
      for(var i=currY-1; i >=0; i--) {
        if(cellCoords[currX][i] != this.id) {
          break;
        }
        cnt++;
      }

      // Check player inputs to right
      for(var j=currY+1; j < columns; j++) {
        if(cellCoords[currX][j] != this.id) {
          break;
        }
        cnt++;
      }

      return cnt >= 4 ? true : false;
    };

    this.leftDiagonalCheck = function() {
      var currX = this.getX()-1, currY = this.getY()-1, cnt = 1;

      while (currX >= 0 && currY >= 0) {
        if(cellCoords[currX][currY] == this.id) {
          currX++; currY++; cnt++;
        } else {
          break;
        }
      }

      currX = this.getX()+1, currY = this.getY()+1;

      while (currX < rows && currY < columns) {
        if(cellCoords[currX][currY] == this.id) {
          currX++; currY++; cnt++;
        } else {
          break;
        }
      }

      return cnt >= 4 ? true : false;
    };

    this.rightDiagonalCheck = function() {
      var currX = this.getX()+1, currY = this.getY()-1, cnt = 1;

      while (currX < rows && currY >= 0) {
        if(cellCoords[currX][currY] == this.id) {
          currX++; currY--; cnt++;
        } else {
          break;
        }
      }

      currX = this.getX()-1, currY = this.getY()+1;

      while (currX >= 0 && currY < columns) {
        if(cellCoords[currX][currY] == this.id) {
          currX--; currY++; cnt++;
        } else {
          break;
        }
      }

      return cnt >= 4 ? true : false;

    };

    this.checkDrawState = function() {
      console.log(counters)
      return counters['player1'] == 21 && counters['player2'] == 21 ? true : false;
    }

    this.getNextPlayer = function() {
      return turn == 1 ? 'Player 1' : 'Player 2';
    }

    this.getAvailableCellIndex = function() {
      return $('#board .cell[y='+this.y+']:not(".placed")').length;
    };

    this.getAvailableCell = function() {
      this.availableCell = $('#board .cell[y='+this.y+'][x='+(this.getAvailableCellIndex()-1)+']:not(".placed")')
      return this;
    };

    this.updateCounters = function() {
      counters['player'+this.id]++;
    };

    this.getX = function() {
      return parseInt(this.availableCell.attr('x'));
    };

    this.getY = function() {
      return parseInt(this.availableCell.attr('y'));
    };

    this.pinToBoard = function() {
      this.availableCell.addClass('placed ' + this.color);
    };

    this.setCellData = function() {
      cellCoords[this.getX()][this.getY()] = this.id;
      return this;
    };

    this.setNextTurn = function() {
      if(this.id === 1) turn = 2; else turn = 1;
      $("#controls .turn").text(this.getNextPlayer());
    };

  };

}).call(this);
