import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = (() => {

  // cache the DOM, putting all the dom elements we need in variables
  const quizEl = document.querySelector('.jabquiz');
  const quizQuestionEl = document.querySelector('.jabquiz__question');
  const trackerEl = document.querySelector('.jabquiz__tracker');
  const taglinesEl = document.querySelector('.jabquiz__tagline');
  const choicesEl = document.querySelector('.jabquiz__choices');
  const progressInnerEl = document.querySelector('.progress__inner');
  const nextButtonEl = document.querySelector('.next');
  const restartButtonEl = document.querySelector('.restart');

  const q1 = new Question(
    "First President of the US?",
    ['Barrack', 'George', 'Lincoln', 'Jim'],
    1)

  const q2 = new Question(
    "My favorite color",
    ['Blue', 'Red', 'Black', 'Green'],
    2)

  const q3 = new Question(
    "My dream car",
    ['Lambo', 'Ferrari', 'Tesla', 'Truck'],
    2)

  const q4 = new Question(
    "My girlfriend's name?",
    ['Sophia', 'Sarah', 'Sophie', "Josephina"],
    0)

  // initialized quiz
  const quiz = new Quiz([q1, q2, q3, q4])

  // adding event listeners
  const listeners = _ => {
    nextButtonEl.addEventListener('click', function() {
      const selectedRadioElem = document.querySelector("input[name='choice']:checked");
      if (selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute('data-order'));
        quiz.guess(key);
        renderAll();
      }
    })

    restartButtonEl.addEventListener('click', function() {
      // 1. reset the quiz
      quiz.reset();
      // 2. renderAll
      renderAll();
      // 3. restore the next button
      nextButtonEl.style.opacity = 1;
      // 4. reset the tagline from completed back to original
      setTextValue(taglinesEl, 'Pick an option below.');
    })
  }



  // since we will be changing alot of innerHTML, we will create a function to make it easier
  const setTextValue = (elem, text) => {
    elem.innerHTML = text;
  }

  const renderQuestion = _ => {
    const question = quiz.getCurrentQuestion().question;
    // quizQuestionEl.innerHTML = question;
    setTextValue(quizQuestionEl, question)
  }

  // makes questions appear on the browser
  const renderChoicesElement = _ => {
    let markup = '';
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
        <li class = "jabquiz__choice">
          <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
          <label for="choice${index}" class="jabquiz__label">
          <i></i>
          <span>${elem}</span>
          </label>
        </li>
      `
    })

    setTextValue(choicesEl, markup);
  }
  
const renderTracker = _ => {
  const index = quiz.currentIndex;
  setTextValue(trackerEl, `${index+1} of ${quiz.questions.length}`)  
}

const getPercentage = (num1, num2) => {
  return Math.round((num1/num2) * 100);
}

const launch = (width, maxPercent) => {
  let loadingBar = setInterval(function() {
    if(width > maxPercent) {
      clearInterval(loadingBar);
    } else {
      width++;
      progressInnerEl.style.width = `${width}%`
    }
  }, 3)
}

const renderProgress = _ => {
  //1. width
  const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length)
  //2. launch(0, width)
  launch(0, currentWidth);
}

const renderEndScreen = _ => {
  setTextValue(quizQuestionEl, 'Great Job!');
  setTextValue(taglinesEl, 'Completed!');
  setTextValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}% `);
  nextButtonEl.style.opacity = 0;
  renderProgress();
}


// shows the questions and choices on screen
const renderAll = _ => {
  if (quiz.endGame()) {  
  // renderEndScreen
  renderEndScreen();
  } else {
    // 1. render the question
    renderQuestion();
    // 2. render the choices elements
    renderChoicesElement();
    // 3. render tracker
    renderTracker();
    // 4. render progress
    renderProgress();

  }
}

  return {
    renderAll: renderAll,
    listeners: listeners
  }

})();

App.renderAll();
App.listeners();

