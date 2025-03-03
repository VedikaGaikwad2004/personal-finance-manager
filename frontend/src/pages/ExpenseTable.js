import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {
    return (
        <div className="expense-list">
            {expenses.map((expense, index) => (
                <div key={index} className="expense-item">
                    <button className="delete-button" onClick={() => deleteExpens(expense._id)}>X</button>
                    <div className="expense-description">{expense.text}</div>
                    <div
                        className="expense-amount"
                        style={{ color: expense.type === 'Credit' ? 'green' : 'red' }} // ✅ Fix: Correct color logic
                    >
                        ₹{expense.amount}
                    </div>
                    <div className="expense-date">
                        {expense.date ? new Date(expense.date).toLocaleDateString() : 'No Date'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExpenseTable;



