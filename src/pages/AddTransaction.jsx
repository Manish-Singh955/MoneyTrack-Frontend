import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddTransaction() {

  const navigate = useNavigate();

  const [categories, setCategories] =
    useState([]);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category_id: "",
    merchant: "",
    note: "",
    occurred_at: "",
  });


  const token =
    localStorage.getItem("token");


  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/api/categories",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCategories(
          response.data.categories
        );

      } catch (error) {

        console.log(error);

      }

    };

    fetchCategories();

  }, [token]);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/transactions",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Transaction added successfully"
      );

      navigate("/transactions");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to add transaction"
      );

    }

  };


  return (
    <div className="container mt-4 add-transaction-page">

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card shadow p-4 transaction-form-card">

            <div className="transaction-form-header">
              <div>
                <p className="eyebrow">Money movement</p>
                <h2>Add Transaction</h2>
                <p className="subheading">
                  Record an income or expense to keep your dashboard accurate.
                </p>
              </div>
              <div className="transaction-form-icon">₹</div>
            </div>


            <form
              onSubmit={handleSubmit}
            >

              {/* Type */}

              <div className="transaction-form-grid">

              <div className="transaction-field">

                <label className="form-label">
                  Transaction Type
                </label>

                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>

                </select>

              </div>


              {/* Amount */}

              <div className="transaction-field transaction-amount-field">

                <label className="form-label">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  className="form-control transaction-amount-input"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  required
                />

              </div>


              {/* Category */}

              <div className="transaction-field">

                <label className="form-label">
                  Category
                </label>

                <select
                  name="category_id"
                  className="form-select"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories
                    .filter(
                      (category) =>
                        category.type ===
                        formData.type
                    )
                    .map((category) => (

                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.icon}{" "}
                        {category.name}
                      </option>

                    ))}

                </select>

              </div>


              {/* Merchant */}

              <div className="transaction-field">

                <label className="form-label">
                  Merchant / Source
                </label>

                <input
                  type="text"
                  name="merchant"
                  className="form-control"
                  value={formData.merchant}
                  onChange={handleChange}
                />

              </div>


              {/* Note */}

              <div className="transaction-field transaction-note-field">

                <label className="form-label">
                  Note
                </label>

                <textarea
                  name="note"
                  className="form-control"
                  value={formData.note}
                  onChange={handleChange}
                />

              </div>


              {/* Date */}

              <div className="transaction-field">

                <label className="form-label">
                  Date & Time
                </label>

                <input
                  type="datetime-local"
                  name="occurred_at"
                  className="form-control"
                  value={formData.occurred_at}
                  onChange={handleChange}
                  required
                />

              </div>


              <button
                type="submit"
                className="btn btn-primary transaction-submit"
              >
                Save Transaction
              </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddTransaction;