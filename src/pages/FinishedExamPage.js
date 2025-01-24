import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getExam } from '../services/examService';
import { getExamStudentByID, updateExamStudent } from '../services/examStudentsService';
import FinishedQuestionsList from '../components/Question/FinishedQuestionsList';
import '../styles/FinishedExamPage.css';

const FinishedExamPage = ({ token }) => {
    const { examStudentId } = useParams();
    const [exam, setExam] = useState(null);
    const [examStudent, setExamStudent] = useState(null);
    const [examScore, setExamScore] = useState(0);
    const [maxExamScore, setmaxExamScore] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const userRole = localStorage.getItem('userRole');

    const getValues = async () => {
        let temp =  await getExamStudentByID(examStudentId);
        setExamStudent(temp);

        let score = 0;
        for (var i = 0; i<temp.question_results.length; i++)
            score += temp.question_results[i].score;
        setExamScore(score);

        let maxScore = 0;
        for (var i = 0; i<temp.questions.length; i++)
            maxScore += temp.questions[i].score;
        setmaxExamScore(maxScore);
        
        setPercentage(100 * score / maxScore);

        getExam(temp.exam_id)
            .then(data => {
                setExam(data);
                return data.id;
            })
            .catch(console.error);
    };

    useEffect(() => {
        getValues();
    }, [token]);

    const confirmGrade = async () => {
        updateExamStudent(examStudentId, {...examStudent, status: "CLOSED" });
        alert('Ocena została zapisana.');
    }

    if (!exam) {
        return <div>Nie znaleziono podanego egzaminu.</div>;
    }

    return (
        <div className="exam-page">
            <h2 className="exam-header">{exam.title}</h2>
            {(examStudent.status === "CLOSED") || userRole === "LECTURER"?
                <div className="exam-questions">
                    <h2 className="exam-student-score">Łączny wynik: {examScore}/{maxExamScore} - {percentage.toFixed(0)}%</h2>

                    {exam.type === "TEST" &&
                        <FinishedQuestionsList token={token} exam_student = {examStudent} exam_student_id={examStudentId} />}
                </div>
                :
                <p>{exam.type === "TEST" ? "Egzamin" : "Projekt"} oczekuje na ocenę przez prowadzącego.</p>}
            {userRole === "LECTURER" &&
                (examStudent.status === "COMPLETED" || examStudent.status === "CLOSED") &&
                    <button type="button" onClick={confirmGrade} className="question-form-button">Zapisz ocenę</button>}
        </div>
    );
};

export default FinishedExamPage;
