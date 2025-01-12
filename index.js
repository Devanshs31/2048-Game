var container;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function(){
    gameStart();
}

function gameStart(){
    container = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            
            let tile = document.createElement("div"); //<div></div> 
            tile.id = r.toString() + `-` + c.toString(); //<div id="0-0"></div>
            let num = container[r][c];

            renderTile(tile, num);
            document.getElementById("container").append(tile);
        }
    }

    addTwo();
    addTwo();
}

function renderTile(tile, num){
    tile.innerText = "";
    tile.classList.value = "";//clear the class list!
    tile.classList.add("tile");
    if(num > 0){
        tile.innerText = num;
        if(num <= 4096){
            tile.classList.add("x"+num.toString());
        }
        else{
             tile.classList.add("x8192"); 
        }
    }
}

function movesAvailable() { // checks if there are any possible moves left
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (container[r][c] == 0) {
                return true; // There is an empty space
            }
            if (r < rows - 1 && container[r][c] == container[r + 1][c]) {
                return true; // There is a possible vertical merge
            }
            if (c < columns - 1 && container[r][c] == container[r][c + 1]) {
                return true; // There is a possible horizontal merge
            }
        }
    }
    return false; // No moves available`
}

//handling keyboard events:
document.addEventListener("keyup",(event) =>{

    let boardChanged = false;
    let previousState = JSON.stringify(container);

    if (event.code == "ArrowLeft" || event.code == "KeyA") {
        moveLeft();
        addTwo();
    }
    if (event.code == "ArrowRight" || event.code == "KeyD") {
        moveRight();
        addTwo();
    }
    if (event.code == "ArrowUp" || event.code == "KeyW") {
        moveUp();
        addTwo();
    }
    if (event.code == "ArrowDown" || event.code == "KeyS") {
        moveDown();
        addTwo();
    }

    let currentState = JSON.stringify(container);
    boardChanged = previousState !== currentState;

    if (!boardChanged && !movesAvailable()) {
        alert("Game Over! No moves possible.");
    }

    document.getElementById("score").innerText = score;
})

function clearZero(row){
    return row.filter(num => num != 0); // creates an array without any 0 in it
}


function move(row){
    //[0, 2, 2, 2]

    row = clearZero(row); //[2, 2, 2]
    
    //sliding:
    for(let i = 0; i < row.length-1; i++){
        if(row[i] == row[i+1]){ 
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[2, 2, 2] -> [4, 0, 2]

    row = clearZero(row) //[4, 2]

    //filling with zeros:
    while(row.length < columns){
        row.push(0);
    } //[4, 2, 0, 0]

    return row;
}

function moveLeft(){
    for(let r = 0; r < rows; r++){
        let row = container[r];
        row = move(row);
        container[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + `-` + c.toString());
            let num = container[r][c];
            renderTile(tile, num);
        }
    }
}

function moveRight(){
    for(let r = 0; r < rows; r++){
        let row = container[r];
        // [0, 2, 2, 2]
        row.reverse(); // [2, 2, 2, 0]
        
        row = move(row); // [4, 2, 0, 0]
        
        row.reverse(); // [0, 0, 2, 4]
        
        container[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + `-` + c.toString());
            let num = container[r][c];
            renderTile(tile, num);
        }
    }
}

function moveUp() {
    for (let c = 0; c < columns; c++) {
        let row = [container[0][c], container[1][c], container[2][c], container[3][c]];
        row = move(row);
        // container[0][c] = row[0];
        // container[1][c] = row[1];
        // container[2][c] = row[2];
        // container[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            container[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = container[r][c];
            renderTile(tile, num);
        }
    }
}

function moveDown() {
    for (let c = 0; c < columns; c++) {
        let row = [container[0][c], container[1][c], container[2][c], container[3][c]];

        row.reverse();

        row = move(row);

        row.reverse();

        // container[0][c] = row[0];
        // container[1][c] = row[1];
        // container[2][c] = row[2];
        // container[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            container[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = container[r][c];
            renderTile(tile, num);
        }
    }
}

function addTwo(){
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {

        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        
        if (container[r][c] == 0) {
            container[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile(){
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (container[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}