import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/RegisterPage'
import LoginPage from './pages/LoginPage/LoginPage'
import BoardPage from './pages/BoardPage/BoardPage'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import ProjectPage from './pages/ProjectPage/ProjectPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';

const AppContent = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/reset-password' element={<ResetPasswordPage />} />
                <Route path='/board' element={<BoardPage />} />
                <Route path='/project/:projectId' element={<ProjectPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;