import React from 'react';
import styles from './BoardPage.module.css'; // Переконайтеся, що стилі включають `actionButton` та `editButton`.

const EditButton = ({ onEdit }) => (
  <button
    className={`${styles.actionButton} ${styles.editButton}`}
    onClick={onEdit}
  >
    Edit
  </button>
);

export default EditButton;
