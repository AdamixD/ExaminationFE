import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from "moment/moment";
import '../../styles/ExamCard.css';

const ExamCard = ({ exam }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/exam/${exam.id}`);
    };

    return (
        <div className="exam-card" onClick={handleClick}>
            <p className="exam-title">{exam.title}</p>
            <div className="exam-info">
                <p className="exam-date">Data rozpoczęcia: {moment(exam.start_date).format('DD-MM-YYYY HH:mm:ss')}</p>
                <p className="exam-date">Data zakończenia: {moment(exam.end_date).format('DD-MM-YYYY HH:mm:ss')}</p>
            </div>
        </div>
    );
};

export default ExamCard;
