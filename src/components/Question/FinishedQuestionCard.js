import React, {useState, useEffect} from 'react';
import '../../styles/FinishedQuestionCard.css';
import { updateResult } from '../../services/studentQuestionService';

const FinishedQuestionCard = ({ index, question, token, exam_student}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState("");
    const [answer, setAnswer] = useState("");
    const [score, setScore] = useState(0);
    const userRole = localStorage.getItem('userRole');
    
    const fetchAnswerAndScore = async () => {
        for (var i = 0; i < exam_student.question_results.length; i++)
        {
            let temp_result = exam_student.question_results[i]
            let position = temp_result.answer.indexOf(": ");
            if (temp_result.answer.slice(0, position) === String(question.id))
            {
                setAnswer(temp_result.answer.slice(position + 2));
                setScore(temp_result.score);
                if (temp_result.comment !== "") setComment(temp_result.comment); 
                break;
            }
        }

    };

    useEffect(() => {
        fetchAnswerAndScore();
    }, [question, token,]);

    const handleToggleEdit = () => {
        if (isEditing)
        {
            for (var i = 0; i < exam_student.question_results.length; i++)
            {
                let position = exam_student.question_results[i].answer.indexOf(": ");
                if (exam_student.question_results[i].answer.slice(0, position) === String(question.id))
                {
                    let result_data = {score: score, comment: comment, exam_student_id: exam_student.id, answer: exam_student.question_results[i].answer};
                    updateResult(exam_student.question_results[i].id, result_data, token);
                    break;
                }
            }
        }

        setIsEditing(!isEditing);
    };

    return (
        <div className="question-card">
            <div className="question-header">
                <div className="question-text">{index + 1}. {question.text}</div>
                {isEditing ?
                    <input type="text" value={score} onChange={(e) => setScore(e.target.value)} className="question-score-form"/>
                :
                    <div className="f-question-type">Punkty: {score}/{question.score}</div>
                }
            </div>
            <div className="question-items-form">
                {(question.question_items.length === 0) ?
                    <>
                        <p>Odpowiedź:</p>
                        <div className="answer-box"> <p className="answer-content">{answer}</p></div>
                    </>
                :
                <div className="question-items">
                    {question.question_items.map((questionItem, idx) => (
                        <div key={idx} className="question-item">
                            <input type="checkbox" checked={answer[idx] === "T"} className="question-item-correctness-button"/>
                            <p>{questionItem.text}</p>
                        </div>
                    ))}
                </div>
                }
            </div>

            {isEditing ?
                <>
                    <p className="question-items-form">Komentarz prowadzącego:</p>
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="question-text"/>
                </>
            :
                comment !== "" && comment !== null && <>
                    <p className="question-items-form">Komentarz prowadzącego:</p>
                    <div className="comment-box">
                        <p className="comment-content">{comment}</p>
                    </div>
                </>
            }
            {userRole === "LECTURER" &&
                <button type="button" onClick={handleToggleEdit} className="question-form-button">{isEditing ? "Zapisz" : "Edytuj ocenę"}</button>}
        </div>
    );
};

export default FinishedQuestionCard;

