import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CourseCard.css';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        localStorage.setItem('courseId', course.course.id);
        navigate("/exams");
    };

    return (
        <div className="course-card" onClick={handleCardClick}>
            <div className="course-info">
                <p className="course-code">{course.course.shortcut}</p>
                <p className="course-semester">{course.semester}</p>
            </div>
            <p className="course-title">{course.course.title}</p>
        </div>
    );
};

export default CourseCard;
