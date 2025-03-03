import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        text: '',
        amount: '',
        type: 'Debit', // Default to Debit
        date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo(prev => ({ ...prev, [name]: value }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { text, amount, type, date } = expenseInfo;

        if (!text || !amount || !date) {
            handleError('Please fill in all fields');
            return;
        }

        addTransaction({ text, amount: parseFloat(amount), type, date });
        setExpenseInfo({ text: '', amount: '', type: 'Debit', date: '' });
    };

    return (
        <div className='container'>
            <h1>Personal Finance Manager Application</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label>Expense Detail</label>
                    <input type='text' name='text' placeholder='Enter your Expense Detail...' value={expenseInfo.text} onChange={handleChange} />
                </div>
                <div>
                    <label>Amount</label>
                    <input type='number' name='amount' placeholder='Enter your Amount...' value={expenseInfo.amount} onChange={handleChange} />
                </div>
                <div>
                    <label>Type</label>
                    <select name="type" value={expenseInfo.type} onChange={handleChange}>
                        <option value="Debit">Debit (Expense)</option>
                        <option value="Credit">Credit (Income)</option>
                    </select>
                </div>
                <div>
                    <label>Date</label>
                    <input type='date' name='date' value={expenseInfo.date} onChange={handleChange} />
                </div>
                <button type='submit'>Add Transaction</button>
            </form>
        </div>
    );
}

export default ExpenseForm;


