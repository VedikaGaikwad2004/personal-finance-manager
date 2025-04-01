import React from 'react';

const ExpenseTable = ({ expenses = [], deleteExpens }) => {
    if (!Array.isArray(expenses)) {
        return <p>No expenses found.</p>; // ✅ Prevents crashes if expenses is not an array
    }

    return (
        <div className="expense-list">
            {expenses.length === 0 ? (
                <p>No transactions available.</p> // ✅ Show message when there are no expenses
            ) : (
                expenses.map((expense, index) => (
                    <div key={index} className="expense-item">
                        <button className="delete-button" onClick={() => deleteExpens(expense._id)}>X</button>
                        <div className="expense-description">{expense.text}</div>
                        <div
                            className="expense-amount"
                            style={{ color: expense.type === 'Credit' ? 'green' : 'red' }}
                        >
                            ₹{expense.amount}
                        </div>
                        <div className="expense-date">
                            {expense.date ? new Date(expense.date).toLocaleDateString() : 'No Date'}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ExpenseTable;




