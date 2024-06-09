// src/components/Header.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user } = useContext(AuthContext);

    return (
        <header>
            <nav>
                <ul>
                    {user?.isAdmin && <li><a href="/admin">Admin Panel</a></li>}
                    {user?.isTechnician && <li><a href="/technician">Technician Dashboard</a></li>}
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
