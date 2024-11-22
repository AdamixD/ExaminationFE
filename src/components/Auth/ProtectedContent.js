import { Link, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import { fetchProtectedData } from '../../services/api';
import SubjectList from "./SubjectList";

function ProtectedContent({ token }) {
  const [message, setMessage] = useState('');

  const handleFetchData = async (endpoint) => {
    try {
      const data = await fetchProtectedData(token, endpoint);
      setMessage(data.message);
    } catch (error) {
      setMessage('Brak dostępu do tego zasobu!');
    }
  };

  return (
    <div>
      <Routes>
        <Route path='/' element={
          <div>
            <button onClick={() => handleFetchData('protected')}>Dostęp dla wszystkich</button>
            <button onClick={() => handleFetchData('student_access')}>Dostęp dla studentów</button>
            <button onClick={() => handleFetchData('lecturer_access')}>Dostęp dla wykładowców</button>
            <p>{message}</p>
            <Link to='/subjectList'>
              <button type="button">
                Add Entry
              </button>
            </Link>
          </div>
        } />
        <Route path='/subjectList' element={
          <SubjectList />
        } />
      </Routes>
    </div>
  );
}

export default ProtectedContent;
