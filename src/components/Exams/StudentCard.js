import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StudentCard.css';

const StudentCard = ({ student }) => {
    const navigate = useNavigate();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        setPercentage(student.score / student.exam.max_points * 100);
    }, []);

    const handleClick = () => {
        navigate(`/completed_exam/${student.id}`);
    };

    return (
        // <div className="student-header">
        //     <div onClick={handleClick} className="student-preview">
        //         {index + 1}. {localQuestion.text}
        //     </div>
        //     <div className="student-type">{getFormatedQuestionType()}</div>
        // </div>
        <div className="student-card" onClick={handleClick}>
            <p className="student-title">{student.student.name} {student.student.surname}</p>
            <div className="student-info">
                {student.score ? 
                <div className="student-type">{student.score} ({percentage.toFixed(2)}%)</div>
                :
                <div className="student-type">brak wyniku</div>
                }
            </div>
        </div>
    );
};

export default StudentCard;


