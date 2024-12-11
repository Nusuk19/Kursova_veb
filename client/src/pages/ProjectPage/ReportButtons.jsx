import React from 'react';
import styles from './ProjectPage.module.css';

const ReportButtons = ({ generatePDFReport, generateDOCXReport, toggleAnalysisVisibility, showAnalysis }) => (
  <div className={styles.reportButtons}>
    <button onClick={generatePDFReport} className={styles.reportButton}>Download PDF</button>
    <button onClick={generateDOCXReport} className={styles.reportButton}>Download DOCX</button>
    <button className={styles.toggleAnalysisButton} onClick={toggleAnalysisVisibility}>
      {showAnalysis ? 'Hide Data Analysis' : 'Show Data Analysis'}
    </button>
  </div>
);

export default ReportButtons;
