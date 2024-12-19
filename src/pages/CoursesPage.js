import React, { useEffect, useState } from "react";
import { getUserCourses } from "../services/courseService";
import CourseCard from "../components/Courses/CourseCard";
import "../styles/CoursesPage.css";

const CoursesPage = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    // Todo - ogarnąć jak sprawdzić, czy to student, czy wykładowca.
    const [isStudent] = useState(true);

    const fetchCourses = async (token) => {
        try {
            const data = await getUserCourses(token);
            setCourses(data);
        } catch (err) {
            setError("Nie udało się pobrać przedmiotów.");
        }
    };

    useEffect(() => {
        fetchCourses(token);
    }, [token]);

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
                {courses.length===0 && <p>W bieżącym semestrze nie {isStudent ? "jesteś zapisany na żaden przedmiot" : "prowadzisz żadnego przedmiotu"}.</p>}
            </div>
        </div>
    );
};

export default CoursesPage;
