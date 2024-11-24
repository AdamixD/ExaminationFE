import React, { useEffect, useState } from "react";
import { addUserCourse, getUserCourses } from "../services/courseService";
import CourseCard from "../components/Courses/CourseCard";
import "../styles/CoursesPage.css";
import { wait } from "@testing-library/user-event/dist/utils";

const CoursesPage = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(0);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newShortName, setNewShortName] = useState('');

    const fetchCourses = async () => {
        try {
            const data = await getUserCourses(token);
            setCourses(data);
        } catch (err) {
            setError("Nie udało się pobrać przedmiotów.");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [token]);

    const showFormFunc = async () => {
        setShowForm(1);
      };


    const addSubject = async () => {
        
        if (newSubjectName != '' && newShortName != '')
        {
            addUserCourse(token, newSubjectName, newShortName);
        }
        setNewSubjectName('');
        setNewShortName('');
        setShowForm(0);
      };

    return (
        <div className="courses-page">
            <header className="courses-header">
                <h2>Przedmioty</h2>
            </header>
            {error && <p className="error">{error}</p>}
            <div className="courses-list">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
            {showForm==0 && 
                <button onClick={showFormFunc}>
                    Dodaj nowy przedmiot
                </button>
            }
            {showForm==1 && 
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

export default CoursesPage;

