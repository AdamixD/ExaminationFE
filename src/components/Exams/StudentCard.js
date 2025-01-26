import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/StudentCard.css';

const StudentCard = ({ student_exam }) => {
    const navigate = useNavigate();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // console.info(student_exam.score)
        setPercentage(student_exam.score / student_exam.exam.max_points * 100);
    }, []);

    const handleClick = () => {
        navigate(`/completed_exam/${student_exam.id}`);
    };

    return (
        // <div className="student-header">
        //     <div onClick={handleClick} className="student-preview">
        //         {index + 1}. {localQuestion.text}
        //     </div>
        //     <div className="student-type">{getFormatedQuestionType()}</div>
        // </div>
        <div className="student-card" onClick={handleClick}>
            <p className="student-title">{student_exam.student.name} {student_exam.student.surname}</p>
            <div className="student-info">
                {student_exam.score != null ? 
                <div className="student-type">{student_exam.score} ({percentage.toFixed(2)}%)</div>
                :
                <div className="student-type">brak wyniku</div>
                }
            </div>
        </div>
    );
};

export default StudentCard;


