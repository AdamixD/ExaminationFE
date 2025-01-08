import React, {useState} from 'react';
import '../../styles/StudentQuestionCard.css';
import { createAnswer, updateAnswer } from '../../services/studentQuestionService';

const StudentQuestionCard = ({ index, question, examType, token, onSave}) => {
    const [isEditing, setIsEditing] = useState(true);
    const [answers, setAnswers] = useState(Array(question.question_items.length).fill(false));
    const [openAnswer, setOpenAnswer] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [answerID, setAnswerID] = useState(null);

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const determineQuestionType = (questionItems) => {
        const correctQuestionItems = questionItems.filter(questionItem => questionItem.correctness).length;
        if (questionItems.length === 0) {
            return 'OPEN';
        } else if (correctQuestionItems === 1) {
            return 'SINGLE';
        } else {
            return 'MULTI';
        }
    };

    const handleAnswerItemChange = (idx) => {
        const tempAnswers = answers.map((ans, i) => { return i === idx ? !ans : ans; });
          setAnswers(tempAnswers);
    };

    const handleAnswerSave = async () => {
        if (determineQuestionType(question.question_items) === 'OPEN')
        {
            var answer = openAnswer;
        }
        else
        {
            var answer = ""
            for (let i = 0; i < answers.length; i++)
                answer += answers[i] ? "T" : "F";
        }
        // todo exam_student_id
        let answerData = {score: 0, comment: null, answer: answer, exam_student_id: 3, question_id: question.id};
        if (!isAnswered)
        {
            let answer_id = await createAnswer(answerData);
            setAnswerID(answer_id);
            setIsAnswered(true);
            onSave();
        }
        else
        {
            updateAnswer(answerID, answerData);
        }
        handleToggleEdit();
    };

    return (
        <div className="question-card">
            {isEditing ? (
                <form onSubmit={e => e.preventDefault()} className="question-details">
                    <div className="question-header">
                        <div className="question-text">{index + 1}. {question.text}</div>
                        <div className="question-type">Punkty: {question.score}</div>
                    </div>
                    {examType === "TEST" && (
                        <div className="question-items-form">
                            <div className="question-items">
                                {question.question_items.map((questionItem, idx) => (
                                    <div key={idx} className="question-item">
                                        <input type="checkbox"  onClick={() => handleAnswerItemChange(idx)} className="question-item-correctness-button"/>
                                        <p>{questionItem.text}</p>
                                    </div>
                                ))}
                            </div>
                            {(determineQuestionType(question.question_items) === 'OPEN') &&
                                <>
                                    <p>Odpowiedź:</p>
                                    <input type="text" value={openAnswer} onChange={(e) => setOpenAnswer(e.target.value)} className="question-text"/>
                                </>}
                        </div>
                    )}
                    <div className="question-form-buttons">
                        <button type="button" onClick={handleAnswerSave} className="question-form-button">Zapisz</button>
                        <button type="button" onClick={handleToggleEdit} className="question-form-button">Zwiń</button>
                    </div>
                </form>
            ) : (
                <div className="question-header">
                    <div onClick={handleToggleEdit} className="question-preview">
                        {index + 1}. {question.text}
                    </div>
                    <div className="question-type">Punkty: {question.score}</div>
                </div>
            )}
        </div>
    );
};

export default StudentQuestionCard;

