import React from 'react';
import { useParams } from 'react-router-dom';
import ExamForm from '../components/Exams/ExamForm';
import "../styles/ExamsPage.css";

const ExamFormPage = () => {
    const { type, examId } = useParams();

    return (
        <div className="exams-page">
            <header className="exams-header">
                <h2>Egzaminy</h2>
            </header>
            <div>
                <ExamForm examId={examId} type={type}/>
            </div>
        </div>
    );
};

export default ExamFormPage;
