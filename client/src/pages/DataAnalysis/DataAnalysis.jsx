import React, { useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from './DataAnalysis.module.css';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const DataAnalysis = ({ tasks }) => {
  const [activeChart, setActiveChart] = useState('status'); 

  const taskStatuses = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const dataStatus = {
    labels: ['Not Started', 'In Progress', 'Done', 'Overdue'], 
    datasets: [
      {
        label: 'Tasks by Status',
        data: [
          taskStatuses['not-started'] || 0,
          taskStatuses['in-progress'] || 0,
          taskStatuses['done'] || 0,
          taskStatuses['overdue'] || 0,
        ],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const timeData = tasks.map((task) => ({
    deadline: new Date(task.deadline).getTime(),
    timeSpent: task.time ? parseFloat(task.time.replace('h', '')) : 0, 
  }));

  const sortedTimeData = timeData.sort((a, b) => a.deadline - b.deadline);
  const labelsTime = sortedTimeData.map((data) => new Date(data.deadline).toLocaleDateString());
  const timeSpent = sortedTimeData.map((data) => data.timeSpent);

  const dataTimeProgress = {
    labels: labelsTime, 
    datasets: [
      {
        label: 'Time Spent on Tasks',
        data: timeSpent,
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4,
      },
    ],
  };

  const dataPie = {
    labels: ['Not Started', 'In Progress', 'Done', 'Overdue'],
    datasets: [
      {
        data: [
          taskStatuses['not-started'] || 0,
          taskStatuses['in-progress'] || 0,
          taskStatuses['done'] || 0,
          taskStatuses['overdue'] || 0,
        ],
        backgroundColor: ['#FF6347', '#FFD700', '#32CD32', '#DC143C'],
      },
    ],
  };

  const dataDoughnut = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [
          taskStatuses['done'] || 0,
          (tasks.length - (taskStatuses['done'] || 0)),
        ],
        backgroundColor: ['#32CD32', '#FF6347'],
      },
    ],
  };

  const handleButtonClick = (chartType) => {
    setActiveChart(chartType);
  };

  return (
    <div className={styles.dataAnalysis}>
      <h3>Project Data Analysis</h3>
      <h3>Here is an analysis of the project tasks...</h3>

      <div className={styles.chartButtons}>
        <button 
          onClick={() => handleButtonClick('status')} 
          className={activeChart === 'status' ? styles.active : ''}>
          Task Status Distribution
        </button>
        <button 
          onClick={() => handleButtonClick('time')} 
          className={activeChart === 'time' ? styles.active : ''}>
          Time Progress
        </button>
        <button 
          onClick={() => handleButtonClick('pie')} 
          className={activeChart === 'pie' ? styles.active : ''}>
          Task Status Pie
        </button>
        <button 
          onClick={() => handleButtonClick('doughnut')} 
          className={activeChart === 'doughnut' ? styles.active : ''}>
          Completed vs Incomplete
        </button>
      </div>

      {activeChart === 'status' && (
        <div className={styles.chartContainer}>
          <h4>Task Status Distribution</h4>
          <Bar data={dataStatus} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Task Statuses' } } }} />
        </div>
      )}

      {activeChart === 'time' && (
        <div className={styles.chartContainer}>
          <h4>Time Progress Over Tasks</h4>
          <Line data={dataTimeProgress} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Time Spent on Tasks' } } }} />
        </div>
      )}

      {activeChart === 'pie' && (
        <div className={styles.chartContainer}>
          <h4>Task Status Pie Chart</h4>
          <Pie data={dataPie} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Task Status Distribution' } } }} />
        </div>
      )}

      {activeChart === 'doughnut' && (
        <div className={styles.chartContainer}>
          <h4>Completed vs Incomplete Tasks</h4>
          <Doughnut data={dataDoughnut} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Task Completion' } } }} />
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
