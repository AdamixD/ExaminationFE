import React from 'react';
import StudentCard from './StudentCard';

const StudentList = ({ students }) => {
    console.info(students);
    return (
        <div>
            { (students.length > 0) ?
            (students.map((student, index) => (
                //<p key={index}>{index + 1}. {student.student.name} - {student.score || 'brak wyniku'}</p>
                <StudentCard student={student} />
            ))) : null}
        </div>
    );
};

export default StudentList;
