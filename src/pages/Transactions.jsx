import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "expense",
    amount: "",
    merchant: "",
    note: "",
    occurred_at: "",
  });

  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const startEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      type: transaction.type || "expense",
      amount: transaction.amount || "",
      merchant: transaction.merchant || "",
      note: transaction.note || "",
      occurred_at: transaction.occurred_at
        ? new Date(transaction.occurred_at).toISOString().slice(0, 16)
        : "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveTransaction = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/transactions/${id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update transaction");
    }
  };

  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTransactions();
    } catch (error) {
      alert("Failed to delete transaction");
    }
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="container mt-4 transactions-page">
      <div className="transactions-page-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Transactions</h2>
          <p className="subheading">Review, update, and manage your money movement.</p>
        </div>

        <Link to="/add-transaction" className="primary-btn transaction-add-button">
          + Add Transaction
        </Link>
      </div>

      <div className="transaction-summary-grid">
        <div className="transaction-summary income">
          <span>Total income</span>
          <strong>₹{totalIncome.toFixed(2)}</strong>
        </div>
        <div className="transaction-summary expense">
          <span>Total expenses</span>
          <strong>₹{totalExpense.toFixed(2)}</strong>
        </div>
        <div className="transaction-summary balance">
          <span>Net balance</span>
          <strong>₹{balance.toFixed(2)}</strong>
        </div>
        <div className="transaction-summary count">
          <span>Transactions</span>
          <strong>{transactions.length}</strong>
        </div>
      </div>

      <div className="card shadow transaction-table-card">
        <div className="transaction-table-heading">
          <div>
            <p className="eyebrow small">Your activity</p>
            <h4>All transactions</h4>
          </div>
          <span>{transactions.length} record{transactions.length === 1 ? "" : "s"}</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {editingId === transaction._id ? (
                        <input
                          type="datetime-local"
                          className="form-control form-control-sm"
                          name="occurred_at"
                          value={editForm.occurred_at}
                          onChange={handleEditChange}
                        />
                      ) : (
                        new Date(transaction.occurred_at).toLocaleDateString()
                      )}
                    </td>

                    <td>
                      {editingId === transaction._id ? (
                        <select
                          className="form-select form-select-sm"
                          name="type"
                          value={editForm.type}
                          onChange={handleEditChange}
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      ) : (
                        <span className={`transaction-type ${transaction.type}`}>
                          {transaction.type}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="transaction-category">
                        {transaction.category_id?.name || "Other"}
                      </span>
                    </td>

                    <td>
                      {editingId === transaction._id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="merchant"
                          value={editForm.merchant}
                          onChange={handleEditChange}
                        />
                      ) : (
                        transaction.merchant
                      )}
                    </td>

                    <td>
                      {editingId === transaction._id ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="amount"
                          value={editForm.amount}
                          onChange={handleEditChange}
                          min="0.01"
                        />
                      ) : (
                        `₹${Number(transaction.amount).toFixed(2)}`
                      )}
                    </td>

                    <td>
                      {editingId === transaction._id ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveTransaction(transaction._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm transaction-action edit"
                            onClick={() => startEdit(transaction)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-sm transaction-action delete"
                            onClick={() => deleteTransaction(transaction._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;