import React from 'react';

const QuestionList = ({ questions }) => {
    if (questions.length === 0) {
        return (
            <div>
                <h2>Pytania</h2>
                <p>Brak zdefiniowanych pytań dla tego egzaminu.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Pytania</h2>
            {questions.map((question, index) => (
                <p key={index}>{index + 1}. {question.text} ({question.type})</p>
            ))}
        </div>
    );
};

export default QuestionList;
