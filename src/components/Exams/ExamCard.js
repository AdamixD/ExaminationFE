import React from 'react';
import '../../styles/ExamCard.css';

const ExamCard = ({ exam }) => {
    return (
        <button className="exam-card">
            <div className="exam-info">
                <p className="exam-data-item">Status egzaminu: {exam.status}</p>
                <p className="exam-data-item">Data rozpoczęcia: {exam.start_date}</p>
                <p className="exam-data-item">Data zakończenia: {exam.end_date}</p>
                <p className="exam-data-item">Czas na rozwiązanie: {exam.duration_limit}</p>
            </div>
        </button>
    );
};

export default ExamCard;
