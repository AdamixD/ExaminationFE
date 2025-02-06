import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { getExamStudents } from '../../services/examStudentsService';
import '../../styles/FinishedExamPage.css';

const ExamsHistogram = ({ token, exam }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        //===get necessary data for calculations (also setup)
        let exam_max_points = exam.max_points;
        let num_ranges = 5;
        getExamStudents(exam.id).then(data => {
            //===calculate/create the data necesarry to display in the histogram (if there is data to use)
            //generate/calculate the bar segments (zakresy punktów)
            let temp = [];
            let step = exam_max_points / num_ranges;
            temp.push({from: 0, to: step, name: `0-${step}`, value: 0});
            for (let i = 1; i < num_ranges; i++) {
                temp.push({from: (temp[i-1].to), to: (temp[i-1].to + step), name: '0-0', value: 0});

                if (i + 1 === num_ranges) {
                    temp[i].to = exam_max_points;
                }

                temp[i].name = `${temp[i].from.toFixed(2)}-${temp[i].to.toFixed(2)}`;
            }
            
            //===iteracja po liście studentów i inkrementacja odpowiednich kolumn w wykresie
            for (let i = 0; i < data.length; i++) {
                //compare student score with every column (from last to first)
                for (let j = temp.length - 1; j >= 0; j--) {
                    if (temp[j].from <= data[i].score && data[i].score <= temp[j].to) {
                        temp[j].value = temp[j].value + 1;
                        break;
                    }
                }
            }

            setData(temp);
            })
            .catch(console.error);

        
    }, [token, exam]);

    return (
        <div>
            <h2 className="exam-student-score">Podsumowanie punktacji za przedmiot:</h2>
            <BarChart width={730} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Studenci" dataKey="value" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default ExamsHistogram;
