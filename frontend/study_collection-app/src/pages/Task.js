import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import '../assets/css/pages/Task.css';

import MultiAnswerQuizz from '../reusable/MultiAnswerQuizz.js';
import GoNextButton from '../reusable/GoNextButton.js';
import LikertQuestion from '../reusable/LikertQuestion.js';

import { surveyQuestions } from '../constants.js';

function Story({ story, displayExercise }) {
    const [button, setButton] = useState(true);
    const handleGoNext = () => {
        displayExercise();
        setButton(false);
    };
    return (
        <div className='story'>
            <h2>Story</h2>
            <p>{story}</p>
            {button && (
                <GoNextButton onClick={handleGoNext} text={"See the exercises"}/>
            )}
        </div>
    );
}

function Exercise({ exercise, submit }) {
    const [userAnswers, setUserAnswers] = useState({});
    const handleUserAnswers = (question, answer) => {
        if (userAnswers[question] === answer) return;
        setUserAnswers(prevAnswers => ({ ...prevAnswers, [question]: answer }));
    };

    return (
        <div className='exercises'>
            <h2>Exercise</h2>
            {exercise.map(({ question, options, _ }, index) => (
                <MultiAnswerQuizz key={index}
                    question={question}
                    answers={options}
                    handleUserAnswer={(answer) => handleUserAnswers(question, answer)}
                />
            ))}
            <GoNextButton onClick={exercise.every(({ question }) => question in userAnswers) ? submit:null} text={"Submit your answers"}/>
        </div>
    );
}

function Survey({onClick}) {
    const [userAnswers, setUserAnswers] = useState({});
    const handleUserAnswers = (question, answer) => {
        if (userAnswers[question] === answer) return;
        setUserAnswers(prevAnswers => ({ ...prevAnswers, [question]: answer }));
    };
    return (
        <div className='survey'>
            <h2>Survey</h2>
            {surveyQuestions.map((question, index) => (
                <LikertQuestion key={index} 
                    question={question} 
                    handleUserAnswer={(answer) => handleUserAnswers(question, answer)}
                />
            ))}
            <GoNextButton onClick={surveyQuestions.every((question)=>question in userAnswers)?onClick:null} text={"Finish Task"}/>
        </div>
    );
}

export default function Task() {
    const location = useLocation();
    const { stories, exercises } = location.state||{};
    const [story, setStory] = useState('');
    const [exercise, setExercise] = useState([]);
    const [displayExercise, setDisplayExercise] = useState(true);
    const [displayStory, setDisplayStory] = useState(false);
    const [displaySurvey, setDisplaySurvey] = useState(false);
    const [taskNumber, setTaskNumber] = useState(0);
    const navigate = useNavigate();

    const handlePostSubmit = () => {
        setDisplayExercise(false);
        setDisplayStory(true);
    };
    const handlePastSubmit = () => {
        setDisplayExercise(false);
        setDisplayStory(false);
        setDisplaySurvey(true);
    };

    const resetPage = () => {
        if (taskNumber >= stories.length - 1) {
            navigate('/interview');
            return;
        };
        // Restart the cycle and increment the task number
        setDisplayStory(false);
        setDisplaySurvey(false);
        setDisplayExercise(true);
        setTaskNumber(taskNumber+1);
    };

    const chooseStoryAndExercise = () => {
        // Ensure the task number is valid before setting state
        setStory(stories[taskNumber]);
        setExercise(exercises[taskNumber]);
    };

    useEffect(() => {
        // Only call chooseStoryAndExercise if the stories and exercises have been set or when the task number changes
        chooseStoryAndExercise();
    }, [taskNumber]);

    return (
        <div>
            <h1>Task {taskNumber + 1}</h1>
            {displayExercise && !displayStory && ( // Pre test without the story
                <Exercise exercise={exercise ? exercise : []} submit={handlePostSubmit}/>
            )}
            {displayStory && (
                <Story story={story} displayExercise={() => setDisplayExercise(true)} />
            )}
            {displayExercise && displayStory && ( //Post test with the story
                <Exercise exercise={exercise} submit={handlePastSubmit}/>
            )}
            {displaySurvey && (
                <Survey surveyQuestions={surveyQuestions} onClick={resetPage} />  
            )}
        </div>
    );
}