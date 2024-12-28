import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { getExamQuestions, deleteQuestion } from '../../services/questionService';
import '../../styles/QuestionList.css';

const QuestionList = ({ examId, token }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [token, examId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await getExamQuestions(token, examId);
            setQuestions(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching exam questions', err);
            setError(err.toString());
            setLoading(false);
        }
    };

    const handleDelete = async (questionId) => {
        try {
            await deleteQuestion(questionId, token);
            const updatedQuestions = questions.filter(question => question.id !== questionId);
            setQuestions(updatedQuestions);
        } catch (error) {
            console.error('Failed to delete question', error);
        }
    };

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error fetching questions: {error}</div>;

    if (questions.length === 0) {
        return (
            <div className="question-list">
                <p>Brak zdefiniowanych pytań dla tego egzaminu.</p>
            </div>
        );
    }

    return (
        <div className="question-list">
            {questions.map((question, index) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onDelete={() => handleDelete(question.id)}
                />
            ))}
        </div>
    );
};

export default QuestionList;
