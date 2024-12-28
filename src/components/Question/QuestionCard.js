import React, { useState } from 'react';
import '../../styles/QuestionCard.css';

const QuestionCard = ({ question, index, onUpdate, onDelete }) => {
    const [localQuestion, setLocalQuestion] = useState({ ...question, scoringType: 'full', points: 3 });
    const [isEditing, setIsEditing] = useState(false);
    const [originalQuestion, setOriginalQuestion] = useState({ ...question });

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setOriginalQuestion({ ...localQuestion });
        } else {
            setLocalQuestion({ ...originalQuestion });
        }
    };

    const handleTextChange = (e) => {
        setLocalQuestion({ ...localQuestion, text: e.target.value });
    };

    const handleAnswerChange = (text, idx) => {
        const updatedAnswers = localQuestion.question_items.map((answer, index) => {
            if (idx === index) {
                return { ...answer, text: text };
            }
            return answer;
        });
        setLocalQuestion({ ...localQuestion, question_items: updatedAnswers });
    };

    const handleToggleCorrect = (idx) => {
        const updatedAnswers = localQuestion.question_items.map((answer, index) => {
            if (idx === index) {
                return { ...answer, correctness: !answer.correctness };
            }
            return answer;
        });
        setLocalQuestion({ ...localQuestion, question_items: updatedAnswers });
    };

    const handleAddAnswer = () => {
        if (localQuestion.question_items.some(answer => answer.text === '')) {
            alert("Proszę najpierw uzupełnić wszystkie istniejące odpowiedzi.");
            return;
        }
        const newAnswer = { text: '', correctness: false };
        setLocalQuestion({
            ...localQuestion,
            question_items: [...localQuestion.question_items, newAnswer]
        });
    };

    const handleRemoveAnswer = (idx) => {
        const filteredAnswers = localQuestion.question_items.filter((_, index) => index !== idx);
        setLocalQuestion({ ...localQuestion, question_items: filteredAnswers });
    };

    const handleScoringChange = (type) => {
        setLocalQuestion({ ...localQuestion, scoringType: type });
    };

    const handlePointsChange = (e) => {
        setLocalQuestion({ ...localQuestion, points: parseInt(e.target.value, 10) });
    };

    const handleSave = () => {
        if (!validateForm()) return;
        onUpdate(index, localQuestion);
        setIsEditing(false);
    };

    const validateForm = () => {
        if (!localQuestion.text) {
            alert("Treść pytania musi być zdefiniowana.");
            return false;
        }
        if (localQuestion.question_items.some(item => !item.text)) {
            alert("Wszystkie odpowiedzi muszą być zdefiniowane.");
            return false;
        }
        return true;
    };

    const getQuestionType = () => {
        const correctAnswers = localQuestion.question_items.filter(answer => answer.correctness).length;
        if (localQuestion.question_items.length === 0) {
            return 'OPEN';
        } else if (correctAnswers === 1) {
            return 'SINGLE';
        } else {
            return 'MULTI';
        }
    };

    const handleDelete = () => {
        if (window.confirm("Czy na pewno chcesz usunąć to pytanie?")) {
            onDelete();
        }
    };

    return (
        <div className="question-card">
            {isEditing ? (
                <form onSubmit={e => e.preventDefault()} className="question-details">
                    <textarea value={localQuestion.text} onChange={handleTextChange} />
                    {localQuestion.question_items.map((answer, idx) => (
                        <div key={idx} className="answer">
                            <input type="text" value={answer.text} onChange={(e) => handleAnswerChange(e.target.value, idx)}/>
                            <button type="button" onClick={() => handleToggleCorrect(idx)} className={`answer-correctness-button ${answer.correctness ? 'true' : 'false'}`}>
                                {answer.correctness ? 'Prawda' : 'Fałsz'}
                            </button>
                            <button type="button" onClick={() => handleRemoveAnswer(idx)} className="answer-delete-button">Usuń</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAnswer}>Dodaj odpowiedź</button>
                    <div>
                        <label>
                            <input
                                type="radio"
                                checked={localQuestion.scoringType === 'full'}
                                onChange={() => handleScoringChange('full')}
                            /> Pełna poprawność
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={localQuestion.scoringType === 'proportional'}
                                onChange={() => handleScoringChange('proportional')}
                            /> Proporcjonalne
                        </label>
                    </div>
                    <input type="number" value={localQuestion.points} onChange={handlePointsChange} min="1" />
                    <div className="form-buttons">
                        <button type="button" onClick={handleSave} className="form-button">Zapisz</button>
                        <button type="button" onClick={handleToggleEdit} className="form-button">Anuluj</button>
                        <button type="button" onClick={handleDelete} className="form-button-delete">Usuń</button>
                    </div>
                    <p>Typ pytania: {getQuestionType()}</p>
                </form>
            ) : (
                <div onClick={handleToggleEdit} className="question-preview">
                    {index + 1}. {localQuestion.text} (Typ: {getQuestionType()})
                </div>
            )}
        </div>
    );
};

export default QuestionCard;

