const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction } = require('../Controllers/ExpenseController');
const authMiddleware = require('../Middlewares/Auth'); // ✅ Import authentication middleware

const router = express.Router();

// ✅ Protect routes using `authMiddleware`
router.get('/', authMiddleware, getAllTransactions);
router.post('/', authMiddleware, addTransaction);
router.delete('/:expenseId', authMiddleware, deleteTransaction);

module.exports = router;
