import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    useEffect(() => {
        if (expenses.length > 0) {
            const income = expenses
                .filter(item => item.type === 'Credit') // Only credits
                .reduce((acc, item) => acc + item.amount, 0);
            
            const exp = expenses
                .filter(item => item.type === 'Debit') // Only debits
                .reduce((acc, item) => acc + item.amount, 0);
            
            setIncomeAmt(income);
            setExpenseAmt(exp);
        } else {
            setIncomeAmt(0);
            setExpenseAmt(0);
        }
    }, [expenses]);

    const deleteExpense = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchExpenses = useCallback(async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return (
        <div>
            <div className='user-section'>
                <h1>Welcome {loggedInUser}..!</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ExpenseDetails
                incomeAmt={incomeAmt}
                expenseAmt={expenseAmt}
            />

            <ExpenseForm addTransaction={addTransaction} />

            <ExpenseTable expenses={expenses} deleteExpens={deleteExpense} />

            <ToastContainer />
        </div>
    );
}

export default Home;

