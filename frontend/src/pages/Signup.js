import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';

const Signup = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${APIUrl}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess('Signup successful. Please log in.');
                navigate('/login');
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('Signup failed');
        }
    };

    return (
        <div className="container">
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={userData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
