import React from 'react';

const StudentList = ({ students }) => {
    return (
        <div>
            <h2>Studenci</h2>
            {students.map((student, index) => (
                <p key={index}>{index + 1}. {student.name} - {student.score || 'brak wyniku'}</p>
            ))}
        </div>
    );
};

export default StudentList;
