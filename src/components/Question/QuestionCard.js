import React, {useEffect, useState} from 'react';
import '../../styles/QuestionCard.css';
import {updateQuestion, createQuestion} from '../../services/questionService';
import {updateQuestionItem, createQuestionItem, deleteQuestionItem} from '../../services/questionItemService';

const QuestionCard = ({ question, index, token, onUpdate, onDelete, isNew }) => {
    const [localQuestion, setLocalQuestion] = useState({ ...question });
    const [isEditing, setIsEditing] = useState(false);
    const [originalQuestion, setOriginalQuestion] = useState({ ...question });
    const [itemsToDelete, setItemsToDelete] = useState([]);

    useEffect(() => {
        setItemsToDelete([]);
        if (isNew) {
            setLocalQuestion(question);
            setIsEditing(false);
        }
    }, [question, isNew]);

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
        const newAnswer = {
            text: '',
            image: null,
            correctness: false,
            question_id: question.id,
        };
        setLocalQuestion({
            ...localQuestion,
            question_items: [...localQuestion.question_items, newAnswer]
        });
    };

    const handleRemoveAnswer = (idx) => {
        const itemToRemove = localQuestion.question_items[idx];
        if (itemToRemove && itemToRemove.id) {
            setItemsToDelete([...itemsToDelete, itemToRemove.id]);
        }
        const filteredAnswers = localQuestion.question_items.filter((_, index) => index !== idx);
        setLocalQuestion({ ...localQuestion, question_items: filteredAnswers });
    };

    const handleScoringChange = (type) => {
        setLocalQuestion({ ...localQuestion, score_type: type });
    };

    const handlePointsChange = (e) => {
        setLocalQuestion({ ...localQuestion, score: parseInt(e.target.value, 10) });
    };

    const handleSave = async () => {
        const updatedQuestion = handleQuestionTypeChange();
        if (updatedQuestion.type === 'OPEN') {
            updatedQuestion.score_type = "PROPORTIONAL";
        }
        if (!validateForm()) return;

        try {
            let currentQuestion;
            if (isNew) {
                currentQuestion = await createQuestion(updatedQuestion, token);
            } else {
                currentQuestion = await updateQuestion(updatedQuestion.id, updatedQuestion, token);
            }

            currentQuestion.question_items = updatedQuestion.question_items;

            await Promise.all([
                ...currentQuestion.question_items.map(item =>
                    item.id ? updateQuestionItem(item.id, item, token) : createQuestionItem({ ...item, question_id: currentQuestion.id }, token)
                ),
                ...itemsToDelete.map(id => deleteQuestionItem(id, token))
            ]);

            onUpdate(currentQuestion);
            setIsEditing(false);
            setItemsToDelete([]);
            if (isNew) {
                setLocalQuestion({ text: '', question_items: [] });
            }
        } catch (error) {
            console.error('Error saving question:', error);
        }
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

    const determineQuestionType = (questionItems) => {
        const correctAnswers = questionItems.filter(answer => answer.correctness).length;
        if (questionItems.length === 0) {
            return 'OPEN';
        } else if (correctAnswers === 1) {
            return 'SINGLE';
        } else {
            return 'MULTI';
        }
    };

    const handleQuestionTypeChange = () => {
        const newType = determineQuestionType(localQuestion.question_items);
        return { ...localQuestion, type: newType };
    };

    const getQuestionType = () => {
        return determineQuestionType(localQuestion.question_items);
    };

    const handleDelete = () => {
        if (window.confirm("Czy na pewno chcesz usunąć to pytanie?")) {
            onDelete();
        }
    };

    if (isNew && !isEditing) {
        return (
            <button type="button" onClick={handleToggleEdit} className="form-button">Dodaj pytanie</button>
        )
    }
    else {

        return (
            <div className="question-card">
                {isEditing ? (
                    <form onSubmit={e => e.preventDefault()} className="question-details">
                        <textarea value={localQuestion.text} onChange={handleTextChange}/>
                        {localQuestion.question_items.map((answer, idx) => (
                            <div key={idx} className="answer">
                                <input type="text" value={answer.text}
                                       onChange={(e) => handleAnswerChange(e.target.value, idx)}/>
                                <button type="button" onClick={() => handleToggleCorrect(idx)}
                                        className={`answer-correctness-button ${answer.correctness ? 'true' : 'false'}`}>
                                    {answer.correctness ? 'Prawda' : 'Fałsz'}
                                </button>
                                <button type="button" onClick={() => handleRemoveAnswer(idx)}
                                        className="answer-delete-button">Usuń
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddAnswer}>Dodaj odpowiedź</button>
                        <div>
                            {getQuestionType() !== 'OPEN' ? (
                                <label>
                                    <input
                                        type="radio"
                                        checked={localQuestion.score_type === 'FULL'}
                                        onChange={() => handleScoringChange('FULL')}
                                    /> Pełna poprawność
                                </label>
                            ) : null
                            }
                            <label>
                                <input
                                    type="radio"
                                    checked={localQuestion.score_type === 'PROPORTIONAL'}
                                    onChange={() => handleScoringChange('PROPORTIONAL')}
                                /> Proporcjonalne
                            </label>
                        </div>
                        <input type="number" value={localQuestion.score} onChange={handlePointsChange} min="1"/>
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
    }
};

export default QuestionCard;

