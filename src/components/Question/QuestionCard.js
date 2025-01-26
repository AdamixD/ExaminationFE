import React, {useEffect, useState} from 'react';
import '../../styles/QuestionCard.css';
import {updateQuestion, createQuestion} from '../../services/questionService';
import {updateQuestionItem, createQuestionItem, deleteQuestionItem} from '../../services/questionItemService';

const QuestionCard = ({ index, question, examType, examStatus, token, onUpdate, onDelete, isNew }) => {
    const [localQuestion, setLocalQuestion] = useState({ ...question });
    const [isEditing, setIsEditing] = useState(false);
    const [originalQuestion, setOriginalQuestion] = useState({ ...question });
    const [questionItemsToDelete, setQuestionItemsToDelete] = useState([]);

    useEffect(() => {
        setQuestionItemsToDelete([]);
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

    const handleQuestionTextChange = (e) => {
        setLocalQuestion({ ...localQuestion, text: e.target.value });
    };

    const handleQuestionCorrectnessChange = (idx) => {
        const updatedQuestionItems = localQuestion.question_items.map((questionItem, index) => {
            if (idx === index) {
                return { ...questionItem, correctness: !questionItem.correctness };
            }
            return questionItem;
        });
        setLocalQuestion({ ...localQuestion, question_items: updatedQuestionItems });
    };

    const handleQuestionScoreTypeChange = (type) => {
        setLocalQuestion({ ...localQuestion, score_type: type });
    };

    const handleQuestionScoreChange = (e) => {
        setLocalQuestion({ ...localQuestion, score: parseInt(e.target.value, 10) });
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

    const handleQuestionTypeChange = () => {
        const newType = determineQuestionType(localQuestion.question_items);
        return { ...localQuestion, type: newType };
    };

    const getQuestionType = () => {
        return determineQuestionType(localQuestion.question_items);
    };

    const getFormatedQuestionType = () => {
        const questionType = getQuestionType()
        if (questionType === 'OPEN') {
            return 'Otwarte';
        } else if (questionType === 'SINGLE') {
            return 'Jednokrotnego wyboru';
        } else {
            return 'Wielokrotnego wyboru';
        }
    };

    const getFormatedScoreType = (scoreType) => {
        if (scoreType === 'FULL') {
            return 'Pełna poprawność';
        } else if (scoreType === 'PROPORTIONAL') {
            return 'Proporcjonalne';
        } else {
            return 'nieznany'
        }
    }

    const handleQuestionItemChange = (text, idx) => {
        const updatedQuestionItems = localQuestion.question_items.map((questionItem, index) => {
            if (idx === index) {
                return { ...questionItem, text: text };
            }
            return questionItem;
        });
        setLocalQuestion({ ...localQuestion, question_items: updatedQuestionItems });
    };

    const handleAddQuestionItem = () => {
        if (localQuestion.question_items.some(questionItem => questionItem.text === '')) {
            alert("Proszę najpierw uzupełnić wszystkie istniejące odpowiedzi.");
            return;
        }
        const newQuestionItem = {
            text: '',
            image: null,
            correctness: false,
            question_id: question.id,
        };
        setLocalQuestion({
            ...localQuestion,
            question_items: [...localQuestion.question_items, newQuestionItem]
        });
    };

    const handleRemoveQuestionItem = (idx) => {
        const itemToRemove = localQuestion.question_items[idx];
        if (itemToRemove && itemToRemove.id) {
            setQuestionItemsToDelete([...questionItemsToDelete, itemToRemove.id]);
        }
        const filteredQuestionItems = localQuestion.question_items.filter((_, index) => index !== idx);
        setLocalQuestion({ ...localQuestion, question_items: filteredQuestionItems });
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

    const handleQuestionSave = async () => {
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
                ...questionItemsToDelete.map(id => deleteQuestionItem(id, token))
            ]);

            onUpdate(currentQuestion);
            setIsEditing(false);
            setQuestionItemsToDelete([]);
            if (isNew) {
                setLocalQuestion({ text: '', question_items: [] });
            }
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };

    const handleQuestionDelete = () => {
        if (window.confirm("Czy na pewno chcesz usunąć to pytanie?")) {
            onDelete();
        }
    };

    if (isNew && !isEditing) {
        return (
            <button type="button" onClick={handleToggleEdit} className="question-add-button">Dodaj {examType === "TEST" ? "pytanie" : "zadanie"}</button>
        )
    }
    else {
        return (
            <div className="question-card">
                {isEditing ? (
                    <form onSubmit={e => e.preventDefault()} className="question-details">
                        <div className="question-header">
                            {examStatus !== 'ASSIGNED' ? <input type="text" value={localQuestion.text} onChange={handleQuestionTextChange} className="question-text"/>
                            : <p className="question-text">{localQuestion.text}</p>}
                            <div className="question-type">{getFormatedQuestionType(getQuestionType())}</div>
                        </div>
                        {examType === "TEST" && (
                            <div className="question-items-form">
                                <div className="question-items">
                                    {localQuestion.question_items.map((questionItem, idx) => (
                                        <div key={idx} className="question-item">
                                            {examStatus !== 'ASSIGNED' ? <input type="text" value={questionItem.text} onChange={(e) => handleQuestionItemChange(e.target.value, idx)} className="question-item-input-text"/>
                                            : <div className="question-item-input-text">{questionItem.text}</div>}
                                            <button type="button" onClick={() => handleQuestionCorrectnessChange(idx)} className={`question-item-correctness-button ${questionItem.correctness ? 'true' : 'false'}`}>{questionItem.correctness ? 'Prawda' : 'Fałsz'}</button>
                                            {examStatus !== 'ASSIGNED' && <button type="button" onClick={() => handleRemoveQuestionItem(idx)} className="question-item-delete-button">Usuń</button>}
                                        </div>
                                    ))}
                                </div>
                                {examStatus !== 'ASSIGNED' && <button type="button" onClick={handleAddQuestionItem} className="question-items-form-button">Dodaj odpowiedź</button>}
                            </div>
                        )}
                        <div className="question-score-type">
                            <label>Ocenianie</label>
                            {examStatus !== 'ASSIGNED' ? <div className="question-score-type-items">
                                {getQuestionType() !== 'OPEN' ? (
                                    <label><input type="radio" checked={localQuestion.score_type === 'FULL'} onChange={() => handleQuestionScoreTypeChange('FULL')} className="question-score-type-item"/> Pełna poprawność</label>
                                    ) : null
                                }
                                <label><input type="radio" checked={localQuestion.score_type === 'PROPORTIONAL'} onChange={() => handleQuestionScoreTypeChange('PROPORTIONAL')} className="question-score-type-item"/> Proporcjonalne</label>
                            </div> :
                            <p>{getFormatedScoreType(localQuestion.score_type)}</p>}
                        </div>
                        {examStatus !== 'ASSIGNED' ? <label>Liczba punktów: <input type="number" value={localQuestion.score} onChange={handleQuestionScoreChange} min="1" className="question-score"/></label>
                         : <p>Liczba punktów: {localQuestion.score}</p>}
                        <div className="question-form-buttons">
                            <button type="button" onClick={handleQuestionSave} className="question-form-button">Zapisz</button>
                            <button type="button" onClick={handleToggleEdit} className="question-form-button">Anuluj</button>
                            {examStatus !== 'ASSIGNED' && <button type="button" onClick={handleQuestionDelete} className="question-form-button">Usuń</button>}
                        </div>
                    </form>
                ) : (
                    <div className="question-header">
                        <div onClick={handleToggleEdit} className="question-preview">
                            {index + 1}. {localQuestion.text}
                        </div>
                        <div className="question-type">{getFormatedQuestionType()}</div>
                    </div>
                )}
            </div>
        );
    }
};

export default QuestionCard;

