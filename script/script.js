
//Представление
var view = {
    displayMessage: function(mes){
        var messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = mes;
    },
    displayHit: function(loc){
        var cell = document.getElementById(loc);
        cell.setAttribute("class", "hit");
        
    },
    displayMiss: function(loc){
        var cell = document.getElementById(loc);
        cell.setAttribute("class", "miss");
    }
};

//ютубовская версия модели
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunk: 0,
    ships: [
        ship1 = { location: ['0', '0', '0'], hits: ['', '', '']},
        ship2 = { location: ['0', '0', '0'], hits: ['', '', '']},
        ship3 = { location: ['0', '0', '0'], hits: ['', '', '']}
    ],
    fire: function(guess){
        console.log("fire: guess " + guess);
        for(var i=0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            console.log('model: fire: i: ' + i);
            if(index >= 0){
                ship.hits[index] = 'hit';

                if(this.isSunk(ship)){
                    this.shipSunk++;

                    view.displayMessage('1 ship has sunk!');
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage(guess + ' - MISS');
        return false;
    },

    isSunk: function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !=='hit'){
                return false;
            }
        }
        return true;

    },

    //генерация кораблей
    generateShipLocation: function(){
        var location;
        for(var i = 0; i < this.numShips; i++){
            do{
                location = this.generateShip();
                console.log("generateShipLocation: location " + location);
                console.log("generateShipLocation: collision(location) " + this.collision(location));
            }while(this.collision(location));
            console.log("generateShipLocation: i " + i);
            this.ships[i].location = location;
        }
    },

    generateShip: function(){
        var direction = Math.floor(Math.random()*2);
        var row, col;
        if(direction === 1){
            //сгенерировать начальную позицию для горизонтального корабля
            row = Math.floor(Math.random()*this.boardSize);
            col = Math.floor(Math.random()* (this.boardSize - this.shipLength));
        }
        else{
            //сгенерировать начальную позицию для вертикального корабля
            col = Math.floor(Math.random()*this.boardSize);
            row = Math.floor(Math.random()* (this.boardSize - this.shipLength));
        }

        var newShipLoc = [];

        for(var i = 0; i < this.shipLength; i++){
            if(direction === 1){
                //добавть позицию для горизонтального корабля
                newShipLoc.push(row + "" + (col + i));
            }
            else{
                //добавть позицию для вертикального корабля
                newShipLoc.push((row + i) + "" + col);
            }
        }
        return newShipLoc;
    },
    collision: function(loc){
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < loc.length; j++) {
                if(ship.location.indexOf(loc[j]) >= 0){
                    return true;
                }   
            }
        }
        return false;
    }
};
//ютубовская версия контроллера
var controller = {
    guesses: 0,
    processGuess: function(guess){
        var loc = parseGuess(guess);
        if(loc){
            this.guesses++;
            var hit = model.fire(loc);
            if(hit && model.shipSunk == model.numShips){
                view.displayMessage('вы потопили все корабли за: ' + this.guesses + ' ходов');
            }
            else if(hit){
                view.displayHit(loc);
                view.displayMessage(guess + ' - попадание');
            }
            else{
                view.displayMiss(loc);
                view.displayMessage(guess + ' - промах');
            }
        }
    }
};

function parseGuess(guess){
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if(guess === null || guess.length !== 2){
        return null;
    }
    else{
        var row = alphabet.indexOf(guess.charAt(0));
        var col = guess.charAt(1);
        if(row < 0 || isNaN(col) || col < 0 || col > 6){    //проверка: лежит ли первое число в нужном диапазоне 
            return null;                                    //ИЛИ является ли второе значение числом ИЛИ лежит ли второе значение в нужном диапазоне
        }
        else{
            return row + col;
        }
    }
};


function init(){
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;


    //клавиатура:
    var guesInput = document.getElementById("guessInput");
    guesInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
}

function handleKeyPress(e){
    var fireButton = document.getElementById('fireButton');
    if(e.keyCode === 13){
        fireButton.click();
        return false
    }
}

function handleFireButton(){
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = '';
}

window.onload = init;

//мой вариант
//мой вариант модели
// 0 - промах
// 1 - попадание
// 2 - клетка уже занята
// 3 - корабль уже потоплен (при повторном попадании в потопленный корабль)
// 4 - корабль потоплен (при попадании во все сегменты корабля)
// 5 - все корабли потоплены

/* var model = {
    boardSize: 7,
    numShips: 3,
    shipSunk: 0,
    ships: [
        ship1 = { location: ['10', '20', '30'], hits: ['', '', ''], length: 3, hitsCount: 0},
        ship2 = { location: ['33', '43', '53'], hits: ['', '', ''], length: 3, hitsCount: 0},
        ship3 = { location: ['21', '22', '23'], hits: ['', '', ''], length: 3, hitsCount: 0}
    ],
    fire:function(loc){
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var locInd = ship.location.indexOf(loc);
            if(locInd >= 0){ //проверка наличия положения у коробля
                if(this.isSunk(i)){
                    console.log('этот корабль уже потоплен');
                    return 3;
                }
                if(ship.hits[locInd] == 'hit'){
                    console.log('сюда нельзя стрелять');
                    return 2;
                }
                console.log('попадание');
                ship.hits[locInd]='hit';
                ship.hitsCount++;
                if(this.isSunk(i)){
                    console.log('вы потопили корабль!');
                    this.shipSunk++;
                    if(this.isWin()){
                        console.log('вы попедили!');
                        return 5;
                    }
                    return 4;
                }
                return 1;
            }
        }
        console.log('промах');
        return 0;
    },
    isSunk: function(indexOfShip){
        if(this.ships[indexOfShip].hitsCount==this.ships.length){
            return true;
        }
        return false;
    },
    isWin: function(){
        if(this.numShips == this.shipSunk){
            return true;
        }
        return false;
    }
}; 

//мой вариант контроллера
var controller = {
    guesses: 0,
    gameState: function(guess){
        this.guesses++;
        var loc = parseGuess(guess);
        if(loc){
            var state = model.fire(loc);
            switch (state){
                case 0:
                    view.displayMiss(loc);
                    view.displayMessage(guess + ' - MISS');
                    break;
                case 1:
                    view.displayHit(loc);
                    view.displayMessage(guess + ' - HIT');
                    break;
                case 2:
                    view.displayMessage(guess + ' - you can\'t aim here');
                    break;
                case 3:
                    view.displayMessage(guess + ' - this ship has already sunk');
                    break;
                case 4:
                    view.displayHit(loc);
                    view.displayMessage(guess + ' - HIT<br>You just sunk a ship!');
                    break;
                case 5:
                    view.displayHit(loc);
                    view.displayMessage(guess + ' - HIT<br>You just sunk a ship!<br>All ships sunk!<br>You WIN!<br>Total guesses: ' + this.guesses);
                    document.getElementById('fireButton').setAttribute('disabled', 'true');
                    break;
            }
        }
        else{
            alert('Inappropriate coordinates. Please enter the coordinates as shown in the example');
        }
    }
};

function parseGuess(guess){
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if(guess === null || guess.length !== 2){
        return null;
    }
    else{
        var row = alphabet.indexOf(guess.charAt(0));
        var col = guess.charAt(1);
        if(row < 0 || isNaN(col) || col < 0 || col > 6){    //проверка: лежит ли первое число в нужном диапазоне 
            return null;                                    //ИЛИ является ли второе значение числом ИЛИ лежит ли второе значение в нужном диапазоне
        }
        else{
            return row + col;
        }
    }
}; */

/*
view.displayMessage('Pam-Pam');
view.displayHit('35');
view.displayMiss('32');
*/
/*
model.fire('10');
model.fire('20');
model.fire('30');

console.log('////////////////');
model.fire('33');
model.fire('43');
model.fire('53');
model.fire('21');
model.fire('22');
model.fire('23');

fireButton.onclick = function(){
    var guess = document.getElementById('guessInput').value;
    controller.gameState(guess);
};
*/

/* controller.gameState('B0');
controller.gameState('C0');
controller.gameState('D0');

controller.gameState('D3');
controller.gameState('E3');
controller.gameState('F3');

controller.gameState('C1');
controller.gameState('C2');
controller.gameState('C3'); */

