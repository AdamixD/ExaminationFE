import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getExam } from '../services/examService';
import { getExamStudentByID, updateExamStudent } from '../services/examStudentsService';
import FinishedQuestionsList from '../components/Question/FinishedQuestionsList';
import ExamsHistogram from '../components/Exams/ExamsHistogram';
import { useNavigate } from "react-router-dom";
import '../styles/FinishedExamPage.css';

const FinishedExamPage = ({ token }) => {
    const { examStudentId } = useParams();
    const [exam, setExam] = useState(null);
    const [examStudent, setExamStudent] = useState(null);
    const [examScore, setExamScore] = useState(0);
    const [maxExamScore, setmaxExamScore] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

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
        var grade = 0;
        let temp =  await getExamStudentByID(examStudentId);
        
        for (var i = 0; i<temp.question_results.length; i++)
            grade += temp.question_results[i].score;

        updateExamStudent(examStudentId, {...examStudent, score: grade, status: "CLOSED" });
        alert('Ocena została zapisana.');
    }

    if (!exam) {
        return <div>Nie znaleziono podanego egzaminu.</div>;
    }

    const handleBackButton = () => {
        if (userRole === "LECTURER")//go back to current exam page
        {
            navigate(`/exam/${exam.id}`);
        }
        else//go back to exams page
        {
            navigate(`/exams`);
        }
    };

    return (
        <div className="exam-page">
            <button className="back-button" onClick={handleBackButton}>Wróć</button>
            <h2 className="exam-header">{exam.title}</h2>
            {(examStudent.status === "CLOSED") || userRole === "LECTURER"?
                <div className="exam-questions">
                    <h2 className="exam-student-score">Łączny wynik: {examScore}/{maxExamScore} - {percentage.toFixed(0)}%</h2>

                    {exam.type === "TEST" &&
                        <FinishedQuestionsList token={token} exam_student = {examStudent} exam_student_id={examStudentId} />}
                </div>
                :
                <p>{exam.type === "TEST" ? "Egzamin" : "Projekt"} oczekuje na ocenę przez prowadzącego.</p>}
            {(userRole === "STUDENT" && examStudent.status === "CLOSED") && 
                <ExamsHistogram token={token} exam={exam}></ExamsHistogram>
                }
            {userRole === "LECTURER" &&
                (examStudent.status === "COMPLETED" || examStudent.status === "CLOSED") &&
                    <button type="button" onClick={confirmGrade} className="question-form-button">Zapisz ocenę</button>
                    }
        </div>
    );
};

export default FinishedExamPage;
