import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import { Link } from 'react-router-dom';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [editExpense, setEditExpense] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

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
            const fetchedExpenses = Array.isArray(result.data) ? result.data : [];
            setExpenses(fetchedExpenses);

            // ✅ Update balance
            const income = fetchedExpenses.filter(item => item.type === 'Credit').reduce((acc, item) => acc + item.amount, 0);
            const expense = fetchedExpenses.filter(item => item.type === 'Debit').reduce((acc, item) => acc + item.amount, 0);
            setIncomeAmt(income);
            setExpenseAmt(expense);

        } catch (err) {
            handleError(err);
            setExpenses([]);
        }
    }, [navigate]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    useEffect(() => {
        if (location.state?.editExpense) {
            setEditExpense(location.state.editExpense);
        }
    }, [location.state]);

    // ✅ Add or Update Transaction
    const handleTransaction = async (data) => {
        try {
            if (editExpense) {
                // ✅ API call to update existing transaction
                const response = await fetch(`${APIUrl}/expenses/${editExpense._id}`, {
                    method: "PUT",
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const result = await response.json();
                handleSuccess(result?.message);

                // ✅ Update state after editing
                setExpenses(prev => prev.map(exp => (exp._id === editExpense._id ? result.data : exp)));
            } else {
                // ✅ API call to add a new transaction
                const response = await fetch(`${APIUrl}/expenses`, {
                    method: "POST",
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const result = await response.json();
                handleSuccess(result?.message);
                setExpenses(prev => [...prev, result.data]);
            }
        } catch (err) {
            handleError(err);
        }

        // ✅ Clear Edit Mode
        setEditExpense(null);
    };

    // ✅ Function to clear edit mode
    const clearEdit = () => {
        setEditExpense(null);
    };

    return (
        <div>
            <div className="fixed-header">
                <h1>Welcome {loggedInUser}..!</h1>
                <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
                <button className="logout-btn" onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('loggedInUser');
                    handleSuccess('User Logged out');
                    setTimeout(() => navigate('/login'), 1000);
                }}>Logout</button>
            </div>

            <div className="content">
                <ExpenseForm addTransaction={handleTransaction} editExpense={editExpense} clearEdit={clearEdit} />
                <ExpenseTable expenses={expenses} />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/transactions">
                        <button style={{ padding: '10px', fontSize: '16px' }}>See Your Transactions</button>
                    </Link>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;





