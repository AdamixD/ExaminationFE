import React from 'react';
import FinishedQuestionCard from './FinishedQuestionCard';
import '../../styles/FinishedQuestionsList.css';

const QuestionList = ({ token, exam_student }) => {

    return (
        <div className="question-list">
            {exam_student.questions.map((question, index) => (
                <FinishedQuestionCard
                    index={index}
                    exam_student = {exam_student}
                    key={question.id}
                    question={question}
                    token={token}
                />))}
        </div>
    );
};

export default QuestionList;
