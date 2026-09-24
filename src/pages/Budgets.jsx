import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function Budgets() {

  const [budgets, setBudgets] = useState([]);

  const [categories, setCategories] =
    useState([]);

  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    month: "2026-09"
  });


  const token =
    localStorage.getItem("token");


  // ==============================
  // GET CATEGORIES
  // ==============================

  const getCategories = async () => {

    try {

      const response =
        await axios.get(
          `${API_BASE_URL}/api/categories`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const expenseCategories =
        (response.data.categories || []).filter(
          (category) =>
            category.type === "expense"
        );

      setCategories(
        expenseCategories
      );

    } catch (error) {

      console.log(error);

    }

  };


  // ==============================
  // GET BUDGET CALCULATIONS
  // ==============================

  const getBudgets = async () => {

    try {

      const response =
        await axios.get(
          `${API_BASE_URL}/api/budgets/calculations`,
          {
            params: {
              month: form.month
            },

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setBudgets(
        response.data
      );

    } catch (error) {

      console.log(error);

    }

  };


  useEffect(() => {

    getCategories();

  }, []);


  useEffect(() => {

    getBudgets();

  }, [form.month]);


  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };


  // ==============================
  // ADD BUDGET
  // ==============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `${API_BASE_URL}/api/budgets`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "Budget added successfully"
      );

      setForm({
        ...form,
        category_id: "",
        amount: ""
      });

      getBudgets();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to add budget"
      );

    }

  };


  // ==============================
  // DELETE BUDGET
  // ==============================

  const deleteBudget = async (id) => {

    try {

      await axios.delete(
        `${API_BASE_URL}/api/budgets/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      getBudgets();

    } catch (error) {

      console.log(error);

    }

  };

  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.budgetAmount || 0),
    0
  );
  const totalSpent = budgets.reduce(
    (total, budget) => total + Number(budget.spent || 0),
    0
  );
  const totalRemaining = totalBudget - totalSpent;


  return (

    <div className="container mt-4 budgets-page">

      <div className="budgets-page-header">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Budgets</h2>
          <p className="subheading">
            Set monthly limits and keep every category on track.
          </p>
        </div>
        <div className="budget-month-badge">
          <span>Viewing</span>
          <strong>{form.month}</strong>
        </div>
      </div>

      <div className="budget-summary-grid">
        <div className="budget-summary-card planned">
          <span>Total planned</span>
          <strong>₹{totalBudget.toFixed(2)}</strong>
        </div>
        <div className="budget-summary-card spent">
          <span>Total spent</span>
          <strong>₹{totalSpent.toFixed(2)}</strong>
        </div>
        <div className="budget-summary-card remaining">
          <span>Remaining</span>
          <strong>₹{totalRemaining.toFixed(2)}</strong>
        </div>
      </div>


      {/* ADD BUDGET */}

      <div className="card p-3 mt-3 budget-form-card">

        <div className="budget-section-heading">
          <div>
            <p className="eyebrow small">New limit</p>
            <h5>Add Monthly Budget</h5>
          </div>
          <span className="budget-form-icon">+</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="budget-form"
        >

          <div className="budget-field">

            <label>
              Category
            </label>

            <select
              className="form-control"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (

                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>

                )
              )}

            </select>

          </div>


          <div className="budget-field">

            <label>
              Amount
            </label>

            <input
              type="number"
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              required
            />

          </div>


          <div className="budget-field">

            <label>
              Month
            </label>

            <input
              type="month"
              className="form-control"
              name="month"
              value={form.month}
              onChange={handleChange}
              required
            />

          </div>


          <button
            className="btn btn-primary budget-submit"
            type="submit"
          >
            Add Budget
          </button>

        </form>

      </div>


      {/* BUDGET LIST */}

      <div className="row mt-4 budget-list-grid">

        {budgets.map(
          (budget) => (

            <div
              className="col-md-4 mb-3"
              key={budget._id}
            >

              <div className={`card p-3 budget-card ${budget.status.toLowerCase()}`}>

                <div className="budget-card-header">
                  <div>
                    <p className="eyebrow small">Category limit</p>
                    <h5>
                      {budget.category.name}
                    </h5>
                  </div>
                  <span className="budget-status">
                    {budget.status}
                  </span>
                </div>

                <div className="budget-card-numbers">
                  <div>
                    <span>Spent</span>
                    <strong>₹{Number(budget.spent).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>Limit</span>
                    <strong>₹{Number(budget.budgetAmount).toFixed(2)}</strong>
                  </div>
                </div>

                <div
                  className="progress"
                  style={{
                    height: "20px"
                  }}
                >

                  <div
                    className="progress-bar budget-progress-bar"
                    style={{
                      width:
                        `${Math.min(
                          budget.percentage,
                          100
                        )}%`
                    }}
                  >

                    <span>{budget.percentage}%</span>

                  </div>

                </div>


                <div className="budget-card-footer">
                  <span>
                    {budget.remaining >= 0 ? "Remaining" : "Over budget"}
                  </span>
                  <strong>₹{Math.abs(Number(budget.remaining)).toFixed(2)}</strong>
                </div>


                <button
                  className="btn btn-outline-danger budget-delete"
                  onClick={() =>
                    deleteBudget(
                      budget._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default Budgets;