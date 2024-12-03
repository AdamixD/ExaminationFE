import React, { useEffect, useState } from "react";
import { addExam, getExams } from "../services/examService";
import ExamCard from "../components/Exams/ExamCard";
import "../styles/ExamsPage.css";

const ExamsPage = ({ token }) => {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(0);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newShortName, setNewShortName] = useState('');

    const fetchExams = async (token) => {
        try {
            const data = await getExams(token);
            setExams(data);
        } catch (err) {
            setError("Nie udało się pobrać egzaminów.");
        }
    };

    useEffect(() => {
        fetchExams(token);
    }, [token]);

    const showFormFunc = async () => {
        setShowForm(1);
      };


    const addSubject = async () => {
        
        if (newSubjectName !== '' && newShortName !== '')
        {
            addExam(token, newSubjectName, newShortName);
        }
        setNewSubjectName('');
        setNewShortName('');
        setShowForm(0);
      };

    return (
        <div className="exams-page">
            <header className="exams-header">
                <h2>Egzaminki</h2>
            </header>
            {error && <p className="error">{error}</p>}
            <div className="exams-list">
                {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}
            </div>
            {showForm===0 && 
                <button onClick={showFormFunc}>
                    Dodaj nowy przedmiot
                </button>
            }
            {showForm===1 && 
                <form onSubmit={addSubject}>
                    <input
                        type="subject"
                        placeholder="Nazwa przedmiotu"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                    />
                    <input
                        type="subject"
                        placeholder="Skrót przedmiotu"
                        value={newShortName}
                        onChange={(e) => setNewShortName(e.target.value)}
                    />
                    <button type="submit">Dodaj przedmiot</button>
                </form>
            }
        </div>
    );
};

export default ExamsPage;

