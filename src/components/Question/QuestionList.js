import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import StudentQuestionCard from './StudentQuestionCard';
import { getExamQuestions, deleteQuestion } from '../../services/questionService';
import '../../styles/QuestionList.css';

const QuestionList = ({ examId, examType, token, handleSaveQuestion }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem('userRole');

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

    const handleUpdateQuestions = () => {
        fetchQuestions();
    };
    
    const handleDeleteQuestion = async (questionId) => {
        try {
            await deleteQuestion(questionId, token);
            setQuestions(questions.filter(question => question.id !== questionId));
        } catch (error) {
            console.error('Error deleting question', error);
            alert('Error deleting question: ' + error.message);
        }
    };

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error fetching questions: {error}</div>;

    if (questions.length === 0) {
        return (
            <div className="question-list">
                <p>Brak zdefiniowanych {examType === "TEST" ? "pytań" : "zadań"} dla tego egzaminu.</p>
                {(userRole === "LECTURER") && (<QuestionCard
                    question={{ text: '', image: null, question_items: [], score_type: 'FULL', score: 1, exam_id: examId }}
                    examType={examType}
                    token={token}
                    onUpdate={handleUpdateQuestions}
                    isNew={true}
                />)}
            </div>
        );
    }
    else {
        return (
            <div className="question-list">
                {(userRole === "LECTURER") ? 
                    questions.map((question, index) => (
                        <QuestionCard
                            index={index}
                            key={question.id}
                            question={question}
                            examType={examType}
                            token={token}
                            onDelete={() => handleDeleteQuestion(question.id)}
                            onUpdate={handleUpdateQuestions}
                            isNew={false}
                        />)) :
                    questions.map((question, index) => (
                        <StudentQuestionCard
                            index={index}
                            key={question.id}
                            question={question}
                            examType={examType}
                            token={token}
                            onSave={handleSaveQuestion}
                        />))
                }
                {(userRole === "LECTURER") && <QuestionCard
                    question={{ text: '', image: null, question_items: [], score_type: 'FULL', score: 1, exam_id: examId }}
                    examType={examType}
                    token={token}
                    onUpdate={handleUpdateQuestions}
                    isNew={true}
                />}
            </div>
        );
    }
};

export default QuestionList;
