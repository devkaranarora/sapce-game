import { useState, useEffect } from "react";
import { Wavedata } from "./data/Wavedata";
import "./App.css";
import "./Game.css";

function App() {
  // using states
  let [missfire, setMissfire] = useState(0);
  let [currentWave, setCurrentWave] = useState(0);
  let [emenyDetailedArray, setEmenyDetailedArray] = useState([
    { x: 100, y: 100, text: "codedamn" },
  ]);

  // global varriables
  let lockedEnemyIndex = -1;
  let remainingEnemy = 0;

  // handle wave
  function handleWaves() {
    // STEP 1->set enemy in each wave
    let enemyCount = 0;
    if (currentWave == 0) enemyCount = 1;
    if (currentWave == 1) enemyCount = 2;
    if (currentWave == 2) enemyCount = 3;
    if (currentWave == 3) enemyCount = 4;
    if (currentWave == 4) enemyCount = 5;
    if (currentWave == 5) return console.log("Game Completed");

    // STEP 2-> Genrate random words
    let wordCounter = enemyCount;
    let randomWords = [];
    while (wordCounter > 0) {
      let randomNumber = Math.floor(Math.random() * Wavedata.length);
      let randomWord = Wavedata[randomNumber];
      if (!randomWords.includes(randomWord)) randomWords.push(randomWord);
      wordCounter--;
    }

    // STEP 3 -> Varriables
    let newWave = currentWave + 1;
    setCurrentWave(newWave);

    remainingEnemy = randomWords.length;
    console.log("🧨 HANDLE WAVE IS CALLED");
    handleDisplayEnemy(randomWords);
  }

  function handleDisplayEnemy(randomWords) {
    let tempArray = [];
    let remEnemy = randomWords.length;

    for (let i = 0; i < remEnemy; i++) {
      let random_x = Math.floor(Math.random() * 400); // random x cordinate
      let random_y = Math.floor(Math.random() * -80); // random y cordinate
      let enemyObj = { x: random_x, y: random_y, text: randomWords[i] };
      tempArray.push(enemyObj);
    }

    setEmenyDetailedArray(tempArray);
    console.log("🎃 Genrated waves", tempArray, remainingEnemy);
  }

  useEffect(() => handleWaves(), []); // it will run only once as [] empty array

  // ---------------------------------------------------
  const handleFire = (event) => {
    // STEP 1 check waves and win
    let currentlyRemainingEnemy = 0;
    for (let i = 0; i < emenyDetailedArray.length; i++) {
      if (emenyDetailedArray[i].text.length > 0) currentlyRemainingEnemy++;
    }
    if (currentlyRemainingEnemy === 0) {
      if (currentWave == 5) {
        alert(`You have winned game with misfiewcount as ${missfire}`);
        window.location.reload();
      } 
      handleWaves();
      return;
    }
    console.log("🎹 Keyboard Interupt",currentlyRemainingEnemy,currentWave,remainingEnemy,emenyDetailedArray);

    // STEP -2 lock mechanism
    let keyPressed = event.key;
    let isFound = false;
    if (lockedEnemyIndex == -1) { // if no enemy is selected 
      console.log(emenyDetailedArray);
      for (let i = 0; i < emenyDetailedArray.length; i++) {
        let enemyObj = emenyDetailedArray[i];
        let enemyWord = enemyObj.text;
        let enemyLetter = enemyWord[0];
        if ( enemyLetter && enemyLetter.toLowerCase() == keyPressed.toLowerCase()) {
          isFound = true;
          lockedEnemyIndex = i;
          console.log("🔥 We can Fire", i, emenyDetailedArray[i].text);
        }
      }
    } else { // if enemy is already selected 
      isFound = true;
      console.log("🔥 enemy index",lockedEnemyIndex,emenyDetailedArray[lockedEnemyIndex].text);
    }

    // STEP 3 ->shoot mechanism
    if (!isFound) {
      console.log("missfire ----", missfire);
      let tempMisFire = missfire + 1;
      setMissfire(tempMisFire);
      return;
    }
    let existingState = [...emenyDetailedArray];
    let text = emenyDetailedArray[lockedEnemyIndex].text;
    let newText = text.substring(1);
    existingState[lockedEnemyIndex].text = newText;
    setEmenyDetailedArray(existingState);
    if (newText.length == 0) lockedEnemyIndex = -1;
    console.log("newText", newText);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleFire);
    return (e) => document.removeEventListener("keydown", handleFire);
  }, [emenyDetailedArray, missfire]);

  useEffect(() => {
    const updatePosition = setInterval(() => {
      let existingState = [...emenyDetailedArray];
      console.log(existingState,emenyDetailedArray)
      for(let i=0;i<emenyDetailedArray.length;i++){
        let enemy = emenyDetailedArray[i]
        let new_y = enemy.y
        if(new_y>650) {
          alert("GameOver") 
          window.location.reload();
          // return;
        }
        existingState[i].y = new_y + 10
      }
      setEmenyDetailedArray(existingState); 
      // setCounter(prevCounter => prevCounter + 1);
    }, 200 * 1);
    return () => clearInterval(updatePosition);
  }, [emenyDetailedArray]);

  
  return (
    <div className="game-bg">
      <div className="game">
        <div className="game-container">
          <div className="game-grid-animation"></div>
          <div className="data-container">
            <p>Press any Key to Start Game and space to go to next level</p>
            <p>{"CURRENT WAVE : " + currentWave}</p>
            <p>{"MISSFIRE : " + missfire}</p>
          </div>
          {emenyDetailedArray.map((enemy, enemyIndex) => {
            let toShow = false;
            let enemyText = enemy.text;
            let enemy_x = enemy.x;
            let enemy_y = enemy.y;
            let enemyPositionCSS = {
              top: `${enemy_y}px`,
              left: `${enemy_x}px`,
            };

            if (enemyText.length > 0) toShow = true; // if ememy then toShow
            return (
              toShow && (
                <span
                  className="enemy-mine" // enemy stylling
                  key={enemyIndex} // to prevent key error
                  style={enemyPositionCSS} // css change every frame
                >
                  <p>{enemyText}</p>
                  <div className="rotate mine-img"></div>
                </span>
              )
            );
          })}
          <div className="red-lane"></div>
          <div className="player"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
