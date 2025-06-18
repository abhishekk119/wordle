import { fiveLetterWords } from "./words.js";

document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;
  let anArray = [];
  const popup = document.getElementById("popup");
  const closePopupBtn = document.getElementById("close-popup");
  let count = 0;
  let gameActive = true;

  //get the random word from wordlist
  const randomWord =
    fiveLetterWords.words[
      Math.floor(Math.random() * fiveLetterWords.words.length)
    ];
  console.log(randomWord);

  //put that word in an array
  let theArray = [...randomWord];

  let boxes = document.querySelectorAll(".box");
  wordInput();
  // document.getElementById("q-button").addEventListener("click", () => {
  //   wordInput("q");
  // });
  //**********************************************************/

  // Add this inside DOMContentLoaded, after wordInput function is defined

  // Create keyboard buttons dynamically (better approach)
  const keyboard = document.querySelector(".keyboard");
  if (!keyboard) {
    const keyboardHTML = `
    <div class="keyboard">
      <!-- First Row (QWERTYUIOP) -->
      <div class="keyboard-row">
        ${"qwertyuiop"
          .split("")
          .map(
            (char) =>
              `<button data-char="${char}">${char.toUpperCase()}</button>`
          )
          .join("")}
      </div>
      
      <!-- Second Row (ASDFGHJKL) -->
      <div class="keyboard-row">
        ${"asdfghjkl"
          .split("")
          .map(
            (char) =>
              `<button data-char="${char}">${char.toUpperCase()}</button>`
          )
          .join("")}
      </div>
      
      <!-- Third Row (ZXCVBNM) -->
      <div class="keyboard-row">
        ${"zxcvbnm"
          .split("")
          .map(
            (char) =>
              `<button data-char="${char}">${char.toUpperCase()}</button>`
          )
          .join("")}
      </div>
      
      <!-- Fourth Row (Special Buttons) -->
      <div class="keyboard-row">
        <button class="wide" id="enter-btn">ENTER</button>
        <button data-char="backspace" id="backspace-btn">⌫</button>
        <button class="wide" id="hint">HINT</button>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML("beforeend", keyboardHTML);
  }

  // Single event listener for all buttons
  document.addEventListener("click", (e) => {
    if (!gameActive) return;

    const button = e.target.closest("button");
    if (!button) return;

    const char = button.dataset.char;

    if (char === "backspace") {
      // Handle backspace
      if (currentIndex > 0 && count > 0) {
        currentIndex--;
        count--;
        boxes[currentIndex].innerHTML = "";
        boxes[currentIndex].classList.remove("pop");
        anArray.pop();
      }
    } else if (button.id === "enter-btn") {
      comparison();
      count = 0;
    } else if (char && char.length === 1) {
      // Handle letter input
      if (count < 5 && currentIndex < boxes.length) {
        boxes[currentIndex].innerHTML = char.toUpperCase();
        boxes[currentIndex].style.color = "white";
        boxes[currentIndex].style.fontWeight = "bold";
        boxes[currentIndex].classList.add("pop");
        anArray.push(char);
        currentIndex++;
        count++;
      }
    }
  });

  //**********************************************************/

  function wordInput(char = null) {
    //fill the boxes with user input words (one by one)
    document.addEventListener("keydown", function (event) {
      if (!gameActive) return;
      if (/^[a-zA-Z]$/.test(event.key)) {
        if (count < 5 && currentIndex < boxes.length) {
          boxes[currentIndex].innerHTML = event.key.toUpperCase();
          //boxes[currentIndex].innerHTML = char.toUpperCase();
          boxes[currentIndex].style.color = "white";
          boxes[currentIndex].style.fontWeight = "bold";
          boxes[currentIndex].classList.add("pop");
          anArray.push(event.key);
          currentIndex++;
          count++;
        }
      } else if (event.key === "Enter") {
        comparison();
        count = 0;
      } else if (event.key === "Backspace") {
        if (currentIndex > 0 && count > 0) {
          currentIndex--;
          count--;
          boxes[currentIndex].innerHTML = "";
          boxes[currentIndex].classList.remove("pop");
          anArray.pop();
        }
      }
    });

    // if (char !== null) {
    //   if (!gameActive) return;
    //   if (count < 5 && currentIndex < boxes.length) {
    //     boxes[currentIndex].innerHTML = char.toUpperCase();
    //     boxes[currentIndex].style.color = "white";
    //     boxes[currentIndex].style.fontWeight = "bold";
    //     boxes[currentIndex].classList.add("pop");
    //     anArray.push(char.toLowerCase());
    //     currentIndex++;
    //     count++;
    //   }
    // }
  }

  const closeInstructionBtn = document.getElementById("close-instruction");
  const instructionWrapper = document.querySelector(".instruction-wrapper");
  closeInstructionBtn.addEventListener("click", () => {
    instructionWrapper.style.display = "none";
  });

  function comparison() {
    const chunkSize = 5;
    const result = [];

    // Create a frequency map of letters in the target word
    const targetLetterCounts = {};
    theArray.forEach((letter) => {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    });

    // Create a copy we can modify as we process matches
    const remainingLetterCounts = { ...targetLetterCounts };
    for (let i = 0; i < anArray.length; i += chunkSize) {
      //explain
      const chunk = anArray.slice(i, i + chunkSize);
      result.push(chunk.join(""));
    }

    const currentWord = result[result.length - 1];
    let array3 = [...currentWord];
    const startIndex = (result.length - 1) * 5; //explain

    if (fiveLetterWords.words.includes(currentWord)) {
      // First pass: mark correct positions (green)
      for (let i = 0; i < 5; i++) {
        const boxIndex = startIndex + i; //explain
        if (currentWord[i] === theArray[i]) {
          setTimeout(() => {
            boxes[boxIndex].classList.add("flip");
            boxes[boxIndex].style.backgroundColor = "lightgreen";
            boxes[boxIndex].classList.add("correct-position");
            boxes[boxIndex].style.border = "solid 2px lightgreen";
          }, i * 300);

          remainingLetterCounts[currentWord[i]]--; //explain
        }
      }

      // Second pass: mark correct letters in wrong positions (yellow)
      for (let i = 0; i < 5; i++) {
        const boxIndex = startIndex + i;

        // Skip if already marked as correct position
        if (boxes[boxIndex].classList.contains("correct-position")) {
          continue;
        }

        if (
          theArray.includes(currentWord[i]) &&
          remainingLetterCounts[currentWord[i]] > 0 //explain
        ) {
          setTimeout(() => {
            boxes[boxIndex].classList.add("flip");
            boxes[boxIndex].classList.add("matched");
            //boxes[boxIndex].style.border = "solid 2px yellow";
          }, i * 300);

          remainingLetterCounts[currentWord[i]]--; //explain
        } else {
          setTimeout(() => {
            boxes[boxIndex].classList.add("flip");
            boxes[boxIndex].classList.add("nomatch");
            //boxes[boxIndex].style.backgroundColor = "grey";
          }, i * 300);
        }
      }

      if (JSON.stringify(array3) === JSON.stringify(theArray)) {
        setTimeout(showPopup, 5 * 300);
      }
    } else {
      const rowBoxes = Array.from(boxes).slice(startIndex, startIndex + 5); //explain
      rowBoxes.forEach((box) => {
        box.classList.remove("pop");
        box.classList.add("shake");
        box.innerHTML = "";
      });
      currentIndex = startIndex;
      anArray.splice(startIndex, 5);
    }
  }

  function showPopup() {
    popup.classList.add("popup-visible");
    gameActive = false;
  }

  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("popup-visible");
  });
});
