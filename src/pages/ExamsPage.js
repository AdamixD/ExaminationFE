import React, { useEffect, useState } from "react";
import { getUserExams } from "../services/examService";
import ExamCard from "../components/Exams/ExamCard";
import { useNavigate } from "react-router-dom";
import "../styles/ExamsPage.css";

const ExamsPage = ({ token }) => {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState(null);
    const courseId = localStorage.getItem('courseId');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

    useEffect(() => {
        if (!courseId) {
            setError("Nie wybrano kursu.");
            return;
        }

        const fetchUserExams = async () => {
            try {
                const data = await getUserExams(courseId, token);
                setExams(data);
            } catch (err) {
                setError("Nie udało się pobrać egzaminów.");
            }
        };

        fetchUserExams();
    }, [courseId, token]);

    const handleAddExam = (type) => {
        navigate(`/exam/add/${type}`);
    };

    const handleBackButton = () => {
        navigate(`/courses`);
    };

    return (
        <div className="exams-page">
            <button className="back-button" onClick={handleBackButton}>Wróć</button>
            <header className="exams-header">
                <h2>Egzaminy</h2>
            </header>
            {error && <p className="error">{error}</p>}
            <div className="exams-list">
                {exams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                ))}
            </div>
            {(userRole === "LECTURER") && (
                <div className="exams-actions">
                    <button className="exams-button" onClick={() => handleAddExam('test')}>Dodaj test</button>
                    <button className="exams-button" onClick={() => handleAddExam('project')}>Dodaj projekt</button>
                </div>
            )}
        </div>
    );
};

export default ExamsPage;
