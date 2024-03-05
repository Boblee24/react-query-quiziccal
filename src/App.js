import React from "react";
import Main from "./components/main";
import Second from "./components/Second";
import "./App.css";
import "./style.css";
import { decode } from "html-entities";
import { nanoid } from "nanoid";
import Header from "./components/Header";
import Axios from "axios";
import { useQuery } from "@tanstack/react-query";

decode("&lt; &gt; &quot; &apos; &amp; &#169; &#8710;");

function App() {
  const [firstPage, setFirstPage] = React.useState(false);
  // const [question, setQuestion] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);

  const [numOfCorrectAnswer, setNumOfCorrectAnswer] = React.useState(0);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["quiz"],
    queryFn: () => {
      return Axios.get("https://opentdb.com/api.php?amount=5").then(
        (res) => res.data
      );
    },
    
  });
  const shuffle = (array) => {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  if(isLoading) {
    return data
  }
  const fetchData = data.results.map((question) => {
      const answer = [...question.incorrect_answers, question.correct_answer];
      return {
        id: nanoid(),
        key : nanoid(),
        question: question.question,
        answers: shuffle(answer),
        correctAnswer: question.correct_answer,
        selectedAnswer: "",
      };
    });
    // setQuestion(fetchData)

  // fetchData()

  //Shuffling array
  
  function numberOfAnswer() {
    fetchData.forEach((questionObject) => {
      if (questionObject.selectedAnswer === questionObject.correctAnswer) {
        setNumOfCorrectAnswer((previous) => previous + 1);
      }
    });
  }
  //checking answer
  function checkanswers() {
    setShowResult(true);
    numberOfAnswer();
  }
  //reset state
  function restart() {
    setFirstPage(false);
    setShowResult(false);
    setNumOfCorrectAnswer(0);
    refetch();
    // setQuestion([])
  }
  function updateAnswer(currentQuestion, answer) {
      fetchData.map((questionObject) => {
        // if it is the question being answered, update its selected answer
        return questionObject.question === currentQuestion
          ? { ...questionObject, selectedAnswer: answer }
          : questionObject;
      })
  }
  function createQuiz() {
    const submit = (
      <div className="welcome">
        {showResult ? (
          <div>
            <span>
              You scored {numOfCorrectAnswer}/{fetchData.length} correct answers
            </span>{" "}
            <button className="welcome_button" onClick={restart}>
              Play Again
            </button>
          </div>
        ) : (
          <button onClick={checkanswers} className="welcome_button">
            Check answer
          </button>
        )}
      </div>
    );
    const quizComponents = fetchData.map((quiz) => (
      <Second
      key={quiz.id}
      question={quiz.question}
      correctAnswer={quiz.correctAnswer}
      answers={quiz.answers}
      selectedAnswer={quiz.selectedAnswer}
      updateAnswer={updateAnswer}
      showResult={showResult}
      checkanswers={showResult}
      // onAnswerChange={(selectedAnswer) => handleAnswerChange(fetchData.id, selectedAnswer)}
      />
    ));
    return [<div className="bag">{quizComponents}</div>, submit];
  }

  function changePage() {
    setFirstPage(true);
  }
  return (
    <div className="wrapper">
      <div className="container">
        <Header />
        {firstPage ? createQuiz() : <Main changePage={changePage} />}
      </div>
    </div>
  );
}
export default App;
