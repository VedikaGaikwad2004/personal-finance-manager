import React, { useEffect, useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction, editExpense, clearEdit }) {
    const [expenseInfo, setExpenseInfo] = useState({
        text: '',
        amount: '',
        type: 'Debit',
        date: ''
    });

    useEffect(() => {
        if (editExpense) {
            setExpenseInfo(editExpense);
        }
    }, [editExpense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo(prev => ({ ...prev, [name]: value }));
    };

    const submitExpense = (e) => {
        e.preventDefault();
        const { text, amount, type, date } = expenseInfo;

        if (!text || !amount || !date) {
            handleError('Please fill in all fields');
            return;
        }

        addTransaction({ text, amount: parseFloat(amount), type, date });
        clearEdit(); // ✅ Clears edit mode after update

        setExpenseInfo({ text: '', amount: '', type: 'Debit', date: '' });
    };

    return (
        <div className='container'>
            <h2>{editExpense ? 'Edit Transaction' : 'Add New Transaction'}</h2>
            <form onSubmit={submitExpense}>
                <div>
                    <label>Expense Detail</label>
                    <input type='text' name='text' value={expenseInfo.text} onChange={handleChange} />
                </div>
                <div>
                    <label>Amount</label>
                    <input type='number' name='amount' value={expenseInfo.amount} onChange={handleChange} />
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
                <button type='submit'>{editExpense ? 'Update Transaction' : 'Add Transaction'}</button>
                {editExpense && <button type="button" onClick={clearEdit} style={{ marginLeft: '10px' }}>Cancel</button>}
            </form>
        </div>
    );
}

export default ExpenseForm;





