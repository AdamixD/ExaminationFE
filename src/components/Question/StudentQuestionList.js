import React, { useState, useEffect } from 'react';
import StudentQuestionCard from './StudentQuestionCard';
import { getExamQuestions } from '../../services/questionService';
import '../../styles/QuestionList.css';

const QuestionList = ({ questions, examType, token, handleSaveQuestion, examStudentId }) => {
    
    return (
        <div className="question-list">
            {questions.map((question, index) => (
                <StudentQuestionCard
                    examStudentId={examStudentId}
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
