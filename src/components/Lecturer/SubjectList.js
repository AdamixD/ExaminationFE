import React, { useState } from 'react';
import '../../styles/App.css';
import { Link, Route, Routes} from "react-router-dom";

function SubjectList({ }) {
  //let subjects = [];

  const [subjects, setSubject] = useState(['APSI', 'TBO', 'PRNET' ,'PTI']);
  const [newSubject, setNewSubject] = useState('');
  const [showForm, setShowForm] = useState(0);
  //let showForm;

  const addSubject = async () => {
    //setSubject(subjects + newSubject);
    if (newSubject != '')
      setSubject(subjects => [...subjects, newSubject]);
    setNewSubject('');
    setShowForm(0);
  };

  const showFormFunc = async () => {
    setShowForm(1);
  };

  return (
    <div>
      <div>
        {subjects.map(item => (
          <div>
            <Link to={'/lecturer_access/'+item}>
              <button>
                {item}
              </button>
            </Link>
          </div>
          ))}
        <button onClick={showFormFunc}>
          Dodaj nowy przedmiot
        </button>
      </div>
      {showForm==1 && 
      <form onSubmit={addSubject}>
        <input
          type="subject"
          placeholder="XXX"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button type="submit">Dodaj przedmiot</button>
      </form> }
    </div>
  );
}

export default SubjectList;
