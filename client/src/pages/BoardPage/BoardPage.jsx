import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BoardPage.module.css';
import EditButton from './EditButton'; 
import UserProfile from '../UserProfile/UserProfile';
import { fetchUserProfile } from '../../api/index'; 

const BoardPage = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Test Project 1', description: 'Description for test project 1', isImportant: true },
    { id: 2, name: 'Test Project 2', description: 'Description for test project 2', isImportant: false },
    { id: 3, name: 'Test Project 3', description: 'Description for test project 3', isImportant: false },
  ]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [importantProjects, setImportantProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState({ recent: false, important: false });
  const [isAddProjectVisible, setIsAddProjectVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [createProjectData, setCreateProjectData] = useState({ name: '', description: '' });
  const [editProjectData, setEditProjectData] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const userId = localStorage.getItem("userId"); 


  const location = useLocation();

  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile(userId); 
        console.log('Username in BoardPage:', profile.username); 
        setUsername(profile.username); 
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    loadUserProfile();
  }, [userId]);


  useEffect(() => {
    setImportantProjects(projects.filter((project) => project.isImportant));
  }, [projects]);


  
  useEffect(() => {
    const recentProjectsFromStorage = JSON.parse(localStorage.getItem('recentProjects')) || [];
    setRecentProjects(recentProjectsFromStorage);
  }, []);

  useEffect(() => {
    const projectIdFromUrl = location.pathname.split('/').pop();
    if (projectIdFromUrl) {
      const projectId = parseInt(projectIdFromUrl, 10);
      addToRecentProjects(projectId);
    }
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const dropdownMenus = document.querySelectorAll(`.${styles.dropdownMenu}`);
      const isClickInside = Array.from(dropdownMenus).some(menu =>
        menu.contains(event.target) || event.target.closest(`.${styles.dropdownButton}`)
      );

      if (!isClickInside) {
        setDropdownVisible({ recent: false, important: false });
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const addToRecentProjects = (projectId) => {
    setRecentProjects((prevRecentProjects) => {
      const updatedList = [projectId, ...prevRecentProjects.filter(id => id !== projectId)];
      if (updatedList.length > 5) {
        updatedList.pop();
      }
      localStorage.setItem('recentProjects', JSON.stringify(updatedList));
      return updatedList;
    });
  };

  const toggleDropdown = (type) => {
    setDropdownVisible(prev => ({
      ...prev,
      [type]: !prev[type],
      [type === 'recent' ? 'important' : 'recent']: false,
    }));
  };

  const toggleImportantStatus = (id) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, isImportant: !project.isImportant } : project
      )
    );
  };

  const validateProject = (data) => {
    if (!data.name.trim() || !data.description.trim()) {
      setErrorMessage('Project name and description are required.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const addProject = () => {
    if (!validateProject(createProjectData)) return;

    const id = projects.length + 1;
    const newProj = { ...createProjectData, id, isImportant: false };
    setProjects([...projects, newProj]);
    setCreateProjectData({ name: '', description: '' });
    setIsAddProjectVisible(false);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
    setRecentProjects(prevRecentProjects =>
      prevRecentProjects.filter(projectId => projectId !== id)
    );
    localStorage.setItem('recentProjects', JSON.stringify(recentProjects.filter(projectId => projectId !== id)));
  };

  const startEditing = (id) => {
    setIsEditing(id);
    const project = projects.find((project) => project.id === id);
    if (project) {
      setEditProjectData({ name: project.name, description: project.description });
      setIsEditModalVisible(true);
    } else {
      console.error('Project not found for editing.');
    }
  };

  const saveEdit = () => {
    if (!validateProject(editProjectData)) return;

    setProjects(prevProjects =>
      prevProjects.map((project) =>
        project.id === isEditing ? { ...project, ...editProjectData } : project
      )
    );
    setIsEditing(null);
    setEditProjectData({ name: '', description: '' });
    setIsEditModalVisible(false);
  };

  const resetEdit = () => {
    const project = projects.find((project) => project.id === isEditing);
    if (project) {
      setEditProjectData({ name: project.name, description: project.description });
      setErrorMessage(''); 
    } else {
      console.error('Project not found for editing.');
    }
  };
  
  const openDescriptionModal = (project) => {
    setSelectedProject(project);
    addToRecentProjects(project.id);
  };

  const closeDescriptionModal = () => {
    setSelectedProject(null);
  };

const Dropdown = ({ title, items, isVisible, onToggle }) => (
  <div className={styles.dropdown}>
    <button className={styles.dropdownButton} onClick={onToggle}>
      {title} ▼
    </button>
    {isVisible && (
      <ul className={`${styles.dropdownMenu} ${isVisible ? styles.dropdownMenuVisible : ''}`}>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className={styles.dropdownItem}>
              <Link to={`/project/${item.id}`} className={styles.dropdownLink}>
                {item.name}
              </Link>
            </li>
          ))
        ) : (
          <li className={styles.dropdownItem}>No {title.toLowerCase()} projects</li>
        )}
      </ul>
    )}
  </div>
);

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.header}>
        <h1 className={styles.appTitle}>Organiser_App</h1>
        <div className={styles.headerOptions}>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => toggleDropdown('recent')}
            >
              Recent ▼
            </button>
            {dropdownVisible.recent && (
              <ul className={`${styles.dropdownMenu} ${dropdownVisible.recent ? styles.dropdownMenuVisible : ''}`}>
                {recentProjects.length > 0 ? (
                  recentProjects.map((projectId) => {
                    const project = projects.find((project) => project.id === projectId);
                    return project ? (
                      <li key={project.id} className={styles.dropdownItem}>
                        <Link to={`/project/${project.id}`} className={styles.dropdownLink}>
                          {project.name}
                        </Link>
                      </li>
                    ) : null;
                  })
                ) : (
                  <li className={styles.dropdownItem}>No recent projects</li>
                )}
              </ul>
            )}
          </div>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownButton}
              onClick={() => toggleDropdown('important')}
            >
              Important ★
            </button>
            {dropdownVisible.important && (
              <ul className={`${styles.dropdownMenu} ${dropdownVisible.important ? styles.dropdownMenuVisible : ''}`}>
                {importantProjects.length > 0 ? (
                  importantProjects.map((project) => (
                    <li key={project.id} className={styles.dropdownItem}>
                      <Link to={`/project/${project.id}`} className={styles.dropdownLink}>
                        {project.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className={styles.dropdownItem}>No important projects</li>
                )}
              </ul>
            )}
          </div>
        </div>
        <button className={styles.createButton} onClick={() => setIsAddProjectVisible(true)}>
          Create project
        </button>
        <UserProfile username={username || 'Guest'} />
      </div>

      {isAddProjectVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create new project</h2>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <input
              type="text"
              placeholder="Project Name"
              value={createProjectData.name}
              onChange={(e) => setCreateProjectData({ ...createProjectData, name: e.target.value })}
            />
            <textarea
              placeholder="Project Description"
              value={createProjectData.description}
              onChange={(e) => setCreateProjectData({ ...createProjectData, description: e.target.value })}
            />
            <button onClick={addProject}>Add</button>
            <button onClick={() => setIsAddProjectVisible(false)}>Close</button>
          </div>
          
        </div>
      )}

      {isEditModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Project</h2>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <input
              type="text"
              placeholder="Project Name"
              value={editProjectData.name}
              onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })}
            />
            <textarea
              placeholder="Project Description"
              value={editProjectData.description}
              onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
            />
            <button onClick={saveEdit}>Save</button>
            <button onClick={resetEdit}>Reset</button>
            <button onClick={() => setIsEditModalVisible(false)}>Close</button>
          </div>
        </div>
      )}

{selectedProject && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h2>{selectedProject.name}</h2>
      <div className={styles.detailsText}>
        <pre>{selectedProject.description}</pre>
      </div>
      <button onClick={closeDescriptionModal}>Close</button>
    </div>
  </div>
)}


      <h1 className={styles.title}>Projects</h1>
      <div className={styles.projectsContainer}>
        {projects.map((project) => (
          <div className={styles.projectCard} key={project.id}>
            <h2>
              {project.name}{' '}
              <span
                className={`${styles.star} ${project.isImportant ? styles.activeStar : ''}`}
                onClick={() => toggleImportantStatus(project.id)}
              >
                ★
              </span>
            </h2>
            <p>
        {project.description.length > 100 ? (
          <>
            {project.description.slice(0, 100)}...
            <button className={styles.detailsButton} onClick={() => openDescriptionModal(project)}>
              More details
            </button>
          </>
        ) : (
          project.description
        )}
      </p>
            <div className={styles.cardActions}>
            <EditButton onEdit={() => startEditing(project.id)} />
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => deleteProject(project.id)}
              >
                Delete
              </button>
              <Link to={`/project/${project.id}`} className={`${styles.actionButton} ${styles.viewButton}`}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
