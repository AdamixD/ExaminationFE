import React from 'react';
import '../../styles/CourseCard.css';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    let navigate = useNavigate();
    return (
        <button className="course-card" onClick={() => {navigate('/courses/' + course.course.shortcut)}}>
            <div className="course-info">
                <p className="course-code">{course.course.shortcut}</p>
                <p className="course-semester">{course.semester}</p>
            </div>
            <p className="course-title">{course.course.title}</p>
        </button>
    );
};

export default CourseCard;
