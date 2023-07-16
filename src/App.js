import React from "react"
import Main from "./components/main"
import Second from "./components/Second"
import './App.css';
import './style.css';
import {decode} from 'html-entities';
import { nanoid } from 'nanoid'

decode('&lt; &gt; &quot; &apos; &amp; &#169; &#8710;');

function App() {
  // const [quizData, setQuizData] = React.useState([])
  const [firstPage, setFirstPage] = React.useState(false)
  // const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [question, setQuestion] = React.useState([])
  // const [questionsAndAnswers, setQuestionsAndAnswers] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false)
  
  const [numOfCorrectAnswer, setNumOfCorrectAnswer] = React.useState(0)

  //Shuffling array
  const shuffle = (array) => {
    // Implement your preferred shuffling algorithm here
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function fetchData(){
    fetch("https://opentdb.com/api.php?amount=5")
    .then(res => res.json())
    .then(data => {
      const extractedQuestion = data.results.map((question) => {
        const answer = [...question.incorrect_answers, question.correct_answer]
        return {
          id: nanoid(),
          question : question.question,
          answers : shuffle(answer), 
          correctAnswer : question.correct_answer,
          selectedAnswer: ""
        }
      })
      // setQuizData(data.results)
      setQuestion(extractedQuestion)
    })
  }
  React.useEffect( () => {
    fetch("https://opentdb.com/api.php?amount=5")
    .then(res => res.json())
    .then(data => {
      const extractedQuestion = data.results.map((question) => {
        const answer = [...question.incorrect_answers, question.correct_answer]
        return {
          id: nanoid(),
          question : question.question,
          answers : shuffle(answer), 
          correctAnswer : question.correct_answer,
          selectedAnswer: ""
        }
      })
      // setQuizData(data.results)
      setQuestion(extractedQuestion)
    })
  }, [])

  function numberOfAnswer(){
    question.forEach(questionObject => {
      if(questionObject.selectedAnswer === questionObject.correctAnswer){
        setNumOfCorrectAnswer(previous => previous + 1)
      } 
    })
  }

 

  //checking answer

  function checkanswers(){
    setShowResult(true)
    numberOfAnswer()
  }

  // reset state
  function restart(){
    setFirstPage(false)
    setShowResult(false)
    setNumOfCorrectAnswer(0)
    fetchData()
    
    // setQuestion([])
  }
  // console.log(question)

  
  // const handleAnswerChange = (questionId, selectedAnswer) => {
  //   setSelectedAnswers((prevSelectedAnswers) => ({
  //     ...prevSelectedAnswers,
  //     [questionId]: selectedAnswer,
  //   }));
  // };
  // console.log(selectedAnswers)

  function updateAnswer(currentQuestion, answer) {
    setQuestion(
      question.map((questionObject) => {
        // if it is the question being answered, update its selected answer
        return questionObject.question === currentQuestion
          ? { ...questionObject, selectedAnswer: answer }
          : questionObject;
      })
    );
  }

  function createQuiz(){
    const submit = <div className="welcome">
      {showResult ? <div><span>You scored {numOfCorrectAnswer}/{question.length} correct answers</span> <button className="welcome_button" onClick={restart}>Play Again</button></div> : <button onClick={checkanswers} className="welcome_button">Check answer</button>}
        
        </div>
    const quizComponents = question.map((quiz, index) => (
      // console.log(quiz.answer[3]),
      <Second 
        key={question.id} 
        question={quiz.question} 
        correctAnswer={quiz.correctAnswer}
        answers = {quiz.answers}
        selectedAnswer = {quiz.selectedAnswer}
        updateAnswer={updateAnswer}
        showResult = {showResult}
        checkanswers = {showResult}
        // onAnswerChange={(selectedAnswer) => handleAnswerChange(question.id, selectedAnswer)}
      />
    ));
    return [quizComponents, submit]
  }

  function changePage(){
    setFirstPage(true)
  }
 
  return (
    <div className="wrapper">
      <div className='container'>
        {firstPage ? (
          createQuiz()
          
        )  : (
          <Main changePage={changePage} />
        )}
      </div>
    </div>
  );
}

export default App;