class Queue {
    constructor() {
        this.items = [];
    }

    // מוסיף פריט לסוף התור
    enqueue(element) {
        this.items.push(element);
    }

    // מסיר פריט מהתחלה של התור ומחזיר אותו
    dequeue() {
        if (this.isEmpty()) {
            return "תור ריק";
        }
        return this.items.shift(); // shift מסיר את הפריט הראשון במערך
    }

    // בודק אם התור ריק
    isEmpty() {
        return this.items.length === 0;
    }

    // מקבל את הפריט הראשון בתור מבלי להסיר אותו
    peek() {
        if (this.isEmpty()) {
            return "תור ריק";
        }
        return this.items[0];
    }

    peekPrev() {
        if (this.isEmpty()) {
            return "תור ריק";
        }
        return this.items[this.items.length - 1];
    }

    // מחזיר את מספר הפריטים בתור
    size() {
        return this.items.length;
    }
}


let tWidth;
let tHeight;

let squaresSize = 30;
let squaresSizeClass = "large";
let foodQuantity = 25;
let score = 0;
let speed = 200;

const table = document.querySelector('.table');

let snake = new Queue();
let direction = {x: 0, y: 0};

let food = [];

// נשמור בו את הלולאה כדי שנוכל לעצור אותה
let interval;

function initialTable(){
    let tableWidth = table.offsetWidth;
    let tableHeight = table.offsetHeight;

    console.log(`tableWidth: ${tableWidth}, tableHeight: ${tableHeight}`);

    for (let i = 0; i < tableHeight - 110; i += squaresSize) {
        let tr = document.createElement('tr');
        for (let j = 0; j < tableWidth; j += squaresSize) {
            let td = document.createElement('td');
            td.classList.add('cell');
            td.classList.add(squaresSizeClass);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tHeight = table.children.length;
    tWidth = table.children[0].children.length;
}

function initialSnake(){
    snake.items = [];
    direction = {x: 0, y: 0};
    snake.enqueue({x: Math.floor(tWidth / 2) + 1, y: Math.floor(tHeight / 2)});
}

function drawSnake(){
    let prev = document.querySelectorAll('.snake');
    if (prev.length > 0) {
        prev.forEach((el) => {
            el.classList = [];
            el.classList.add('cell');
            el.classList.add(squaresSizeClass);
        });
    }
    let snakeArr = snake.items;
    for (let i = 0; i < snakeArr.length; i++) {
        let curr = table.children[snakeArr[i].y].children[snakeArr[i].x];
        curr.classList = [];
        curr.classList.add('snake');
        curr.classList.add(squaresSizeClass);
    }

}

function generateFood(){
    for (let i = 0; i < foodQuantity; i++) {
        let newFood = {x: 0, y: 0};
        newFood.x = getRandomInt(0, tWidth - 1);
        newFood.y = getRandomInt(0, tHeight - 1);
        food.push(newFood);
    }
}
function drawFood(){
    for (let i = 0; i < food.length; i++) {
        let curr = table.children[food[i].y].children[food[i].x];
        curr.classList = [];
        curr.classList.add('food');
        curr.classList.add(squaresSizeClass);
    }
}


document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (direction.x !== 1) {
                direction = {x: -1, y: 0};
                move(-1, 0);
            }
            break;
        case 'ArrowUp':
            if (direction.y !== 1) {
                direction = {x: 0, y: -1};
                move(0, -1);
            }
            break;
        case 'ArrowRight':
            if (direction.x !== -1) {
                direction = {x: 1, y: 0};
                move(1, 0);
            }
            break;
        case 'ArrowDown':
            if (direction.y !== -1) {
                direction = {x: 0, y: 1};
                move(0, 1);
            }
            break;
    }
});


function move(x, y, eat = false) {
    let prev = snake.peekPrev();
    let next = {x: prev.x + x, y: prev.y + y};
    if (next.x < 0){next.x = tWidth - 1;}
    if (next.y < 0){next.y = tHeight - 1;}
    if (next.x >= tWidth){next.x = 0;}
    if (next.y >= tHeight){next.y = 0;}
    
    if (!validations(next)) {
        control();
        document.querySelector('.dead').style.display = 'block';
        return;
    }

    for (let i = 0; i < food.length; i++) {
        if (food[i].x === next.x && food[i].y === next.y) {
            food.splice(i, 1);
            eat = true;
            break;
        }
    }

    if (eat) {
        snake.enqueue({x: next.x, y: next.y});
        setScore();
    } else {
        snake.dequeue();
        snake.enqueue(next);
    } 
    drawSnake();
}

function validations(next){
    if (snake.items.length <= 1) return true;
    let collision = snake.items.find((el) => {
        if (el.x === next.x && el.y === next.y) {
            return true;
        }
        return false;
    });
    return !collision;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);  // מעגל את הערך המינימלי כלפי מעלה
    max = Math.floor(max); // מעגל את הערך המקסימלי כלפי מטה
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timer(){
    interval = setInterval(() => {
        move(direction.x, direction.y);
    }, speed);
}

function restart(){
    initialSnake();
    drawSnake();
}


let stateGame = true;
function control(){
    if (stateGame) {
        clearInterval(interval);
        stateGame = !stateGame;
        document.getElementById('control').innerHTML = '>';
    } else {
        timer();
        stateGame = !stateGame;
        document.getElementById('control').innerHTML = '=';
    }
}


document.getElementById('control').addEventListener('click', () => {
    control();
});

document.getElementById('restart').addEventListener('click', () => {
    restart();
});


document.getElementById('new-game').addEventListener('click', () => {
    location.reload();
});

document.getElementById('continue').addEventListener('click', () => {
    restartSnake();
    control();
    document.querySelector('.dead').style.display = 'none';
});

function setScore(){
    score = foodQuantity - food.length;
    document.getElementById('current-food').innerHTML = score;
    document.getElementById('all-food').innerHTML = foodQuantity;
    drawFood();
    if (score === foodQuantity){
        restart();
        document.querySelector('.win').style.display = 'block';
    }
}

function restartSnake(){
    let len = snake.items.length;
    snake.items = [];
    for (let i = 0; i < len; i++) {
        snake.enqueue({x: i, y: 0});
    }
    drawSnake();
    direction = {x: 1, y: 0};
}

initialTable();
initialSnake();
drawSnake();
generateFood();
drawFood();
setScore();
timer();
