import React from 'react';
import '../../styles/CourseCard.css';

const CourseCard = ({ course }) => {
    return (
        <div className="course-card">
            <div className="course-info">
                <p className="course-code">{course.course.shortcut}</p>
                <p className="course-semester">{course.semester}</p>
            </div>
            <p className="course-title">{course.course.title}</p>
        </div>
    );
};

export default CourseCard;
