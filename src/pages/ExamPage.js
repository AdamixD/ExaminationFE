import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getExam, deleteExam, assignExam, unassignExam } from '../services/examService';
import { getExamStudents, getExamStudent } from '../services/examStudentsService';
import {getUser} from '../services/userService';
import QuestionList from '../components/Question/QuestionList';
import StudentList from '../components/Exams/StudentList';
import '../styles/ExamPage.css';
import ExamsHistogram from '../components/Exams/ExamsHistogram';

const ExamPage = ({ token }) => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [examStudents, setExamStudents] = useState([]);
    const [reloadKey, setReloadKey] = useState(0);
    const userRole = localStorage.getItem('userRole');
    // const [userID, setUserID] = useState(null);


    const getData = async () => {
        var temp = await getUser(localStorage.getItem("token"));

        getExam(examId)
            .then(data => {
                setExam(data);
                tryToTakeExam(data, temp.id);
                return data.id;
            })
            .catch(console.error);
        
        getExamStudents(examId).then(data => {
            setExamStudents(data);
                return data.id;
            })
            .catch(console.error);
    }

    useEffect(() => {
        getData();
    }, [token, examId, reloadKey]);

    const tryToTakeExam = async (data, temp_user_id) => {

        if (userRole === "STUDENT" && moment(Date()) > moment(data.end_date) )
            {
                let studentExam = await getExamStudent(examId, temp_user_id);
                if (studentExam.id)
                    navigate(`/completed_exam/${studentExam.id}`);
            }

        if (userRole === "STUDENT" && moment(Date()) <= moment(data.end_date) && moment(Date()) >= moment(data.start_date))
        {
            let studentExam = await getExamStudent(examId, temp_user_id);

            if (studentExam.id)
                navigate(`/student_exam/${studentExam.id}`);
            else
                setExam(null);
        }
    }

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
    
    const handleUnassignExam = async () => {

        try {
            if (exam.status === 'ASSIGNED') {
                if (window.confirm(`Czy na pewno chcesz anulować przypisanie tego ${exam.type === "TEST" ? 'testu' : 'projektu'}?`)) {
                    await unassignExam(examId); // Assuming this function exists for unassigning
                    setReloadKey(prevKey => prevKey + 1);
                    alert('Przypisanie zostało anulowane.');
                }
            } else {
                alert(`Anulowanie przypisania możliwe jest tylko dla egzaminu w statusie "Przypisany".
                       Po rozpoczęciu egzaminu nie można go edytować ani anulować przypisania.`);
            }
        } catch (error) {
            console.error('Error unassigning exam', error);
            alert('Error unassigning exam: ' + (error.message || 'Unknown error'));
        }
    }

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

    if (!exam) {
        return <div>Nie znaleziono podanego egzaminu.</div>;
    }

    const handleBackButton = () => {
        navigate(`/exams`);
    };

    return (
        <div className="exam-page">
            <button className="back-button" onClick={handleBackButton}>Wróć</button>
            <header className="exam-header">
                <h2>{exam.title}</h2>
            </header>

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
                            {exam.status === 'UNDEFINED' && <button onClick={handleAssignExam} className="exam-details-button">Przypisz</button>}
                            {exam.status !== 'ASSIGNED' && <button onClick={handleEditExam} className="exam-details-button">Edytuj</button>}
                            {exam.status === 'ASSIGNED' && <button onClick={handleUnassignExam} className="exam-details-button">Anuluj przypisanie</button>}
                            <button onClick={handleDeleteExam} className="exam-details-button delete">Usuń</button>
                        </div>
                    ) : null
                }
            </div>
            {(userRole === "LECTURER") &&
            <>
                <div className="exam-questions">
                    <header className="exam-questions-header">
                        <div>{exam.type === "TEST" ? (
                            <h2>Pytania</h2>
                        ) : (
                            <h2>Zadania</h2>
                        )}</div>
                    </header>
                    <QuestionList examId={examId} examType={exam.type} examStatus={exam.status} token={token}/>
                </div>
                {(exam.status === 'CLOSED') &&
                    <ExamsHistogram token={token} exam={exam}></ExamsHistogram>
                }
                <div className="exam-students">
                    <header className="exam-students-header">
                        <h2>Studenci</h2>
                    </header>
                    {<StudentList student_exams={examStudents} />}
                </div>
            </>}
        </div>
    );
};

export default ExamPage;
