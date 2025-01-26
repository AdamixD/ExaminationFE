import React from 'react';
import StudentCard from './StudentCard';

const StudentList = ({ student_exams }) => {
    // console.info(student_exams);
    return (
        <div>
            { (student_exams.length > 0) ?
            (student_exams.map((student_exam, index) => (
                //<p key={index}>{index + 1}. {student.student.name} - {student.score || 'brak wyniku'}</p>
                <StudentCard student_exam={student_exam} />
            ))) : null}
        </div>
    );
};

export default StudentList;
