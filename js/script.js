//initializations of the elements
const canBackground=document.querySelector('#canvas-background');
const canSprite=document.querySelector('#canvas-sprite');
const canEnemy=document.querySelector('#canvas-enemy');
const canMenuSuccess=document.querySelector('#canvas-menu-success');
const txtScore=document.querySelector('#text-score');

//initialization of the score to zero
txtScore.innerHTML=' 0';
const btnMenu=document.querySelector('.button-menus');
const btnAcc=document.querySelectorAll('.accordion');
const btnQuit=document.querySelector('.quit');
const header=document.querySelector('header');
const btnrestart=document.querySelector('.restart');

////intialization of all context
const ctxBackground=canBackground.getContext('2d');
const ctxSprite=canSprite.getContext('2d');
const ctxEnemy=canEnemy.getContext('2d');
const ctxMenuSuccess=canMenuSuccess.getContext('2d');

//array variables for image and sound
let arrVariables=['imgBackground','highway','imgBackgroundMed','spriteChicken','spriteEgg','spriteEnemyOne','spriteCars','spriteEnemyTwo','spriteEnemyThree','spriteEnemyMedium','successImage','gameOverImage',
'eggCollectedSound','backSound','diedSound','successSound','eggSound'];

//object for the source of sounds and pictures
let objImage= {
    imgBackground:'./assets/background2.png',
    highway:'./assets/highway1.png',
    imgBackgroundMed:'./assets/background3.png',
    spriteChicken:'./assets/chick.png',
    spriteEgg:'./assets/egg.png',
    spriteEnemyOne:'./assets/enemyOne.png',
    spriteCars:'./assets/car1.png',
    spriteEnemyTwo:'./assets/enemyTwo.png',
    spriteEnemyThree:'./assets/snake.png',
    spriteEnemyMedium:'./assets/enemyMedium.png',
    successImage:'./assets/success.png',
    gameOverImage:'./assets/GameOver.png',
    eggCollectedSound:'./assets/hen.wav',
    backSound:'./assets/back2.mp3',
    diedSound:'./assets/babycry_02.wav',
    successSound:'./assets/success.wav',
    eggSound:'./assets/hen.wav'
}

//initialization of the variables
Object.keys( objImage ).forEach(( keys,index )=>{
    if (index>11) {
        arrVariables[index]=new Audio(objImage[keys]);
        arrVariables[index].preload='auto';
        arrVariables[index].load();
        if ( keys=='backSound' ) {
            arrVariables[index].volume=0.2;
        }
    } else {
        arrVariables[index]=new Image();
        arrVariables[index].src=objImage[keys];
    }
});

//object with array property for the menus and scores
let objMenus= {
    arrMenus:['Easy','Medium','Hard'],
    arrCollectedEgg:[]
}

//sets all the width and height of the canvas
canBackground.width=900;
canBackground.height=500;
canSprite.width=canBackground.width;
canSprite.height=canBackground.height;
canEnemy.width=canBackground.width;
canEnemy.height=canBackground.height;
canMenuSuccess.width=canBackground.width;
canMenuSuccess.height=canBackground.height;

//higway initialization
let highwayY=200,
    //character initialization
    charSpriteX=(canBackground.width/2)-40,
    charSpriteY=(canBackground.height-155),
    charFrameX,
    charFrameY=0,
    charCurrentFrame=0,
    charFrameLeft=0,
    charFrameRight=13,
    charFrameDown=0,
    charFrameUp=8,
    charWidth=(578/17),
    charHeight=50,//=34x50
    //enemy initialization
    enemyX=(canBackground.width-90),
    enemyY=160,
    enemyWidth=272/8,
    enemyCurrentFrame=0,
    enemyXFrame,
    enemyFrameLeft=4,
    enemyFrameRight=4,
    //car initializiation
    enemyXCar=canBackground.width,
    enemyYCar=(highwayY+65),
    enemyYCarRev=highwayY+15,
    enemyWidthCar=720/6,
    enemyXCarRev=-600,
    carFrameReverse=4,
    //enemy initialization
    enemyXTwo=(canBackground.width-120),
    enemyYTwo=400,
    enemyWidthTwo=272/8,
    enemyCurrentFrameTwo=4,
    enemyXFrameTwo,
    //enemy three initialization
    enemyXThree=(canBackground.width-350),
    enemyYThree=60,
    enemyWidthThree=204/6,
    enemyCurrentFrameThree=0,
    enemyXFrameThree,
    enemyHeightThree=31,
    //enemy medium
    enemyXMedium=(canBackground.width-50),
    enemyYMedium=100,
    enemyWidthMedium=272/8,
    enemyCurrentFrameMedium=4,
    enemyXFrameMedium,
    //score initialization
    score=0;
    
let bolGameOver=false,
    bolEnemyOne=false,
    bolEnemyTwo=false,
    bolEnemyThree=false,
    bolPlay=false,
    bolLevel=false,
    bolWin=false,
    bolStart=false,
    bolEnemyMedium=false;

//get the url parameter
const searchURL=window.location.search;
const urlName=new URLSearchParams(searchURL);

//append the accordions
function setAccordion() {
    for ( let i=0; i<btnAcc.length; i++ ) {
        btnAcc[i].addEventListener('click',()=> {
            btnAcc[i].classList.toggle('active');
            let panel=btnAcc[i].nextElementSibling;
            if ( panel.style.display=='block' ) {
                panel.style.display='none';
            } else {
                panel.style.display='block';
            }
            
            if ( panel.style.maxHeight ) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight+100 + "px";
            }
        });
        if ( i==0 ) {
            btnAcc[0].classList.toggle('active');
            let panel=btnAcc[0].nextElementSibling;
            panel.style.display='block';
            panel.style.maxHeight = panel.scrollHeight+100 + "px";
        }
    }
}

//event for the window load
window.addEventListener('load',()=> {
    if ( urlName.get('chick')=='easy' ) {
        menus.style.display='none';
        playEggCollector();
        bolLevel=false;
        bolStart=true;
    } else if ( urlName.get('chick')=='medium' ) {
        menus.style.display='none';
        playEggCollectorMedium();
        bolLevel=true;
        bolStart=true;
    }
    else {
        eggCollectorMenus();
    }
});

//click event for the restart menu for easy and medium
btnrestart.addEventListener('click',()=> {
    ( !bolLevel ) ? window.open('index.html?chick=easy','_self') : window.open('index.html?chick=medium','_self');
})

//click event for the back to menu and quit menu
btnQuit.addEventListener('click',()=> {
    window.open('index.html','_self');
});

//click event for the menu button easy, medium and hard
function eggCollectorMenus() {
    setAccordion();
    for ( let btnMen of objMenus.arrMenus ) {
        const newBtn = document.createElement('button');
        newBtn.textContent = btnMen;
        btnMenu.appendChild( newBtn );
        newBtn.addEventListener('click', function() {
            if ( btnMen=='Easy' ) {
                bolStart=true;
                menus.style.display='none';
                playEggCollector();
                bolGameOver=false;
                bolLevel=false;
            } else if ( btnMen=='Hard' ) {
                alert('Eror 404!, Level not Found.');
            } else {
                bolStart=true;
                menus.style.display='none';
                playEggCollectorMedium();
                bolLevel=true;
            }
        });
    }
}

//keydown event for the controls of the character
document.addEventListener('keydown',(event)=> {
    if (!bolPlay && bolStart) {
        if ( event.key=='ArrowUp' ) {
            drawCharacterChicken(event.key);
        } else if ( event.key=='ArrowDown' ) {
            drawCharacterChicken(event.key);
        } else if ( event.key=='ArrowLeft' ) {
            drawCharacterChicken(event.key);
        } else if ( event.key=='ArrowRight' ) {
            drawCharacterChicken(event.key);
        }
    }
});

//easy level function
function playEggCollector(){
    background();
    drawCharacterChicken('load');
    setInterval(()=> {
        enemypdate( arrVariables[5] );
    }, 90);
    setInterval(()=> {
        updateCars();
        updateCarsReverse();
    }, 3);
    setInterval(()=> { 
        updateEnemyTwo();
    }, 300);
    setInterval(() => {
        updateSnake();
    }, 200);
    drawEgg();
    arrVariables[13].play();
    header.style.display='grid';
}

//medium level function
function playEggCollectorMedium() {
    drawCharacterChicken('load');
    backgroundMedium();
    drawEggMedium();
    header.style.display='grid';
    setInterval(()=>{ 
        updateEnemyMedium();
    }, 400);
    arrVariables[13].play();
}

//draw the chicken character and calls egg easy and egg medium sprite
function drawCharacterChicken(key) {
    if( !bolGameOver ) {

        if ( key=='load' ) {
            ctxSprite.drawImage( arrVariables[3],0,0,charWidth,charHeight,charSpriteX,charSpriteY,charWidth,charHeight )
        } else {
            if ( !bolLevel ) {
                drawEgg();
                updateChickenFrame(key);
            } else {
                drawEggMedium();
                updateChickenFrameMedium(key);
            }
            ctxSprite.drawImage( arrVariables[3],charFrameX,charFrameY,charWidth,charHeight,charSpriteX,charSpriteY,charWidth,charHeight )
        }
    }

}

//easy chicken animation
function updateChickenFrame(key) {
    ctxSprite.clearRect( charSpriteX,charSpriteY,charWidth,charHeight );

    if ( key=='ArrowDown' && charSpriteY<(canBackground.height-50) ) {
        charSpriteY+=5;
        charFrameDown=++charFrameDown%4;
        charFrameX=charFrameDown*charWidth;
    } else if ( key=='ArrowUp' && charSpriteY>1 ) {
        charSpriteY-=5;
        (charFrameUp>=11)?charFrameUp=8:charFrameUp++;
        charFrameX=charFrameUp*charWidth;
    }
    else if ( key=='ArrowLeft' && charSpriteX>=40 ) {
        charSpriteX-=5;
        (charFrameLeft>=7)?charFrameLeft=4:charFrameLeft++;
        charFrameX=charFrameLeft*charWidth;
    } else if ( key=='ArrowRight' && charSpriteX<=(canBackground.width-90) ) {
        charSpriteX+=5;
        (charFrameRight>=16)?charFrameRight=13:charFrameRight++;
        charFrameX=charFrameRight*charWidth;
    }
    charFrameY=0*charHeight;
}

//medium chicken animation
function updateChickenFrameMedium(key) {
    ctxSprite.clearRect( charSpriteX, charSpriteY, charWidth, charHeight );

    if ( key=='ArrowDown' && charSpriteY<(canBackground.height-100) ) {
        charSpriteY+=5;
        charFrameDown=++charFrameDown%4;
        charFrameX=charFrameDown*charWidth;
    } else if (key=='ArrowUp' && charSpriteY>100) {
        charSpriteY-=5;
        ( charFrameUp>=11 )?charFrameUp=8:charFrameUp++;
        charFrameX=charFrameUp*charWidth;
    }
    else if (key=='ArrowLeft' && charSpriteX>=5) {
        charSpriteX-=5;
        ( charFrameLeft>=7 )?charFrameLeft=4:charFrameLeft++;
        charFrameX=charFrameLeft*charWidth;
    } else if (key=='ArrowRight' && charSpriteX<=(canBackground.width-50)) {
        charSpriteX+=5;
        ( charFrameRight>=16 )?charFrameRight=13:charFrameRight++;
        charFrameX=charFrameRight*charWidth;
    }
    charFrameY=0*charHeight;
}

//easy enemy one sprites animation
function enemypdate(enemySprite) {
    ctxEnemy.clearRect( enemyX,enemyY,enemyWidth,charHeight );
    //collision detection
    if ( ((charWidth+charSpriteX)>=enemyX && charSpriteX<=enemyX+enemyWidth) && 
    ((charSpriteY+charHeight)-10>=enemyY && charSpriteY<=(enemyY+charHeight)-10) ) {
        bolGameOver=true;
        drawChickenDied();
    }
    if ( bolEnemyOne ) {
        enemyX+=15;
        enemyCurrentFrame=++enemyCurrentFrame%4;
        enemyXFrame=enemyCurrentFrame*enemyWidth;
        if ( enemyX>=(canBackground.width-250) ) {
            bolEnemyOne=false;
        }
    } else {
        enemyX-=15;
        enemyXFrame=enemyFrameLeft*enemyWidth;
        enemyFrameLeft++;
        if ( enemyFrameLeft>=8 ) {
            enemyFrameLeft=4;
        }
        if ( enemyX<=240 ) {
            bolEnemyOne=true;
        }
    }
    ctxEnemy.drawImage( enemySprite,enemyXFrame,0,enemyWidth,charHeight,enemyX,enemyY,enemyWidth,charHeight );
}

//easy cars moving left animations
function updateCars() {
    if ( enemyXCar+(arrVariables[6].width+250)<0 )
        {
            enemyXCar=canBackground.width;
        }
        let carRev=0,carRev1=0;

        for ( let y=0; y<3; y++ ) {
            ctxEnemy.clearRect(enemyXCar+carRev1,enemyYCar,enemyWidthCar,charHeight);
            carRev1+=250;
        }
        enemyXCar--;
        for ( let y=0; y<3; y++ ) {
            ctxEnemy.drawImage( arrVariables[6],y*120,0,enemyWidthCar,charHeight,enemyXCar+carRev,enemyYCar,enemyWidthCar,charHeight );
            //collision detection
            if ( ((charWidth+charSpriteX)>=enemyXCar+carRev && charSpriteX<=enemyXCar+enemyWidthCar+carRev) && 
            ((charSpriteY+charHeight)-10>=enemyYCar && charSpriteY<=(enemyYCar+charHeight)-10) ) {
                bolGameOver=true;
                drawChickenDied();
            }
            carRev+=250;
        }
}

//easy cars moving right animations
function updateCarsReverse() {
    if ( enemyXCarRev>(arrVariables[6].width+250) )
        {
            enemyXCarRev=-600;
        }
        let carRev=0,carRev1=0;

        for ( let y=3; y<6; y++ ) {
            ctxEnemy.clearRect( enemyXCarRev+carRev1,enemyYCarRev,enemyWidthCar,charHeight );
            carRev1+=250;
        }
        enemyXCarRev++;
        for ( let y=3; y<6; y++ ) {
            ctxEnemy.drawImage( arrVariables[6],y*120,0,enemyWidthCar,charHeight,enemyXCarRev+carRev,enemyYCarRev,enemyWidthCar,charHeight );
            //collision detection
            if ( ((charWidth+charSpriteX)>=enemyXCarRev+carRev && charSpriteX<=enemyXCarRev+enemyWidthCar+carRev) && 
            ((charSpriteY+charHeight)-10>=enemyYCarRev && charSpriteY<=(enemyYCarRev+charHeight)-10) ) {
                bolGameOver=true;
                drawChickenDied();
            }
            carRev+=250;
        }
        
}

//calls when the character chicken is caught by the enemy
function drawChickenDied() {
    if ( bolGameOver && !bolWin ) {
        ctxSprite.clearRect( charSpriteX,charSpriteY,charWidth,charHeight );
        ctxSprite.drawImage( arrVariables[3],12*34,0,charWidth,charHeight,charSpriteX,charSpriteY,charWidth,charHeight );
    
        arrVariables[13].loop=false;
        arrVariables[13].pause();
        arrVariables[14].loop=false;
        arrVariables[14].play();
        let inter=setInterval(()=>{
            if ( arrVariables[14].currentTime>=4||bolGameOver ) {
                bolPlay=true;
                ctxMenuSuccess.drawImage( arrVariables[11],0,0,canBackground.width,canBackground.height );
            }
        }, 5000)
    }   
}

//draw the easy background image
function background() {
    ctxBackground.drawImage( arrVariables[0],0,0,canBackground.width,canBackground.height );
    ctxBackground.drawImage( arrVariables[1],0,0,arrVariables[1].width,(arrVariables[1].height),0,highwayY,arrVariables[1].width,(arrVariables[1].height) );
}

//draw the medium background image
function backgroundMedium() {
    ctxBackground.drawImage( arrVariables[2],0,0,canBackground.width,canBackground.height );
}

//easy enemy two animations
function updateEnemyTwo() {
    if ( ((charWidth+charSpriteX)>=enemyXTwo && charSpriteX<=enemyXTwo+enemyWidthTwo) && 
        ((charSpriteY+charHeight)-10>=enemyYTwo && charSpriteY<=(enemyYTwo+charHeight)-10) ) {
            bolGameOver=true;
            drawChickenDied();
        }
        ctxEnemy.clearRect(enemyXTwo,enemyYTwo,enemyWidthTwo,charHeight);
        if ( !bolEnemyTwo )
        {
            enemyXTwo-=25;
            if ( enemyCurrentFrameTwo>=8 ) {
                enemyCurrentFrameTwo=4;
            }
            if ( enemyXTwo<=240 ) {
                bolEnemyTwo=true;
                enemyCurrentFrameTwo=0;
            }
        } else {
            enemyXTwo+=25;
            if ( enemyCurrentFrameTwo>=4 ) {
                enemyCurrentFrameTwo=0;
            }
            if ( enemyXTwo+enemyWidthTwo>=(canBackground.width-250) ) {
                bolEnemyTwo=false;
                enemyCurrentFrameTwo=4;
            }
        }
        ctxEnemy.drawImage( arrVariables[7],enemyCurrentFrameTwo*34,0,enemyWidthTwo,charHeight,enemyXTwo,enemyYTwo,enemyWidthTwo,charHeight );
        enemyCurrentFrameTwo++;
}

//easy enemy three aniamtions
function updateSnake() {
    //collision detection
    if ( ((charWidth+charSpriteX)>=enemyXThree && charSpriteX<=enemyXThree+enemyWidthThree) && 
    ((charSpriteY+charHeight)-10>=enemyYThree && charSpriteY<=(enemyYThree+enemyHeightThree)-10) ) {
        bolGameOver=true;
        drawChickenDied();
    }
    ctxEnemy.clearRect(enemyXThree,enemyYThree,enemyWidthThree,enemyHeightThree);
    if ( !bolEnemyThree )
    {
        enemyXThree-=15;
        if ( enemyCurrentFrameThree>=3 ) {
            enemyCurrentFrameThree=0;
        }
        if ( enemyXThree<=380 ) {
            bolEnemyThree=true;
            enemyCurrentFrameThree=4;
        }
    }else{
        enemyXThree+=15;
        if ( enemyCurrentFrameThree>=6 ) {
            enemyCurrentFrameThree=4;
        }
        if ( enemyXThree+enemyWidthThree>=(canBackground.width-350) ) {
            bolEnemyThree=false;
            enemyCurrentFrameThree=0;
        }
    }
    ctxEnemy.drawImage( arrVariables[8],enemyCurrentFrameThree*enemyWidthThree,0,enemyWidthThree,enemyHeightThree,enemyXThree,enemyYThree,enemyWidthThree,enemyHeightThree );
    enemyCurrentFrameThree++;
}

//call when the level is Completed
function success() {
    bolWin=true;
    arrVariables[13].loop=false;
    arrVariables[13].pause();
    bolPlay=true;
    arrVariables[15].loop=false;
    arrVariables[15].play();
    ctxMenuSuccess.drawImage( arrVariables[10],0,0,canBackground.width,canBackground.height );
}

//draw the eggs for easy level
function drawEgg() {
    let eggs=objMenus.arrCollectedEgg.filter( ( v,i,a )=> a.indexOf(v)===i ),
        boegg=false;
    txtScore.innerHTML=(eggs.length);
    //success
    if ( eggs.length>=32 ) {
        success();
    }else{
        let eggDownX=200,
            eggY=0,
            eggFinal=canBackground.width/2-20,
            eggHeight=28,
            eggwidth=16,
            bolDown=false;
            eggY=enemyY+20;
    
        for( let y=0; y<15; y++ ){
            //collision detection of the eggs
            if ( ((charWidth+charSpriteX)>=eggDownX && (charSpriteX)<=eggDownX+eggwidth)&& 
            ((charSpriteY+charHeight)-5>=eggY && charSpriteY<=((eggY)+eggHeight-2)) ) {
                for ( let e of objMenus.arrCollectedEgg ) {
                    if ( e==y ) {
                        boegg=true
                        break;
                    }
                }
                if ( !boegg ) {
                    arrVariables[16].play();
                    objMenus.arrCollectedEgg.push(y);
                }
            }
            boegg=false;
            for ( let e of objMenus.arrCollectedEgg ) {
                if ( e==y ) {
                    bolDown=true
                    break;
                }
            }
            ctxSprite.clearRect( eggDownX,eggY,eggwidth,eggHeight );
            if ( !bolDown ) {
                ctxSprite.drawImage( arrVariables[4],0,0,eggwidth,eggHeight,eggDownX,eggY,eggwidth,eggHeight );
            }
            eggDownX+=35;
            bolDown=false;
        }
        eggY=enemyYTwo+20;
        eggDownX=200;
        for ( let y=16; y<30; y++ ) {
            if ( ((charWidth+charSpriteX)>=eggDownX && (charSpriteX)<=eggDownX+eggwidth)&& 
            ((charSpriteY+charHeight)-5>=eggY && charSpriteY<=((eggY)+eggHeight-2)) ) {
                for ( let e of objMenus.arrCollectedEgg ) {
                    if( e==y ){
                        boegg=true
                        break;
                    }
                }
                if ( !boegg ) {
                    arrVariables[16].play();
                    objMenus.arrCollectedEgg.push(y);
                }
            }
            boegg=false;
            for ( let e of objMenus.arrCollectedEgg ) {
                if( e==y ){
                    bolDown=true
                    break;
                }
            }
            ctxSprite.clearRect( eggDownX,eggY,eggwidth,eggHeight );
            if ( !bolDown ) {
                ctxSprite.drawImage( arrVariables[4],0,0,eggwidth,eggHeight,eggDownX,eggY,eggwidth,eggHeight );
            }
            eggDownX+=35;
            bolDown=false;
        }
        eggY=enemyYThree;
        eggDownX=eggFinal;
        for ( let y=30; y<33; y++ ) {
            if ( ((charWidth+charSpriteX)>=eggDownX && (charSpriteX)<=eggDownX+eggwidth)&& 
            ((charSpriteY+charHeight)-5>=eggY && charSpriteY<=((eggY)+eggHeight-2)) ){
                for ( let e of objMenus.arrCollectedEgg ) {
                    if ( e==y ) {
                        boegg=true
                        break;
                    }
                }
                if ( !boegg ) {
                    arrVariables[16].play();
                    objMenus.arrCollectedEgg.push(y);
                }
            }
            boegg=false;
            for ( let e of objMenus.arrCollectedEgg ) {
                if( e==y ){
                    bolDown=true
                    break;
                }
            }
            ctxSprite.clearRect( eggDownX,eggY,eggwidth,eggHeight );
            if ( !bolDown ) {
                ctxSprite.drawImage( arrVariables[4],0,0,eggwidth,eggHeight,eggDownX,eggY,eggwidth,eggHeight );
            }
            eggDownX+=35;
            bolDown=false;
        }
        bolChicken=true;
    }
}

//draw the eggs for the medium level
function drawEggMedium() {
    let eggs=objMenus.arrCollectedEgg.filter( ( v,i,a )=> a.indexOf(v)===i),
        boegg=false;
    txtScore.innerHTML=(eggs.length);
    //success
    if (eggs.length>=32) {
        success();
    } else {
        let eggDownX=50,
            eggY=0,
            eggFinal=canBackground.width/2-20,
            eggHeight=28,
            eggwidth=16,
            bolDown=false;
            eggY=160;
        for ( let y=0; y<15; y++ ) {
            //collision detection of the eggs
            if ( ((charWidth+charSpriteX)>=eggDownX && (charSpriteX)<=eggDownX+eggwidth)&& 
            ((charSpriteY+charHeight)-5>=eggY && charSpriteY<=((eggY)+eggHeight-2)) ) {
                for ( let e of objMenus.arrCollectedEgg ) {
                    if ( e==y ) {
                        boegg=true
                        break;
                    }
                }
                if ( !boegg ) {
                    arrVariables[16].play();
                    objMenus.arrCollectedEgg.push(y);
                }
            }
            boegg=false;
            for ( let e of objMenus.arrCollectedEgg ) {
                if ( e==y ) {
                    bolDown=true
                    break;
                }
            }
            ctxSprite.clearRect( eggDownX,eggY,eggwidth,eggHeight );
            if ( !bolDown ) {
                ctxSprite.drawImage( arrVariables[4],0,0,eggwidth,eggHeight,eggDownX,eggY,eggwidth,eggHeight );
            }
            eggDownX+=45;
            bolDown=false;
        }
        eggY=400;
        eggDownX=150;
        for ( let y=16; y<30; y++ ) {
            if ( ((charWidth+charSpriteX)>=eggDownX && (charSpriteX)<=eggDownX+eggwidth)&& 
            ((charSpriteY+charHeight)-5>=eggY && charSpriteY<=((eggY)+eggHeight-2)) ) {
                for ( let e of objMenus.arrCollectedEgg ) {
                    if( e==y ){
                        boegg=true
                        break;
                    }
                }
                if ( !boegg ) {
                    arrVariables[16].play();
                    objMenus.arrCollectedEgg.push(y);
                }
            }
            boegg=false;
            for ( let e of objMenus.arrCollectedEgg ) {
                if ( e==y ) {
                    bolDown=true
                    break;
                }
            }
            ctxSprite.clearRect( eggDownX,eggY,eggwidth,eggHeight );
            if ( !bolDown ) {
                ctxSprite.drawImage( arrVariables[4],0,0,eggwidth,eggHeight,eggDownX,eggY,eggwidth,eggHeight );
            }
            eggDownX+=50;
            bolDown=false;
        }
        eggY=250;
        eggDownX=200;
        for ( let y=30; y<33; y++ ) {
            if ( ((charWidth+charSpriteX)>=eggDownX && (charSpriteX)<=eggDownX+eggwidth)&& 
            ((charSpriteY+charHeight)-5>=eggY && charSpriteY<=((eggY)+eggHeight-2)) ) {
                for ( let e of objMenus.arrCollectedEgg ) {
                    if( e==y ){
                        boegg=true
                        break;
                    }
                }
                if ( !boegg ) {
                    arrVariables[16].play();
                    objMenus.arrCollectedEgg.push(y);
                }
            }
            boegg=false;
            for ( let e of objMenus.arrCollectedEgg ) {
                if( e==y ){
                    bolDown=true
                    break;
                }
            }
            ctxSprite.clearRect( eggDownX,eggY,eggwidth,eggHeight );
            if ( !bolDown ) {
                ctxSprite.drawImage( arrVariables[4],0,0,eggwidth,eggHeight,eggDownX,eggY,eggwidth,eggHeight );
            }
            eggDownX+=150;
            bolDown=false;
        }
        bolChicken=true;
    }
}

//medium enemy AI animation
function updateEnemyMedium(){
    let x=charSpriteX,y=charSpriteY;
    //collision detection
    if ( ((charWidth+charSpriteX)>=enemyXMedium && charSpriteX<=enemyXMedium+enemyWidthMedium) && 
        ((charSpriteY+charHeight)-10>=enemyYMedium && charSpriteY<=(enemyYMedium+charHeight)-10) ) {
            bolGameOver=true;
            drawChickenDied();
        }
        ctxEnemy.clearRect(enemyXMedium,enemyYMedium,enemyWidthMedium,charHeight);
        if ( enemyCurrentFrameMedium>=8 ) {
            enemyCurrentFrameMedium=0;
        }
       
        if ( charSpriteX+charWidth>=enemyXMedium ) {
            enemyXMedium=x;
        } else {
            enemyXMedium-=10;
        }
        if ( charSpriteY<=(enemyYMedium+enemyWidthMedium) ) {
            enemyYMedium=y;
        } else {
            enemyYMedium+=15;
        }
        ctxEnemy.drawImage( arrVariables[9],enemyCurrentFrameMedium*enemyWidthMedium,0,enemyWidthMedium,charHeight,enemyXMedium,enemyYMedium,enemyWidthMedium,charHeight );
        enemyCurrentFrameMedium++;
}