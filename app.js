window.onload = function() {
    const canvas = document.getElementById('bord');
    const context = canvas.getContext('2d');

    let x = 9, y = 9;
    let direction;
    let xBerry = Math.floor(rand(0, 19)), yBerry = Math.floor(rand(0, 19));
    let snakeWigth = 20, snakeHeight = 20;
    let score = 0;
    let snakeTail = [
        [x, y]
    ];
    let newDirection;
    let gameOn = true;
    let tickDuration = -1;
    let currentIntervalId;

    window.addEventListener('keydown', handleKeyboard);

    function handleKeyboard(event) {
        newDirection = event.key;
    }

    function tick() {
        if (gameOn) {
            check();
            teleport();
            eatBerry();
            deadEnd();
            redraw();
            refreshInterval();
        }
    }

    refreshInterval();

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBerry(xBerry, yBerry);
        drawTail();
    }

    function drawBerry(x, y) {
        context.fillStyle = "#FF0000";
        context.beginPath();
        context.arc(x * 20 + 10, y * 20 + 10, 10, 0, 2 * Math.PI);
        context.fill();
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function drawTail(x, y) {
        context.fillStyle = '#000000';
        for (let i = 0; i < snakeTail.length; i++) {
            context.fillRect(snakeTail[i][0] * 20, snakeTail[i][1] * 20, snakeWigth, snakeHeight);
        }

        switch (direction) {
            case 'ArrowLeft': {
                snakeTail.unshift([snakeTail[0][0] - 1, snakeTail[0][1]]);
                break;
            }
            case 'ArrowRight': {
                snakeTail.unshift([snakeTail[0][0] + 1, snakeTail[0][1]]);
                break;
            }
            case 'ArrowUp': {
                snakeTail.unshift([snakeTail[0][0], snakeTail[0][1] - 1]);
                break;
            }
            case 'ArrowDown': {
                snakeTail.unshift([snakeTail[0][0], snakeTail[0][1] + 1]);
                break;
            }
        }
        if (direction) {
            snakeTail.pop();
        }
    }

    function addTail() {
        switch (direction) {
            case 'ArrowLeft': {
                snakeTail.unshift([snakeTail[0][0] - 1, snakeTail[0][1]]);
                break;
            }
            case 'ArrowRight': {
                snakeTail.unshift([snakeTail[0][0] + 1, snakeTail[0][1]]);
                break;
            }
            case 'ArrowUp': {
                snakeTail.unshift([snakeTail[0][0], snakeTail[0][1] - 1]);
                break;
            }
            case 'ArrowDown': {
                snakeTail.unshift([snakeTail[0][0], snakeTail[0][1] + 1]);
                break;
            }
        }
    }

    function eatBerry() {
        if (snakeTail[0][0] === xBerry && snakeTail[0][1] === yBerry) {
            do {
                generateBerry();
            } while(!checkBerryPosition());
            score += 10;
            addTail();
        }
    }

    function generateBerry() {
        xBerry = Math.floor(rand(0, 19));
        yBerry = Math.floor(rand(0, 19));
    }

    function checkBerryPosition() {
        for (let i = 0; i < snakeTail.length; i++) {
            if (xBerry === snakeTail[i][0] && yBerry === snakeTail[i][1]) {
                return false;
            }
        }
        return true;
    }

    function check() {
        if (direction !== newDirection) {
            if (direction === 'ArrowLeft' && newDirection === 'ArrowRight') {
                return true;
            }
            if (direction === 'ArrowRight' && newDirection === 'ArrowLeft') {
                return true;
            }
            if (direction === 'ArrowUp' && newDirection === 'ArrowDown') {
                return true;
            }
            if (direction === 'ArrowDown' && newDirection === 'ArrowUp') {
                return true;
            }
            direction = newDirection;
        }
    }

    function teleport() {
        for (let i = 0; i < snakeTail.length; i++) {
            if (snakeTail[i][0] > 19) {
                snakeTail[i][0] = 0;
            }
            if (snakeTail[i][0] < 0) {
                snakeTail[i][0] = 19;
            }
            if (snakeTail[i][1] > 19) {
                snakeTail[i][1] = 0;
            }
            if (snakeTail[i][1] < 0) {
                snakeTail[i][1] = 19;
            }
        }
    }

    function deadEnd() {
        for (let i = 1; i < snakeTail.length; i++) {
            if (snakeTail[0][0] === snakeTail[i][0] && snakeTail[0][1] === snakeTail[i][1]) {
                stopGame();
                refresh();
            }
        }
    }

    function startGame() {
        gameOn = true;
    }

    function stopGame() {
        gameOn = false;
    }

    function refresh() {
        direction = '';
        newDirection = '';
        score = 0;
        x = 9;
        y = 9;
        xBerry = Math.floor(rand(0, 19));
        yBerry = Math.floor(rand(0, 19));
        snakeTail = [
                [x, y]
        ];
        if (confirm("Dead end. Play again?")) {
                startGame();
        } else {
                //
        }
    }



    function stopTicking() {
        if (currentIntervalId) {
            clearInterval(currentIntervalId);
            currentIntervalId = null;
        }
    }

    function startTicking() {
        if (!currentIntervalId) {
            currentIntervalId = setInterval(tick, tickDuration);
        }
    }

    function refreshInterval() {
        const newTickDuration = generateTickDuration();
        
        if (tickDuration !== newTickDuration) {
            tickDuration = newTickDuration; 
            stopTicking(); 
            startTicking();
        }
    }

    function generateTickDuration() {
        return Math.max(
            10,
            100 - Math.floor((snakeTail.length - 1) / 5) * 10
        );
    }

}