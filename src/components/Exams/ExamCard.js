import React from 'react';
import '../../styles/ExamCard.css';

const ExamCard = ({ exam }) => (
    <p className="exam-card">
        <p className="exam-title">{exam.title}</p>
        <div className="exam-info">
            <p className="exam-date">Data rozpoczęcia: {exam.start_date}</p>
            <p className="exam-date">Data zakończenia: {exam.end_date}</p>
        </div>
    </p>
);

export default ExamCard;
