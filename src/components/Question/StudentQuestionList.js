import React, { useState, useEffect } from 'react';
import StudentQuestionCard from './StudentQuestionCard';
import { getExamQuestions } from '../../services/questionService';
import '../../styles/QuestionList.css';

const QuestionList = ({ examId, examType, token, handleSaveQuestion }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await getExamQuestions(examId, token);
            setQuestions(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching questions', err);
            setError(err.toString());
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [examId, token,]);

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error fetching questions: {error}</div>;
    
    return (
        <div className="question-list">
            {questions.map((question, index) => (
                <StudentQuestionCard
                    index={index}
                    key={question.id}
                    question={question}
                    examType={examType}
                    token={token}
                    onSave={handleSaveQuestion}
                />))}
        </div>
    );
};

export default QuestionList;
