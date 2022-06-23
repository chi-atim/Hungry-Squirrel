var layer1 = document.getElementById("layer1");
var ctx1 = layer1.getContext("2d");
var layer2 = document.getElementById("layer2");
var ctx2 = layer2.getContext("2d");
var layer3 = document.getElementById("layer3");
var ctx3 = layer3.getContext("2d");
var canvasW = layer1.width;
var canvasH = layer1.height;

var background = new Image();
background.src = "autum_background.jpg";
var sqrl_damaged = new Image();
sqrl_damaged.src = "Squirrel_damaged.gif";
var main = new Image();
main.src = "autum_background_Main.jpg";
var bgMusic = new Audio();
bgMusic.src = "bgMusic.mp3";
var eatSound = new Audio();
eatSound.src = "eat.mp3";
var badSound = new Audio();
badSound.src = "bad.mp3";


var gameStart;
var game = false;
var life = 3;
var score = 0;
var level ="LOW";
var highScore = 0;
var squirrel;

function drawText(text, x, y){
	ctx1.font = "800 30px Courier New";
    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 8;
    ctx1.strokeText(text, x, y);
    ctx1.fillStyle = "yellow";
    ctx1.fillText(text, x, y);
}

function mainPage(){
	ctx1.clearRect (0, 0, canvasW, canvasH);
	ctx1.drawImage(main, 0, 0, canvasW, canvasH);
	ctx1.font = "Italic 1000 95px Courier New";
    ctx1.strokeStyle = "black";
    ctx1.lineWidth = 8;
    ctx1.strokeText("HUNGRY SQUIRREL", 80, 170);
    ctx1.fillStyle = "rgb(255,130,0)";
    ctx1.fillText("HUNGRY SQUIRREL", 80, 170);

	if (game==false){
		if (life==3){
			drawText("HIGH SCORE: "+ highScore, canvasW/2-110, canvasH/2);
			drawText("PRESS ENTER TO START", canvasW/2-160, canvasH/2+80);
		}
		else if(life < 1){
			if (score > highScore)
				highScore = score;
			drawText("YOUR SCORE: "+ score, canvasW/2-110, canvasH/2-40);
			drawText("HIGH SCORE: "+ highScore, canvasW/2-110, canvasH/2+30);
			drawText("PRESS ENTER TO RESTART", canvasW/2-185, canvasH/2+100);
			bgMusic.pause();
			bgMusic.currentTime = 0;
		}
	}
	//Press Enter to start the game
	document.onkeydown = function(e) {
		if (event.keyCode === 13)
    		startGame();
    }
}


/*--------------------------------------Start the game--------------------------------------------------*/
function startGame(){
	game = true;
	score = 0;
	life = 3;
	level = "EASY";
	objectList = [];
	sqrlPosX = canvasW/2;
	sqrlPosY = canvasH - sqrlH;
    backPage();
    addObject();
    squirrel = setInterval (drawSqrl, 220);
    gameStart = setInterval(gameLoop, 34);

    document.addEventListener("keydown", moveSqrl, false);
    document.onkeydown = null;

}

function gameLoop(){
	if (game == true){
		bgMusic.play();
	    ctx3.clearRect(0, 0, canvasW, canvasH);
	    drawFalligObject();
	    makeObjectFall();
	    updateScore();
	}
}

/*Background*///layer1
function backPage(){
	ctx1.clearRect (0, 0, canvasW, canvasH);
	ctx1.drawImage(background, 0,0, canvasW, canvasH)
	drawText("Score: " + score+" Lives: " + life+" Level: " + level, canvasW/2-150, 50)
}

function updateScore(){
	for(var i=0; i < objectList.length; i++){
		if (i == 0 || i%4==0){
			if ((sqrlPosY+20)<(objectList[i][2]+fallingObjectH)&&sqrlPosX<(objectList[i][1]+fallingObjectW)&&(sqrlPosX+sqrlW)>objectList[i][1]){
			score += 1;
			objectList[i][1] = posXrand();
        	objectList[i][2] = 0 - fallingObjectH;
        	objectList[i][5] = speedRand();
			eatSound.play();
			}
		}
		else if (i == 1 || i%4==1){
			if ((sqrlPosY+20)<(objectList[i][2]+fallingObjectH)&&sqrlPosX<(objectList[i][1]+fallingObjectW)&&(sqrlPosX+sqrlW)>objectList[i][1]){
			life -= 4;
			drawDamagedSqrl();
			badSound.play();
			}
		}
		else{
			if ((sqrlPosY+20)<(objectList[i][2]+fallingObjectH)&&sqrlPosX<(objectList[i][1]+fallingObjectW)&&(sqrlPosX+sqrlW)>objectList[i][1]){
				life -= 1;
				drawDamagedSqrl();
				objectList[i][1] = posXrand();
	      	  	objectList[i][2] = 0 - fallingObjectH;
    	  		objectList[i][5] = speedRand();
				badSound.play();
			}
		}
	}
    if (life<1){
    	ctx3.clearRect (0, 0, canvasW, canvasH);
    	clearInterval(gameStart);
    	clearInterval(squirrel);
    	game=false;
    	document.removeEventListener("keydown", moveSqrl, false);
    	mainPage();
    }else{
    	if (score == 5 && objectList.length < 8){
    		addObject();
    		level = "NORMAL";
    	}
    	if (score == 15 && objectList.length < 16){
    		addObject();
    		level = "HARD";
    	}
    	if (score == 30 && objectList.length < 24){
    		addObject();
    		level = "NIGHTMARE";
    	}
    	backPage();
    }  
}

/*Squirrel*///layer2
var sqrl;
var sqrlW=200/2;
var sqrlH=100;
var sqrlSpeed=sqrlW;
var sqrlPosX = canvasW/2;
var sqrlPosY = canvasH - sqrlH;
var maxRight = canvasW - (sqrlW);
var maxLeft = 0;
var cycle = 0;

function drawSqrl(){
	if (game ==true){
		sqrl = new Image();
		sqrl.src = "Squirrel.gif";
		ctx2.clearRect (0, 0, canvasW, canvasH);
		ctx2.drawImage(sqrl, cycle * sqrlW, 0, sqrlW, sqrlH, sqrlPosX, sqrlPosY, sqrlW, sqrlH);
		cycle = (cycle+1)%2;
	}
	else{
		drawDamagedSqrl();
	}

}
function drawDamagedSqrl(){
	ctx2.clearRect (0, 0, canvasW, canvasH);
	ctx2.drawImage(sqrl_damaged, sqrlPosX, sqrlPosY)
}

function moveSqrl(event){
    if (event.keyCode === 37){
        if (sqrlPosX>maxLeft)
			sqrlPosX -= sqrlSpeed;
    }else if (event.keyCode === 39){
        if (sqrlPosX<maxRight)
			sqrlPosX += sqrlSpeed;
    }
}

/*Falling objects*///layer3
var fallingObjectImg;
var objectList = [];
var fallingObjectW = 100;
var fallingObjectH = 100;
var fallingObjectPosX;
var fallingObjectPosY;
var fallingObjectSpeed;
var maxObject = 4;

function addObject(){
    for(var i=0; i < maxObject; i++){
        fallingObjectImg = new Image();
        fallingObjectImg.src ="object"+i+".png"
        fallingObjectPosX = posXrand();
    	fallingObjectPosY = 0 - fallingObjectH;
        fallingObjectSpeed = speedRand();
        objectList.push([fallingObjectImg, fallingObjectPosX, fallingObjectPosY, fallingObjectW, fallingObjectH, fallingObjectSpeed]);
    }
}

function drawFalligObject(){   
    for(var i = 0; i < objectList.length; i++){
        ctx3.drawImage(objectList[i][0], objectList[i][1], objectList[i][2]);
    }    
}
function makeObjectFall(){
    for(var i=0; i < objectList.length; i++){
        if(objectList[i][2] < canvasH+3){
            objectList[i][2] += objectList[i][5];
        }else{
            objectList[i][1] = posXrand();
            objectList[i][2] = 0 - fallingObjectH;
            objectList[i][5] = speedRand();
        }
    }
}
function speedRand(){
	return Math.floor(Math.random()*10)+3;
}
function posXrand(){
	return Math.floor(Math.random()*10)*100;
}