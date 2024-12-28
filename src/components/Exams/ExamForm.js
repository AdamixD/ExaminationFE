import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExam, updateExam, getExamById } from '../../services/examService';
import '../../styles/ExamForm.css';

const ExamForm = () => {
    const { examId, type } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(examId);
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        durationLimit: '',
        questionsQuantity: '',
        maxPoints: '',
    });

    const formatDate = (date) => {
        let local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON().slice(0,16);
    };

    const [todayDate, setTodayDate] = useState(formatDate(new Date()));

    useEffect(() => {
        if (isEditing) {
            getExamById(examId).then(data => {
                setFormData({
                    title: data.title,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    durationLimit: type === 'test' ? data.durationLimit : '',
                    questionsQuantity: type === 'test' ? data.questionsQuantity : '',
                    maxPoints: data.maxPoints,
                });
            });
        }
        const timer = setTimeout(() => {
            setTodayDate(formatDate(new Date()));
        }, (24 * 60 * 60 * 1000) - (new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000));

        return () => clearTimeout(timer);
    }, [examId, type, isEditing, todayDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === "maxPoints" || name === "durationLimit" || name === "questionsQuantity") && parseInt(value, 10) < 0) {
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = [];
        const { startDate, endDate, durationLimit, maxPoints, questionsQuantity } = formData;
        const startTime = new Date(startDate);
        const endTime = new Date(endDate);
        const duration = endTime - startTime;

        if (endTime <= startTime) {
            errors.push("Data zakończenia musi być późniejsza niż data rozpoczęcia.");
        }
        if (duration < 5 * 60 * 1000) {
            errors.push("Czas pomiędzy datą zakończenia a rozpoczęcia musi wynosić co najmniej 5 minut.");
        }
        if (type === 'test') {
            if (!durationLimit || parseInt(durationLimit, 10) > duration / 60000) {
                errors.push("Czas trwania musi być zdefiniowany i nie może być dłuższy niż czas między datami.");
            }
            if (!questionsQuantity || parseInt(questionsQuantity, 10) <= 0 || parseInt(questionsQuantity, 10) > 1000) {
                errors.push("Liczba pytań musi zostać zdefiniowana i nie może przekroczyć 1000.");
            }
        }
        if (!maxPoints || parseInt(maxPoints, 10) <= 0 || parseInt(maxPoints, 10) > 1000) {
            errors.push("Liczba punktów musi być zdefiniowana i nie może przekroczyć 1000.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n\n"));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dataToSubmit = {
            title: formData.title,
            start_date: formData.startDate,
            end_date: formData.endDate,
            duration_limit: type === 'test' ? formData.durationLimit : null,
            status: 'UNDEFINED',
            course_realization_id: localStorage.getItem('courseId'),
            questions_quantity: type === 'test' ? formData.questionsQuantity : null,
            max_points: formData.maxPoints,
            type: type.toUpperCase(),
        };

        console.log(dataToSubmit)

        if (isEditing) {
            await updateExam(examId, dataToSubmit);
        } else {
            await createExam(dataToSubmit);
        }
        navigate('/exams');
    };

    return (
        <div className="exam-form-container">
            <h1>{isEditing ? `Edytuj ${type === 'test' ? 'Test' : 'Projekt'}` : `Dodaj ${type === 'test' ? 'Test' : 'Projekt'}`}</h1>
            <form onSubmit={handleSubmit} className="exam-form">
                <label>Nazwa: <input name="title" type="text" value={formData.title} onChange={handleChange} /></label>
                <label>Data rozpoczęcia: <input type="datetime-local" name="startDate" onInvalid={e => e.target.setCustomValidity('Data nie może być datą przeszłą.')} onInput={e => e.target.setCustomValidity('')} value={formData.startDate} onChange={handleChange} min={todayDate} /></label>
                <label>Data zakończenia: <input type="datetime-local" name="endDate" onInvalid={e => e.target.setCustomValidity('Data nie może być datą przeszłą.')} onInput={e => e.target.setCustomValidity('')} value={formData.endDate} onChange={handleChange} min={todayDate} /></label>
                {type === 'test' && (
                    <>
                        <label>Czas trwania (minuty): <input name="durationLimit" type="number" onInvalid={e => e.target.setCustomValidity('Proszę wprowadzić wartość liczbową większą niż 0.')} onInput={e => e.target.setCustomValidity('')} value={formData.durationLimit} onChange={handleChange} min="0" /></label>
                        <label>Liczba pytań: <input name="questionsQuantity" type="number" onInvalid={e => e.target.setCustomValidity('Proszę wprowadzić wartość liczbową większą niż 0.')} onInput={e => e.target.setCustomValidity('')} value={formData.questionsQuantity} onChange={handleChange} min="0" /></label>
                    </>
                )}
                <label>Liczba punktów: <input name="maxPoints" type="number" onInvalid={e => e.target.setCustomValidity('Proszę wprowadzić wartość liczbową większą niż 0.')} onInput={e => e.target.setCustomValidity('')} value={formData.maxPoints} onChange={handleChange} min="0" max="1000" /></label>
                <button type="submit">{isEditing ? 'Zaktualizuj' : 'Utwórz'}</button>
            </form>
        </div>
    );
};

export default ExamForm;
