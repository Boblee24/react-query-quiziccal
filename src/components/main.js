import React from "react"


export default function Main(props){
    return(
        <section className="section1">
            <h1>Quizzical</h1>
            <h3>Prepare to challenge your intellect in this thrilling quiz game!</h3>
            <button className="welcome_button" onClick={props.changePage} >Start Quiz</button>
      </section>
    )
}