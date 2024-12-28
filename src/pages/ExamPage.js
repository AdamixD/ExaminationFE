import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getExamById } from '../services/examService';
import { getExamQuestions } from '../services/questionService';
import QuestionList from '../components/Exams/QuestionList';
import StudentList from '../components/Exams/StudentList';
import '../styles/ExamPage.css';

const ExamPage = ({ token }) => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [examQuestions, setExamQuestions] = useState([]);

    useEffect(() => {
        getExamById(examId)
            .then(data => {
                setExam(data);
                return data.id;
            })
            .then(examId => getExamQuestions(token, examId))
            .then(setExamQuestions)
            .catch(console.error);
    }, [token, examId]);

    const handleEdit = () => {
        navigate(`/exam/edit/${exam.type.toString().toLowerCase()}/${examId}`);
    };

    const formatStatus = (status) => {
        if (status === 'UNDEFINED') {
            return 'W trakcie edycji'
        }
        else if (status === 'SCHEDULED') {
            return 'Zaplanowany'
        }
        else if (status === 'ACTIVE') {
            return 'Aktywny'
        }
        else if (status === 'CLOSED') {
            return 'Zakończony'
        }
    };

    if (!exam) {
        return <div>Loading...</div>;
    }

    return (
        <div className="exam-page">
            <header className="exam-header">
                <h2>{exam.title}</h2>
            </header>
            <div className="exam-details">
                <div className="exam-details-info">
                    <p>Rodzaj: {exam.type}</p>
                    <p>Data rozpoczęcia: {moment(exam.start_date).format('DD-MM-YYYY HH:mm:ss')}</p>
                    <p>Data zakończenia: {moment(exam.end_date).format('DD-MM-YYYY HH:mm:ss')}</p>
                    {exam.type === 'TEST' && (
                        <>
                            <p>Czas trwania: {exam.duration_limit} minut</p>
                            <p>Liczba pytań: {exam.questions_quantity}</p>
                        </>
                    )}
                    <p>Liczba punktów: {exam.max_points}</p>
                    <p>Status: {formatStatus(exam.status)}</p>
                </div>
                <div className="exam-details-edit">
                    <button onClick={handleEdit} className="exam-details-edit-button">Edytuj</button>
                </div>
            </div>
            <QuestionList questions={examQuestions}/>
            {/*<StudentList students={exam.students} />*/}
        </div>
    );
};

export default ExamPage;
