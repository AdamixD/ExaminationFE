import React from 'react';

const StudentList = ({ students }) => {
    if (students.length === 0 || students === null) {
        return (
            <div className="question-list">
                <p>Do egzaminu nie przypisano jeszcze żadnych studentów.</p>
            </div>
        );
    }
    else {
        return (
            <div>
                <h2>Studenci</h2>
                {students.map((student, index) => (
                    <p key={index}>{index + 1}. {student.name} - {student.score || 'brak wyniku'}</p>
                ))}
            </div>
        );
    }
};

export default StudentList;
