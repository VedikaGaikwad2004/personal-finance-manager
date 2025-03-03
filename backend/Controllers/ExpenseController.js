const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body);

    try {
        // ✅ Destructure required fields
        const { text, amount, type, date } = req.body;

        // ✅ Ensure all required fields are present
        if (!text || !amount || !type || !date) {
            return res.status(400).json({
                message: "All fields (text, amount, type, date) are required",
                success: false
            });
        }

        // ✅ Push expense with correct date format
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: { text, amount, type, date: new Date(date) } } },
            { new: true } // ✅ Return updated data
        );

        res.status(200).json({
            message: "Expense added successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body);
    try {
        const userData = await UserModel.findById(_id).select('expenses');
        res.status(200).json({
            message: "Fetched Expenses successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // ✅ Return updated data after deletion
        );

        res.status(200).json({
            message: "Expense Deleted successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
};
