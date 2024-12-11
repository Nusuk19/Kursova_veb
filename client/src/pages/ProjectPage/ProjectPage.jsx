import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProjectPage.module.css';
import ReportButtons from './ReportButtons';
import DataAnalysis from '../DataAnalysis/DataAnalysis';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    deadline: '',
    time: '',
    assignedUsers: [],
  });
  const [projectUsers, setProjectUsers] = useState([
    { id: 1, name: 'Alice', avatar: 'A' },
    { id: 2, name: 'Bob', avatar: 'B' },
    { id: 3, name: 'Charlie', avatar: 'C' },
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const columns = {
    'not-started': { name: 'Not Started' },
    'in-progress': { name: 'In Progress' },
    'done': { name: 'Deployment' },
  };
  const [errorMessage, setErrorMessage] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const mockProjects = [
      { id: 1, name: 'Test Project 1', description: 'Description for test project 1' },
      { id: 2, name: 'Test Project 2', description: 'Description for test project 2' },
      { id: 3, name: 'Test Project 3', description: 'Description for test project 3' },
    ];
    const selectedProject = mockProjects.find((p) => p.id === parseInt(projectId, 10));
    setProject(selectedProject);

    const mockTasks = [
      {
        id: '1',
        name: 'Documentation',
        description: 'Write project documentation.',
        status: 'not-started',
        deadline: '2024-12-05T12:00',
        time: '2h',
        assignedUsers: [1],
      },
      {
        id: '2',
        name: 'Testing',
        description: 'Run usability tests.',
        status: 'in-progress',
        deadline: '2024-12-04T16:30',
        time: '7h',
        assignedUsers: [2, 3],
      },
      {
        id: '3',
        name: 'Deployment',
        description: 'Prepare for final deployment.',
        status: 'done',
        deadline: '2024-11-30T09:00',
        time: '1h',
        assignedUsers: [],
      },
    ];
    setTasks(mockTasks);

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          isDeadlinePassed(task.deadline) && task.status !== 'done'
            ? { ...task, isOverdue: true }
            : { ...task, isOverdue: false }
        )
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [projectId]);


  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const filteredTasks = tasks.filter((task) => {
    const terms = searchTerm.toLowerCase().split(' ');
    const matchesSearch = terms.every(
      (term) =>
        task.name.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
    );

    const matchesFilter =
      filter === 'all' ||
      (filter === 'overdue' && isDeadlinePassed(task.deadline) && task.status !== 'done') ||
      task.status === filter;

    return matchesSearch && matchesFilter;
  });


  const moveTaskForward = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newStatus =
            task.status === 'not-started'
              ? 'in-progress'
              : task.status === 'in-progress'
                ? 'done'
                : task.status;
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const moveTaskBackward = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newStatus =
            task.status === 'done'
              ? 'in-progress'
              : task.status === 'in-progress'
                ? 'not-started'
                : task.status;
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const openEditModal = (task) => {
    setNewTask({
      name: task.name,
      description: task.description,
      deadline: task.deadline,
      time: task.time.replace('h', ''),
      assignedUsers: task.assignedUsers || [],
      status: task.status,
    });
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const validateTask = () => {
    const { name, description, deadline, time } = newTask;
    if (!name.trim() || !description.trim() || !deadline.trim() || !time.trim()) {
      return "All fields are required.";
    }
    if (isNaN(parseFloat(time))) {
      return "Time estimate must be a number.";
    }
    return "";
  };

  const saveTask = () => {
    const error = validateTask();
    if (error) {
      setErrorMessage(error);
      return;
    }

    const formattedTask = {
      ...newTask,
      time: `${parseFloat(newTask.time)}h`,
      status: editingTask ? editingTask.status : modalColumn,
    };

    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editingTask.id ? { ...task, ...formattedTask } : task))
      );
    } else {
      setTasks([...tasks, { id: `${tasks.length + 1}`, ...formattedTask }]);
    }

    setNewTask({ name: "", description: "", deadline: "", time: "", assignedUsers: [] });
    setErrorMessage("");
    setIsModalOpen(false);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const openModal = (columnId) => {
    setModalColumn(columnId);
    setIsModalOpen(true);
  };

  const calculateElapsedTime = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffInMilliseconds = end - now;

    if (diffInMilliseconds <= 0) {
      return 0;
    }

    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours.toFixed(2);
  };

  const calculateRemainingTime = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffInMilliseconds = end - now;

    if (diffInMilliseconds <= 0) {
      return 'Deadline passed';
    }

    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return `${diffInHours.toFixed(2)} hours left`;
  };

  const getStatusTasks = (status) =>
    filteredTasks
      .filter((task) => task.status === status)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));


  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const markAsDone = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: 'done' } : task
      )
    );
  };

  const [descriptionModal, setDescriptionModal] = useState({
    isOpen: false,
    content: '',
  });

  const openDescriptionModal = (description) => {
    setDescriptionModal({ isOpen: true, content: description });
  };

  const closeDescriptionModal = () => {
    setDescriptionModal({ isOpen: false, content: '' });
  };

  const toggleAnalysisVisibility = () => {
    setShowAnalysis(!showAnalysis);
  };

  if (!project) {
    return <div className={styles.loading}>Loading project details...</div>;
  }

  const getOverdueTasks = (tasks) => {
    return tasks.filter((task) => {
      const isOverdue = new Date(task.deadline) < new Date();
      const isNotCompleted = task.status.trim().toLowerCase() !== 'done';
      return isOverdue && isNotCompleted;
    });
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Project Report: ${project.name}`, 10, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 20);

    doc.text(`Total Tasks: ${tasks.length}`, 10, 30);
    const statusCount = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    doc.text(`Task Breakdown:`, 10, 40);
    Object.entries(statusCount).forEach(([status, count], i) => {
      doc.text(` - ${status}: ${count}`, 15, 50 + i * 10);
    });

    let yPosition = 60 + Object.keys(statusCount).length * 10;
    const overdueTasks = getOverdueTasks(tasks);
    if (overdueTasks.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Overdue Tasks:', 10, yPosition);
      doc.setFont('helvetica', 'normal');
      overdueTasks.forEach((task, index) => {
        yPosition += 10;
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 10;
        }
        const assignedTo = task.assignedUsers
          .map((userId) => projectUsers.find((u) => u.id === userId)?.name || 'Unknown')
          .join(', ');
        doc.text(
          `${index + 1}. ${task.name} - Deadline: ${formatDeadline(task.deadline)} - Assigned To: ${assignedTo || 'N/A'}`,
          10,
          yPosition
        );
      });
    }

    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Task Details:', 10, yPosition);
    doc.setFont('helvetica', 'normal');
    tasks.forEach((task, index) => {
      yPosition += 10;
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 10;
      }
      const assignedTo = task.assignedUsers
        .map((userId) => projectUsers.find((u) => u.id === userId)?.name || 'Unknown')
        .join(', ');
      doc.text(`${index + 1}. ${task.name} - ${task.status}`, 10, yPosition);
      yPosition += 10;
      doc.text(`   Description: ${task.description}`, 10, yPosition);
      yPosition += 10;
      doc.text(`   Deadline: ${formatDeadline(task.deadline)}`, 10, yPosition);
      yPosition += 10;
      doc.text(`   Assigned To: ${assignedTo || 'N/A'}`, 10, yPosition);
    });

    doc.save(`${project.name}_report.pdf`);
  };


  const generateDOCXReport = () => {
    const overdueTasks = getOverdueTasks(tasks);

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Project Report: ${project.name}`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Generated on: ${new Date().toLocaleString()}`,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Tasks: ${tasks.length}`,
                  bold: true,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'Task Breakdown:',
              bold: true,
              spacing: { after: 200 },
            }),
            ...Object.entries(tasks.reduce((acc, task) => {
              acc[task.status] = (acc[task.status] || 0) + 1;
              return acc;
            }, {})).map(([status, count]) =>
              new Paragraph(` - ${status}: ${count}`)
            ),

            overdueTasks.length > 0
              ? new Paragraph({
                text: 'Overdue Tasks:',
                bold: true,
                spacing: { after: 200 },
              })
              : null,
            ...overdueTasks.map((task, index) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${task.name} - Deadline: ${formatDeadline(task.deadline)} - Assigned To: ${task.assignedUsers
                      .map((userId) => projectUsers.find((u) => u.id === userId)?.name || 'Unknown')
                      .join(', ') || 'N/A'}`,
                    bold: true,
                  }),
                ],
              })
            ),

            new Paragraph({
              text: 'Task Details:',
              bold: true,
              spacing: { after: 200 },
            }),
            ...tasks.map((task, index) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${task.name} - ${task.status}\n`,
                    bold: true,
                  }),
                  new TextRun(`Description: ${task.description}\n`),
                  new TextRun(`Deadline: ${formatDeadline(task.deadline)}\n`),
                  new TextRun(
                    `Assigned To: ${task.assignedUsers
                      .map((userId) => projectUsers.find((u) => u.id === userId)?.name || 'Unknown')
                      .join(', ') || 'N/A'}\n`
                  ),
                ],
                spacing: { after: 200 },
              })
            ),
          ].filter(Boolean),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}_report.docx`;
      a.click();
    });
  };

  return (
    <div className={styles.projectPage}>
      <header className={styles.header}>
        <h1 className={styles.projectTitle}>{project.name}</h1>
        <div className={styles.projectUsers}>
          {projectUsers.map((user) => (
            <div key={user.id} className={styles.userAvatar} title={user.name}>
              {user.avatar}
            </div>
          ))}
        </div>
        <button className={styles.inviteButton} onClick={() => setIsInviteModalOpen(true)}>
          Invite Users
        </button>
        <Link to="/board" className={styles.backButton}>← Back</Link>
      </header>

      <section className={styles.projectDetails}>
        <h2>Description</h2>
        <p>{project.description}</p>
      </section>
      <ReportButtons
        generatePDFReport={generatePDFReport}
        generateDOCXReport={generateDOCXReport}
        toggleAnalysisVisibility={toggleAnalysisVisibility}
        showAnalysis={showAnalysis}
      />
      {showAnalysis && <DataAnalysis tasks={tasks} />}
      <section className={styles.tasksSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />{searchTerm && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
          <div className={styles.filterSection}>
            <label htmlFor="filter">Filter tasks: </label>
            <select
              id="filter"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        <h2>Kanban Board</h2>
        <div className={styles.kanbanBoard}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className={styles.kanbanColumn}>
              <h3 className={styles.kanbanColumnTitle}>{column.name}</h3>
              <button
                onClick={() => openModal(columnId)}
                className={styles.addTaskButton}
              >
                + Add Task
              </button>
              {filteredTasks.filter((task) => task.status === columnId).map((task) => (
                <div
                  key={task.id}
                  className={`${styles.taskCard} ${isDeadlinePassed(task.deadline) ? styles.deadlinePassed : ''}`}
                >
                  <div className={styles.taskHeader}>
                    <div className={styles.taskActionsTopLeft}>
                      {task.status !== 'not-started' && (
                        <button
                          className={styles.moveButton}
                          onClick={() => moveTaskBackward(task.id)}
                        >
                          ←
                        </button>
                      )}
                      {task.status !== 'done' && (
                        <button
                          className={styles.moveButton}
                          onClick={() => moveTaskForward(task.id)}
                        >
                          →
                        </button>
                      )}
                      {task.status === 'done' ? (
                        <div className={styles.completedIcon} title="Task Completed">
                          ✔
                        </div>
                      ) : (
                        <div className={styles.deadlineClock} data-deadline={`Deadline: ${formatDeadline(task.deadline)}`}>
                          🕒
                        </div>
                      )}
                    </div>
                    <div className={styles.assignedUsers}>
                      {task.assignedUsers.map((userId) => {
                        const user = projectUsers.find((u) => u.id === userId);
                        return user ? (
                          <div key={user.id} className={styles.userAvatar} title={user.name}>
                            {user.avatar}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <h4>{task.name}</h4>
                  <p>
                    {task.description.length > 100 ? (
                      <>
                        {`${task.description.substring(0, 100)}...`}
                        <span
                          className={styles.showMoreSymbol}
                          onClick={() => openDescriptionModal(task.description)}
                          title="Show full description"
                        >
                          📖
                        </span>
                      </>
                    ) : (
                      task.description
                    )}
                  </p>
                  <p>Deadline: {formatDeadline(task.deadline)}</p>
                  <p>Estimated Time: {task.time}</p>
                  {task.status !== 'done' && (
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBar}
                        style={{
                          width: `${Math.min(
                            (calculateElapsedTime(task.deadline) / parseFloat(task.time)) * 100,
                            100
                          )}%`,
                        }}
                        onMouseEnter={() => setTooltipVisible(true)}
                        onMouseLeave={() => setTooltipVisible(false)}
                      />

                      {tooltipVisible && (
                        <div className={styles.tooltip}>
                          {calculateRemainingTime(task.deadline)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={styles.taskActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                    {task.status !== 'done' && (
                      <button
                        className={styles.doneButton}
                        onClick={() => markAsDone(task.id)}
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {isInviteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Invite a User</h2>
            <input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleInvite} className={styles.modalButton}>
                Send Invitation
              </button>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className={styles.modalButtonCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editingTask ? 'Edit Task' : `Create New Task in ${modalColumn.replace('-', ' ')}`}</h2>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <input
              type="text"
              placeholder="Task Name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <textarea
              className={styles.textarea}
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              multiple
              className={styles.userSelect}
              value={newTask.assignedUsers || []}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  assignedUsers: Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10)),
                })
              }
            >
              {projectUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <input
              type="text"
              placeholder="Estimated Time (e.g., 2)"
              value={newTask.time}
              onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
            />
            <div className={styles.modalActions}>
              <button onClick={saveTask} className={styles.modalButton}>
                {editingTask ? 'Save Changes' : 'Add Task'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.modalButtonCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {descriptionModal.isOpen && (
        <div className={styles.modal1}>
          <div className={styles.modalContent1}>
            <button
              className={`${styles.closeButton} ${styles.modalClose}`}
              onClick={closeDescriptionModal}
            >
              &times;
            </button>
            <h2>{descriptionModal.title}</h2>
            <div className={styles.detailsText1}>
              <pre>{descriptionModal.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default ProjectPage;
