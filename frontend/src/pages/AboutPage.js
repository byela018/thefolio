// src/components/About.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import about1 from "../assets/about1.jpg";
import about2 from "../assets/about2.jpg";
import about3 from "../assets/about.jpg";
import { DarkMode } from "../components/DarkMode";


const quizData = [
  {
    question: "In Alight Motion, what do you use to make movements look smooth and natural?",
    options: ["Blending Modes", "Keyframe Graphs/Easing", "Export Settings", "Vector Layers"],
    answer: 1
  },
  {
    question: "Which file format is commonly used by Alight Motion editors to share presets?",
    options: [".MP4", ".PNG", ".XML", ".APK"],
    answer: 2
  },
  {
    question: "To move multiple layers together in AM without merging, you should...",
    options: ["Group them", "Delete them", "Export them", "Change Opacity"],
    answer: 0
  },
  {
    question: "In CapCut, what is the feature called that automatically removes the background?",
    options: ["Chroma Key", "Auto Cutout", "Masking", "Overlay"],
    answer: 1
  },
  {
    question: "What does the 'Luma Key' effect primarily look at to create a mask?",
    options: ["Colors", "Brightness/Light levels", "Audio volume", "Saturation"],
    answer: 1
  }
];

const AboutPage = () => {

      useEffect(() => {
      DarkMode(); // run the JS after DOM loads
    }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("");

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const selectOption = (index) => {
    setSelectedOptionIndex(index);
  };

const submitAnswer = () => {
  const currentData = quizData[currentQuestionIndex];

  if (selectedOptionIndex === currentData.answer) {
    setScore(score + 1);
    setResultMessage("Correct! ✅");
    setResultColor("#28a745");
  } else {
    setResultMessage(`Wrong! Correct answer: ${currentData.options[currentData.answer]}`);
    setResultColor("#ff4444");
  }

  setTimeout(() => {
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setResultMessage("");
    } else {
      setCurrentQuestionIndex(null);
    }
  }, 1000);
};

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setQuizStarted(false);
  };

  const currentData = currentQuestionIndex !== null ? quizData[currentQuestionIndex] : null;

  return (
    <>
      <Header />

      {/* Dark Mode button */}
      <button id="modeToggle">🌙</button>

      {/* HERO */}
      <section id="hero-about">
        <h2>About Me & My Hobby</h2>
        <p>Get to know my interests and how they inspire my creativity.</p>
      </section>

      <div className="line"></div>

      {/* SECTION 1 */}
      <section id="section-about1">
        <h3>What I Love About Editing</h3>
        <p>
          Editing is one of my favorite creative hobbies. I have been editing since 2021 using Alight Motion and CapCut, and I enjoy creating edits whenever I feel inspired. 
          Through editing, I am able to express my ideas, emotions, and creativity in a visual way.
          <br /><br />
          I like experimenting with different styles and transitions, especially creative effects such as 3D-like cube edits, roulette or wheel-style animations, and flip-page transitions. 
          Even though I am still learning and improving, editing motivates me to explore new techniques and continuously develop my skills at my own pace.
        </p>
      </section>

      <div className="line"></div>

      {/* SECTION 2 */}
      <section id="section-about2">
        <h3>My Hobby Journey</h3>
        <ol>
          <li>Discovered an interest in creative video editings</li>
          <li>Started editing videos in 2021</li>
          <li>Learned to use Alight Motion and CapCut</li>
          <li>Explored different styles and transitions</li>
          <li>Continues improving and learning new editing techniques</li>
        </ol>
      </section>

      {/* SECTION 3 */}
      <section id="section-about3">
        <h3>My Interest in Video Editing</h3>
        <p>Editing is one of my favorite hobbies. I usually use Alight Motion and CapCut to create simple edits. It allows me to express my ideas visually and improve my creative skills.</p>
      </section>

      <div className="line"></div>

      {/* IMAGES */}
      <section id="section-about4" className="images">
        <img src={about2} alt="Screenshot of my video editing project" />
        <img src={about1} alt="Screenshot of my video editing project" />
        <img src={about3} alt="Screenshot of my video editing project" />
      </section>

      {/* BLOCKQUOTE */}
      <section id="section-about5">
        <blockquote>
          "The first draft is black and white. Editing gives the story color." — Emma Hill
        </blockquote>
      </section>

      <div className="line"></div>

      {/* QUIZ */}
      <div className="quiz-container">
        {!quizStarted ? (
          <div id="start-screen">
            <h2>🎬 QUIZ TIME!</h2>
            <p>Ready to test your Alight Motion & CapCut knowledge?</p>
            <button className="main-btn" onClick={startQuiz}>Start Quiz</button>
          </div>
        ) : currentQuestionIndex !== null ? (
          <div id="quiz-content">
            <h2 id="question">{currentData.question}</h2>
            <div className="options">
              {currentData.options.map((opt, i) => (
                <div
                  key={i}
                  className={`option ${selectedOptionIndex === i ? "selected" : ""}`}
                  onClick={() => selectOption(i)}
                >
                  {opt}
                </div>
              ))}
            </div>
            <p style={{ color: resultColor }}>{resultMessage}</p>
            <button className="main-btn" disabled={selectedOptionIndex === null} onClick={submitAnswer}>
              Submit Answer
            </button>
          </div>
        ) : (
          <div id="quiz-results">
            <h2>Project Exported!</h2>
            <p>Your Rank: <strong>{score === quizData.length ? "Master Editor 👑" : "Rising Star ⭐"}</strong></p>
            <p style={{ color: "#E06B80", fontSize: "1.5rem" }}>{score} / {quizData.length}</p>
            <button className="main-btn" onClick={restartQuiz}>Restart Quiz</button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AboutPage;
