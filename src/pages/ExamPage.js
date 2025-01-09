import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getExam, deleteExam, assignExam, updateExam } from '../services/examService';
import QuestionList from '../components/Question/QuestionList';
// import StudentList from '../components/Exams/StudentList';
import '../styles/ExamPage.css';
import Countdown from 'react-countdown';

const ExamPage = ({ token }) => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const userRole = localStorage.getItem('userRole');
    const [nAnswearedQuestions, setNAnswearedQuestions] = useState(0);

    useEffect(() => {
        getExam(examId)
            .then(data => {
                setExam(data);
                return data.id;
            })
            .catch(console.error);
    }, [token, examId, reloadKey]);

    const handleAssignExam = async () => {
        try {
            if (exam.status === 'UNDEFINED') {
                if (window.confirm(`Czy na pewno chcesz przypisać ${exam.type === "TEST" ? 'test' : 'projekt'}?`)) {
                    await assignExam(examId);
                    setReloadKey(prevKey => prevKey + 1);
                    alert('Przypisanie zakończyło się pomyślnie.');
                }
            } else if (exam.status === 'ASSIGNED') {
                if (window.confirm(`Czy na pewno chcesz ponownie przypisać ${exam.type === "TEST" ? 'test' : 'projekt'}?`)) {
                    await assignExam(examId);
                    setReloadKey(prevKey => prevKey + 1);
                    alert('Przypisanie zakończyło się pomyślnie.');
                }
            } else {
                alert(`Ponowne przypisanie aktywnego lub zakończonego ${exam.type === "TEST" ? 'testu' : 'projektu'} nie jest możliwe.`);
            }
        } catch (error) {
            if (error.response.status === 400) {
                alert('Liczba zdefiniowanych pytań jest mniejsza niż zadeklarowana.');
            } else {
                alert('Error assigning exam: ' + (error.message || 'Unknown error'));
            }
        }
    };

    const handleEditExam = () => {
        if (exam.status === 'UNDEFINED') {
            navigate(`/exam/edit/${exam.type.toString().toLowerCase()}/${examId}`);
        } else {
            alert(`Edytowanie ${exam.type === "TEST" ? ('testu') : ('projektu')} możliwe jest przed jego przypisaniem, rozpoczęciem i zakończeniem.`);
        }
    };

    const handleDeleteExam = async () => {
        try {
            if (exam.status === 'UNDEFINED' || exam.status === 'ASSIGNED') {
                if (window.confirm(`Czy na pewno chcesz usunąć ten ${exam.type === 'TEST' ? 'test' : 'projekt'}?`)) {
                    await deleteExam(examId, token);
                    navigate(`/exams`);
                }
            } else {
                alert(`Usunięcie ${exam.type === "TEST" ? ('testu') : ('projektu')} możliwe jest przed jego rozpoczęciem i zakończeniem.`);
            }
        } catch (error) {
            console.error('Error deleting exam', error);
            alert('Error deleting exam: ' + error.message);
        }
    };

    const formatExamStatus = (status) => {
        if (status === 'UNDEFINED') {
            return 'W trakcie edycji'
        }
        else if (status === 'ASSIGNED') {
            return 'Przypisany'
        }
        else if (status === 'ACTIVE') {
            return 'Aktywny'
        }
        else if (status === 'CLOSED') {
            return 'Zakończony'
        }
    };

    const handleSaveAndExit = async () => {
        await updateExam(examId, {...exam, status: "CLOSED" });
        console.info("ok")
        navigate(`/exams`);
    };

    const handleSaveQuestion = async () => {
        setNAnswearedQuestions(nAnswearedQuestions + 1);
    };

    if (!exam) {
        return <div>Loading...</div>;
    }

    return (
        <div className="exam-page">
            <header className="exam-header">
                <h2>{exam.title}</h2>
            </header>
            {userRole === 'STUDENT' ?
                (moment(Date()) <= moment(exam.end_date) && exam.status !== "CLOSED")  ? //todo - wywalić || true na koniec testów
                    moment(Date()) >= moment(exam.start_date) ?
                        <>
                            <div className="exam-questions">
                                <h2 className="exam-questions-header">
                                    <div className="exam-questions-name">{exam.type === "TEST" ? "Pytania" : "Zadania"}</div>
                                    <Countdown daysInHours={true} date={moment(exam.end_date)} onComplete={handleSaveAndExit}/>
                                    <div className="exam-points"> {nAnswearedQuestions}/{exam.questions_quantity}</div>
                                </h2>
                                <QuestionList examId={examId} examType={exam.type} token={token} handleSaveQuestion={handleSaveQuestion}/>
                                <button type="button" onClick={handleSaveAndExit} className="exam-end-button">Zakończ podejście</button>
                            </div>
                        </> :

                        <p>{exam.type === "TEST" ? "Egzamin" : "Projekt"} jeszcze się nie rozpoczął.</p> :
                    
                    <p>{exam.type === "TEST" ? "Egzamin" : "Projekt"} już się zakończył.</p> :
                <>
                    <div className="exam-details">
                        <div className="exam-details-info">
                            <p>Rodzaj: {exam.type === "TEST" ? ('Test') : ('Projekt')}</p>
                            <p>Data rozpoczęcia: {moment(exam.start_date).format('DD-MM-YYYY HH:mm:ss')}</p>
                            <p>Data zakończenia: {moment(exam.end_date).format('DD-MM-YYYY HH:mm:ss')}</p>
                            {exam.type === 'TEST' && (
                                <>
                                    <p>Czas trwania: {exam.duration_limit} minut</p>
                                    <p>Liczba pytań: {exam.questions_quantity}</p>
                                </>
                            )}
                            <p>Liczba punktów: {exam.max_points}</p>
                            <p>Status: {formatExamStatus(exam.status)}</p>
                        </div>
                        { (userRole === "LECTURER") && (exam.status === 'UNDEFINED' || exam.status === 'ASSIGNED') ?
                            (
                                <div className="exam-details-buttons">
                                    <button onClick={handleAssignExam} className="exam-details-button">Przypisz</button>
                                    <button onClick={handleEditExam} className="exam-details-button">Edytuj</button>
                                    <button onClick={handleDeleteExam} className="exam-details-button delete">Usuń</button>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className="exam-questions">
                        <header className="exam-questions-header">
                            <div>{exam.type === "TEST" ? (
                                <h2>Pytania</h2>
                            ) : (
                                <h2>Zadania</h2>
                            )}</div>
                        </header>
                        <QuestionList examId={examId} examType={exam.type} token={token}/>
                    </div>
                
                    <div className="exam-students">
                        <header className="exam-students-header">
                            <h2>Studenci</h2>
                        </header>
                        {/*<StudentList students={exam.students} />*/}
                    </div>
                </>}
        </div>
    );
};

export default ExamPage;
