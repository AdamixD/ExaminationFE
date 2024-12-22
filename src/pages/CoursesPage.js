import React, { useEffect, useState } from "react";
import { getUserCourses } from "../services/courseService";
import CourseCard from "../components/Course/CourseCard";
import "../styles/CoursesPage.css";

const CoursesPage = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getUserCourses(token);
                setCourses(data);
            } catch (err) {
                setError("Nie udało się pobrać przedmiotów.");
            }
        };

        fetchCourses();
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
            </div>
        </div>
    );
};

export default CoursesPage;

