import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getExam } from '../services/examService';
import { getExamStudentByID, updateExamStudent } from '../services/examStudentsService';
import StudentQuestionList from '../components/Question/StudentQuestionList';
import '../styles/ExamPage.css';
import Countdown from 'react-countdown';

const ExamPage = ({ token }) => {
    const { examStudentId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [examStudent, setExamStudent] = useState(null);
    const [nAnswearedQuestions, setNAnswearedQuestions] = useState(0);

    const getValues = async () => {
        let temp = await getExamStudentByID(examStudentId);
        
        getExam(temp.exam_id)
            .then(data => {
                setExam(data);
                return data.id;
            })
            .catch(console.error);
        setExamStudent(temp);

    };

    useEffect(() => {
        getValues();
    }, [token]);

    const handleSaveAndExit = async () => {
        await updateExamStudent(examStudentId, {...examStudent, status: "COMPLETED" });
        navigate(`/exams`);
    };

    const handleSaveQuestion = async () => {
        setNAnswearedQuestions(nAnswearedQuestions + 1);
    };

    if (!exam) {
        return <div>Nie znaleziono podanego egzaminu..</div>;
    }

    return (
        <div className="exam-page">
            <header className="exam-header">
                <h2>{exam.title}</h2>
            </header>
            {(exam.status === "CLOSED")  ?
                <p>Zakończyłeś już ten {exam.type === "TEST" ? "egzamin" : "projekt"} .</p> :
                <div className="exam-questions">
                    <h2 className="exam-questions-header">
                        <div className="exam-questions-name">{exam.type === "TEST" ? "Pytania" : "Zadania"}</div>
                        <Countdown daysInHours={true} date={moment(exam.end_date)} />
                        <div className="exam-points"> {nAnswearedQuestions}/{exam.questions_quantity}</div>
                    </h2>
                    <StudentQuestionList examStudentId={examStudentId} questions = {examStudent.questions} examType={exam.type} token={token} handleSaveQuestion={handleSaveQuestion}/>
                    <button type="button" onClick={handleSaveAndExit} className="exam-end-button">Zakończ podejście</button>
                </div>}
        </div>
    );
};

export default ExamPage;
