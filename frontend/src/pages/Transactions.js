import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError } from '../utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Transactions() {
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate();

    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data || []);
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const income = expenses.filter(item => item.type === 'Credit').reduce((acc, item) => acc + item.amount, 0);
    const expense = expenses.filter(item => item.type === 'Debit').reduce((acc, item) => acc + item.amount, 0);

    const data = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount',
                data: [income, expense],
                backgroundColor: ['#27ae60', '#e74c3c'],
                borderWidth: 1,
            },
        ],
    };

    const handleEdit = (expense) => {
        navigate('/home', { state: { editExpense: expense } }); // ✅ Send selected transaction
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Transaction History</h1>
            <table border="1" style={{ width: '100%', marginBottom: '20px', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={index}>
                            <td>{expense.text}</td>
                            <td style={{ color: expense.type === 'Credit' ? 'green' : 'red' }}>₹{expense.amount}</td>
                            <td>{expense.type}</td>
                            <td>{expense.date ? new Date(expense.date).toLocaleDateString() : 'No Date'}</td>
                            <td>
                                <button onClick={() => handleEdit(expense)}>Edit</button> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pie-chart-container">
                <h2>Expense vs Income</h2>
                <Pie data={data} />
            </div>

            <button onClick={() => navigate('/home')} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
                Back to Home
            </button>
        </div>
    );
}

export default Transactions;
