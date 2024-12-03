import React from 'react';
import '../../styles/ExamCard.css';

const ExamCard = ({ exam }) => {
    return (
        <div className="exam-card">
            <div className="exam-info">
                <p className="exam-code">{exam.course.shortcut}</p>
                <p>xd</p>
                <p className="exam-semester">{exam.semester}</p>
            </div>
            <p className="exam-title">{exam.course.title}</p>
        </div>
    );
};

export default ExamCard;
