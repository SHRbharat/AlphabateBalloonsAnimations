const container = document.querySelector(".pump-container");
const handle = document.querySelector('#handle');
const box = document.querySelector("#box");
const nose = document.querySelector("#nose");

let clicks = 0;
const currentBalloons = [];
let balloonId = null;

container.addEventListener('click', () => {
    handle.classList.add('animateHandle');
    box.classList.add("animateBox");
    nose.classList.add("animateNose");
    
    if(clicks%4 == 0){
        //spawn a new ballon
        balloonId = createRandomBalloon();
        currentBalloons.push(balloonId);

        if (currentBalloons.length > 4) {
            burstBalloon(currentBalloons[0]); 
            currentBalloons.shift(); 
        }
    
        console.log("balloon created ,",balloonId)
    }else if(clicks%4 == 3){
        //inflate and release ballon
        inflateBalloon(balloonId);
        releaseBalloon(balloonId);
    }else{
        inflateBalloon(balloonId);
    }

    clicks++;
    // Remove the class after the animation duration to reset it
    setTimeout(() => {
        handle.classList.remove('animateHandle');
        box.classList.remove('animateBox');
        nose.classList.remove('animateNose');
    }, 600); 
});

const balloons = [];
const colours = ["#48ee2e","#3da5fb","#e4f713","#f93ab3","#ee2f12","#ee5b12","#f15dc0","#4219f7","#ff9e03","#ae08c0"]
const alphabates = [];

for (let i = 100001; i <= 100010; i++) {
    balloons.push(`assets/Symbol ${i}.png`);
} 

for(let i = 10001; i <= 10026; i++){
    alphabates.push(`assets/Symbol ${i}.png`)
}


function createRandomBalloon() { 
    let rand;

    // unique in currentBalloons
    do {
        rand = Math.floor(Math.random() * balloons.length);
    } while (currentBalloons.includes(rand));

    // container div 
    const balloonContainer = document.createElement("div");
    balloonContainer.classList.add("balloon-container");
    balloonContainer.id = rand;

    // balloon image
    const balloonImg = document.createElement("img");
    balloonImg.src = balloons[rand];
    balloonImg.classList.add("balloon-image");

    // text
    const balloonText = document.createElement("img");
    balloonText.src = alphabates[Math.floor(Math.random() * alphabates.length)];
    balloonText.classList.add("balloon-text");

    balloonContainer.appendChild(balloonImg);
    balloonContainer.appendChild(balloonText);

    document.body.appendChild(balloonContainer);

    balloonContainer.addEventListener("click", () => {
        burstBalloon(rand);
    })

    return rand;
}

function inflateBalloon(id) {
    console.log("inflate balloon", id);
    const balloonContainer = document.getElementById(id);
    const balloonImg = balloonContainer.querySelector(".balloon-image");
    const balloonText = balloonContainer.querySelector(".balloon-text");

    // Incrementally increase the balloon size 
    if (clicks % 4 === 3) {
        //last stage
        balloonImg.classList.add("inflateStage3");
        balloonText.classList.add("inflateStage3Text");

        // Add the thread 
        const thread = document.createElement("img");
        thread.src = "assets/thread.png";
        thread.classList.add("thread");
        balloonContainer.appendChild(thread);
    } else if (clicks % 4 === 2) {
        // Second stage
        balloonImg.classList.add("inflateStage2");
        balloonText.classList.add("inflateStage2Text");
    } else if (clicks % 4 === 1) {
        // First stage
        balloonImg.classList.add("inflateStage1");
        balloonText.classList.add("inflateStage1Text");
    }
}

function releaseBalloon(id) {
    const balloonContainer = document.getElementById(id);
    
    // Randomly select one of the path classes
    const pathClass = `floatLeft${Math.floor(Math.random() * 4) + 1}`;
    
    balloonContainer.classList.add(pathClass);
}


function burstBalloon(id) {
    const balloonContainer = document.getElementById(id);
    if (!balloonContainer) {
        console.log("balloon not found", id);
        return;
    }

    // Update  currentBalloons array
    const index = currentBalloons.indexOf(id);
    if (index > -1) {
        currentBalloons.splice(index, 1);
    }

    // burst
    const numBalloons = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // 6 to 10
    const balloonFragments = [];

    for (let i = 0; i < numBalloons; i++) {
        const balloonFragment = document.createElement('div');
        balloonFragment.classList.add('balloon-fragment');
        balloonFragment.style.backgroundColor = colours[id];

        // 0-100%
        const randomX = Math.floor(Math.random() * 100); 
        const randomY = Math.floor(Math.random() * 100); 
        balloonFragment.style.position = 'absolute';
        balloonFragment.style.left = `${randomX}%`;
        balloonFragment.style.top = `${randomY}%`;

        
        balloonContainer.appendChild(balloonFragment);
        balloonFragments.push(balloonFragment);
    }

    // fading
    setTimeout(() => {
        balloonFragments.forEach(fragment => {
            fragment.style.transition = 'opacity 1s';
            fragment.style.opacity = 0;
        });

        // Remove 
        setTimeout(() => {
            balloonFragments.forEach(fragment => {
                fragment.remove();
            });
        }, 1000); 
    }, 100); // Delay before starting fade-out

    
    balloonContainer.style.transition = 'opacity 1s';
    balloonContainer.style.opacity = 0;

    
    setTimeout(() => {
        balloonContainer.remove();
    }, 1000); 
}


