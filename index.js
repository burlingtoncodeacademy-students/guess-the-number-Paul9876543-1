const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

async function start() {
  console.log(
    "Let's play a game where you (human) pick a number, 1 - 100, and I (computer) try to guess it."
  );

  let secretNumber = await ask(
    "What is your secret number?\nI won't peek, I promise...\n>_"
  );

  console.log("You entered: " + secretNumber);

  // function random number generator
  let max = 100;
  let min = 1;
  function randomInteger(min, max) {
    let range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
  }

  // log victory and exit if yes
  // any other response log invalid response

  let guess = randomInteger(1, 100);
  //  ask if the number is your number(random number), yes or no? and wait for answer
  let answer = await ask(`Is your number ${guess}?\nyes or no? >_`);

  // start yes, no loop
  // if answer === yes then log out. if no then hi low
  if (answer.toLowerCase().trim() === "yes") {
    //if yes log victory and exit
    console.log("A.I. is VICTORIOUS!!!");
    process.exit();
  } else {
    //if answer is no ask if number is high or low and await answer
    answer.toLowerCase() === "no";
    answer = await ask("Is your number higher or lower? \nh or l? >_");
  }

  // start high low loop
  while (answer.toLowerCase().trim() !== "yes") {
    answer = await ask("Is your number higher or lower? \nh or l? >_");
    if (answer.toLowerCase().trim() === "h") {
      answer = await ask(
        "Is your number " + randomInteger(guess + 1, 100) + "?\nyes or no? >_"
      );
    } else if (answer.toLowerCase().trim() === "l") {
      answer = await ask(
        "Is your number " + randomInteger(1, guess - 1) + "?\nyes or no? >_"
      );
    } else if (answer.toLowerCase().trim() !== "no") {
      answer = await ask("Improper response. Try again. \nyes or no? >_");
    }
  }

  //let hiResponse = await ask("Is your number " + randomInteger(guess + 1, 100) + "?\nyes or no?")
  //let lowResponse = await ask("Is your number " + randomInteger(1, guess - 1) + "?\nyes or no?")

  process.exit();
}
