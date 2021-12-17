const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const { lookupService } = require("dns");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

//Await ask function---
async function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//Global variables---
let maxNum;
let minNum = 1;
let highLow;
let high;
let low;

let secretNumber;

let guess;
let computerWins = false;
let playAgain;
let newGuess;
//function random number generator---
function getHalf(minNum, maxNum) {
  return Math.floor((maxNum - minNum) / 2) + minNum;
}
let computerGuess = getHalf(minNum, maxNum);

//Scrubber function to catch unwanted answers---
function scrubber(input) {
  cleanInput = input.toLowerCase().charAt(0);
  return cleanInput;
}

//Gives a goodbye and exits function---
function endGame() {
  console.log("Maybe next time.");
  process.exit();
}

async function winLose() {
  // && guess === secretNumber??? not working ???

  //if yes log, victory and asks if the player would like to play again---
  console.log("\nA.I. is VICTORIOUS!!!\n");

  playAgain = await ask("\nWould you like to play again?\nyes or no?>_");
  //Sanitizes a yes answer, clears maxNum, breaks loop with true, and calls whichGame function---
  if (scrubber(playAgain) === "y") {
    computerWins = true;
    maxNum = undefined;
    whichGame(); //??? doesn't seem to continue ???
    //Sanitizes a no answer, says goodbye and exits---
  } else if (scrubber(playAgain) === "n") {
    console.log("\nThanks for playing!");
    process.exit();
    //Catches any other unauthorized answers and loops to 'play again'---
  } else {
    console.log("\nInvalid response, try again.\n"); //??? Is looping to 'is your number' ???
  }
}

//-----------------------------------------------Game one, human picks number, computer guesses function-----------------------------------------------//
//Async function to allow input from user wraps code for game one---
async function gameOne() {
  console.log(
    "Let's play a game where you (the human) pick a number and I (the vastly superior computer) try to guess it."
  );

  //Ask what max number to use and assigns to variable maxNum---
  maxNum = await ask(
    "\nBefore we start, pick a max number greater than 10 to pick between.\n>_"
  );
  //Catch an entry that is NaN---
  if (isNaN(maxNum)) {
    console.log("\nThat is not a number, try again.\n");
    maxNum = undefined;
    //Catch an entry that is less than 10---
  } else if (maxNum < 10) {
    console.log("\nThat number is too small. Pick a number above 10!\n");
    maxNum = undefined;
    //Logs out maxNum and exits loop---
  } else {
    maxNum = maxNum;
    console.log(`\nYou entered ${maxNum} for your maximum range.\n`);
  }

  //assign the players number to variable secretNumber---
  let secretNumber = await ask(
    "\nWhat is your secret number?\nI won't peek, I promise...\n>_"
  );
  //Catch an entry that is NaN or greater than maxNum---
  if (secretNumber === secretNumber) {
    console.log(`\nYou picked ${secretNumber} for your secret number.\n`);
    //Logs out secret number
  } else if (isNaN(secretNumber) || secretNumber > maxNum) {
    console.log(`\nPlease pick a number between 1 and ${maxNum}.\n`);
  } else {
    console.log("\nInvalid response, try again.\n");
  }

  //Computer wins loop, loops until computerWins === true---
  while (computerWins === false) {
    //Assigns the computers guess to the variable computerGuess---
    computerGuess = getHalf(minNum, maxNum);

    //Computer guesses a number, asks if it is correct. yes or no is assigned to the variable guess---
    guess = await ask(
      `Is you number ${getHalf(minNum, maxNum)}?\nyes or no?>_`
    );
    //
    console.log("should be half of maxNum " + computerGuess);
    //
    //Sanitizes a yes answer and continues
    if (scrubber(guess) === "y") {
      //goes through winLose function---
      winLose();
      //Sanitizes a no answer then goes to high low loop---
    } else if (scrubber(guess) === "n") {
      //High low loop, loops until the response is y---
      while (highLow !== "y") {
        highLow = await ask(
          "\nIs your number higher or lower?\nhigh or low?>_"
        );

        //If the secret number is higher than computer guess---
        console.log(minNum);
        console.log(maxNum);

        if (scrubber(highLow) === "h") {
          //If number is high then change minNum to the computers guess---
          let minNum = computerGuess;
          //let lComputerGuess = maxNum;
          //Assigns the computers guess to the variable computerGuess---

          console.log(minNum);
          console.log(maxNum);
          //
          highLow = await ask(
            `Is you number ${getHalf(minNum, maxNum)}?\nyes or no?>_`
          );
          minNum = computerGuess;
          console.log(minNum);
          console.log(maxNum);
          //
        } else if (scrubber(highLow) === "l") {
          //If number is low then change maxNum to the computers guess---
          //let hComputerGuess = minNum;

          let maxNum = computerGuess;
          //Assigns the computers guess to the variable computerGuess---

          console.log(minNum);
          console.log(maxNum);
          //
          highLow = await ask(
            `Is you number ${getHalf(minNum, maxNum)}?\nyes or no?>_`
          );

          console.log(minNum);
          console.log(maxNum);
        }
        if (scrubber(highLow) === "y") {
          //If answer is y then the loop breaks and go to winLose()---
          winLose();
        }
      }
    } else {
      console.log("\nInvalid response, try again.\n");
    }
  }
}
//----------------------------------------------------------------Game two computer picks number, human guesses function---------------------------------//

async function gameTwo() {
  console.log(
    "Let's play a game where I, (the vastly superior computer) pick a number, 1 - 100, and you, (the human) try to guess it."
  );
}

//If yes, ask which game they would like to play function-----
async function whichGame() {
  let response = await ask(
    "\nWhich game would you like to play?\nGame one: The human picks the number and the computer guesses.\nGame two: The computer picks the number and the human guesses.\nPlease pick one or two (1 or 2) >_"
  );
  if (response.toLowerCase().trim() === "one" || response.trim() === "1") {
    gameOne();
  } else if (
    response.toLowerCase().trim() === "two" ||
    response.trim() === "2"
  ) {
    gameTwo();
  } else {
    console.log("\nInvalid response, try again.\n");
    whichGame();
  }
}

start();
//-----------------async start function--------------------
async function start() {
  //Landing sentence, invitation-----

  let response = await ask("\nWould you like to play a game?\nyes or no? >_");

  if (scrubber(response) === "y") {
    whichGame();
  } else if (scrubber(response) === "n") {
    endGame();
  } else {
    console.log("\nInvalid response, try again.\n");
    start();
  }
}

// --------------------------------------------------------Wire frame / working out ideas--------------------------------------------------------------//

//   //If no, say goodbye and exit----
//   else if (

//   ) {
//     console.log("Maybe next time.");
//     process.exit();

//     //If any other response, start again----
//   } else {
//     console.log(`That is not a valid response, try again.`);
//     response = await ask("Would you like to play a game?\nyes or no? >_");
//   }

//   //Start stories, pick a number----
//
//   );

//   //Start "Is your number?" loop---
//   while (secretNumber === "" || isNaN(secretNumber)) {
//     console.log("That is not a number.");
//     secretNumber = await ask(
//       "What is your secret number?\nI won't peek, I promise...\n>_"
//     );
//   }

//   let max = 100;
//   let min = 1;

//   //Assign the computer guess to a variable
//   let firstGuess = getHalf(min, max);

//   //  ask if the number is your number(random number), yes or no? and wait for answer
//   let answer = await ask(`Is your number ${firstGuess}?\nyes or no? >_`);

//   //if answer === yes then log out.
//   if (
//     response.toLowerCase().trim() === "yes" ||
//     response.toLowerCase().trim() === "y" ||
//     response.toLowerCase().trim() === "yup" ||
//     response.toLowerCase().trim() === "yah" ||
//     response.toLowerCase().trim() === "sure"
//   ) {
//     //if yes log victory and exit
//     console.log("A.I. is VICTORIOUS!!!");
//     //await ask("Would you like to play again?");
//     process.exit();
//   }
//   //if answer is no ask if number is high or low and await answer
//   else if (
//     response.toLowerCase().trim() === "no" ||
//     response.toLowerCase().trim() === "n" ||
//     response.toLowerCase().trim() === "nope" ||
//     response.toLowerCase().trim() === "nah"
//   ) {
//     let answer = await ask("Is your number higher or lower? \nh or l? >_");
//     while (answer.toLowerCase().trim() === "high" || "h") {
//       if (answer.toLowerCase().trim() === "high" || "h") {
//       }
//       let response = await ask(`Is your number ${guess}?\nyes or no? >_`);
//     }
//     // any other response log invalid response
//   } else {
//     console.log("Invalid command.");
//     answer = await ask(`Is your number ${firstGuess}?\nyes or no? >_`);
//   }
// }

// //
// //
// //     answer = await ask("Is your number higher or lower? \nh or l? >_");
// //     if (answer.toLowerCase().trim() === "h") {
// //       answer = await ask(
// //         "Is your number " + randomInteger(guess + 1, 100) + "?\nyes or no? >_"
// //       );
// //     } else if (answer.toLowerCase().trim() === "l") {
// //       answer = await ask(
// //         "Is your number " + randomInteger(1, guess - 1) + "?\nyes or no? >_"
// //       );
// //     } else if (answer.toLowerCase().trim() !== "no") {
// //       answer = await ask("Improper response. Try again. \nyes or no? >_");
// //     }
// //   }

// //   //let hiResponse = await ask("Is your number " + randomInteger(guess + 1, 100) + "?\nyes or no?")
// //   //let lowResponse = await ask("Is your number " + randomInteger(1, guess - 1) + "?\nyes or no?")

// //   process.exit();
// // }
