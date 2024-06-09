// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Login from './components/Login';
import Header from './components/Header';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
