import React, { useEffect, useState } from "react";
import { addExam, getExams } from "../services/examService";
import ExamCard from "../components/Exams/ExamCard";
import "../styles/ExamsPage.css";

const ExamsPage = ({ token }) => {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [duration, setDuration] = useState('');
    const [randomization, setRandomization] = useState(0);

    const course_id = window.location.href.split("/courses/")[1];

    // Todo - ogarnąć jak sprawdzić, czy to student, czy wykładowca.
    const [isLecturer] = useState(true);

    const fetchExams = async (token, course_id) => {
        try {
            const data = await getExams(token, course_id);
            setExams(data);
        } catch (err) {
            setError("Nie udało się pobrać egzaminów.");
        }
    };

    useEffect(() => {
        fetchExams(token, course_id);
    }, [token, course_id]);

    const addNewExam = async () => {
        
        if (startDate !== '' && endDate !== '' && duration !== '')
        {
            addExam(token, startDate, endDate, duration, randomization, course_id);
        }
        setStartDate('');
        setEndDate('');
        setDuration('');
        setShowForm(0);
      };

    return (
        <div className="exams-page">
            <header className="exams-header">
                <h2>Egzaminy z przedmiotu</h2>
            </header>
            {error && <p className="error">{error}</p>}
            <div className="exams-list">
                {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}
            </div>
            {exams.length===0 && !error && <p>Dla tego przedmiotu nie zdefiniowano żadnego egzaminu.</p>}
            {showForm===0 && isLecturer && !error && 
                <button onClick={() => {setShowForm(1);}}>
                    Dodaj nowy przedmiot
                </button>
            }
            {showForm===1 && isLecturer && !error &&
                <form onSubmit={addNewExam}>
                    <input
                        type="subject"
                        placeholder="Data rozpoczęcia"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    /><br />
                    <input
                        type="subject"
                        placeholder="Data zakończenia"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    /><br />
                    <input
                        type="subject"
                        placeholder="Czas trwania"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    /><br />
                    <input
                        id="not_random"
                        type="radio"
                        checked = {randomization === 0}
                        onChange={() => setRandomization(0)}
                    />
                    <label for="not_random">Brak losowości przy doborze pytań</label><br />
                    <input
                        id="order"
                        type="radio"
                        checked = {randomization === 1}
                        onChange={() => setRandomization(1)}
                    />
                    <label for="order">Losowa kolejność pytań</label><br />
                    <input
                        id="set"
                        type="radio"
                        checked = {randomization === 2}
                        onChange={() => setRandomization(2)}
                    />
                    <label for="set">Pytania losowane ze zbioru</label><br />
                    <button type="submit">Dodaj egzamin</button>
                </form>
            }
        </div>
    );
};

export default ExamsPage;

