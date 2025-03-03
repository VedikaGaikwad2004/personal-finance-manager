import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    return (
        <div>
            <div>Your Balance is ₹ {incomeAmt - expenseAmt}</div>
            <div className="amounts-container">
                <span style={{ color: 'green' }}>Income: ₹{incomeAmt}</span>
                <span style={{ color: 'red', marginLeft: '20px' }}>Expense: ₹{expenseAmt}</span>
            </div>
        </div>
    );
}

export default ExpenseDetails;


