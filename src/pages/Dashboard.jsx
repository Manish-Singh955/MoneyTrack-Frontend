import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const carouselItems = [
  {
    title: "Track every rupee",
    description: "Stay on top of spending with real-time transaction tracking and smarter money habits.",
    accent: "purple",
  },
  {
    title: "Budget smarter",
    description: "Set category limits and get instant alerts before your spending gets out of control.",
    accent: "green",
  },
  {
    title: "See your growth",
    description: "View clear insights and analytics that help you save more with less effort.",
    accent: "blue",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [dashboard, setDashboard] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
    topCategory: "No data",
    recentTransactions: [],
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState([]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const getDashboard = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const month = new Date().toISOString().slice(0, 7);
      const [dashboardResponse, budgetResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/summary`, { headers }),
        axios.get(`${API_BASE_URL}/api/budgets/calculations`, {
          params: { month },
          headers,
        }),
      ]);

      setDashboard(dashboardResponse.data);
      setBudgetProgress(budgetResponse.data);
    } catch (error) {
      console.log("Dashboard error:", error);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const recentTransactions = dashboard.recentTransactions || [];

  const statCards = [
    {
      label: "Total Balance",
      value: formatCurrency(dashboard.balance),
      accent: "balance",
      note: "+12.5% vs last month",
    },
    {
      label: "Total Income",
      value: formatCurrency(dashboard.totalIncome),
      accent: "income",
      note: "This month",
    },
    {
      label: "Total Expense",
      value: formatCurrency(dashboard.totalExpense),
      accent: "expense",
      note: "This month",
    },
  ];

  const savingsRate =
    dashboard.totalIncome > 0
      ? Math.max(0, Math.round((dashboard.balance / dashboard.totalIncome) * 100))
      : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselItems.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-shell">
      <main className="container dashboard-content">
        {location.state?.message && (
          <div className={`alert alert-${location.state.type || "info"}`}>
            {location.state.message}
          </div>
        )}

        <header className="page-header">
          <div className="welcome-heading">
            <div className="welcome-avatar-wrap">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name || "User"} avatar`}
                  className="welcome-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="welcome-avatar-fallback">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <p className="eyebrow">Overview</p>
              <h1>Welcome back, {user?.name || "User"}</h1>
              <p className="subheading">Your personal finance dashboard</p>
            </div>
          </div>

          <div className="header-actions">
            <Link to="/add-transaction" className="primary-btn">
              + Add Transaction
            </Link>
            <Link to="/transactions" className="secondary-btn">
              View Transactions
            </Link>
          </div>
        </header>

        <section className="hero-carousel">
          <div className={`carousel-slide ${carouselItems[activeSlide].accent}`}>
            <div className="carousel-text">
              <p className="eyebrow small">Finance assistant</p>
              <h2>{carouselItems[activeSlide].title}</h2>
              <p>{carouselItems[activeSlide].description}</p>
              <Link to="/transactions" className="carousel-btn">
                Explore now
              </Link>
            </div>
            <div className="carousel-graphic">
              <div className="mini-card mini-card-top">₹ 24,500</div>
              <div className="mini-card mini-card-middle">+18.4%</div>
              <div className="mini-card mini-card-bottom">Budget OK</div>
            </div>
          </div>

          <div className="carousel-dots">
            {carouselItems.map((item, index) => (
              <button
                key={item.title}
                className={index === activeSlide ? "dot active" : "dot"}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="stats-grid">
          {statCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.accent}`}>
              <div className="stat-header">
                <span>{card.label}</span>
                <span className="stat-badge">Live</span>
              </div>

              <h2>{card.value}</h2>
              <p>{card.note}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="panel transactions-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Transactions</p>
                <h3>Recent Activity</h3>
              </div>
              <Link to="/transactions" className="text-link">
                View all
              </Link>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <tr key={transaction._id || transaction.id}>
                        <td>
                          <span
                            className={
                              transaction.type === "income" ? "pill success" : "pill danger"
                            }
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td
                          className={
                            transaction.type === "income" ? "amount-income" : "amount-expense"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td>{transaction.category_id?.name || "Other"}</td>
                        <td>
                          {transaction.occurred_at
                            ? new Date(transaction.occurred_at).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel side-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Summary</p>
                <h3>Budget Progress</h3>
              </div>
            </div>

            <div className="budget-list">
              {budgetProgress.length === 0 ? (
                <p className="empty-state">No budgets for this month</p>
              ) : budgetProgress.map((budget) => (
                <div key={budget._id} className="budget-item">
                  <div className="budget-meta">
                    <span>{budget.category?.name || "Other"}</span>
                    <strong>{formatCurrency(budget.budgetAmount)}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, Math.max(0, budget.percentage))}%`,
                        background: budget.status === "Exceeded" ? "#ef4444" : "#10b981",
                      }}
                    ></div>
                  </div>
                  <small>
                    {budget.percentage}% used · {formatCurrency(budget.spent)} spent
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="panel side-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow small">Highlights</p>
                <h3>Quick Insights</h3>
              </div>
            </div>

            <div className="insight-stack">
              <div className="insight-box">
                <span className="insight-label">Transactions</span>
                <strong>{dashboard.transactionCount || recentTransactions.length}</strong>
              </div>
              <div className="insight-box">
                <span className="insight-label">Savings Rate</span>
                <strong>{savingsRate}%</strong>
              </div>
              <div className="insight-box">
                <span className="insight-label">Top Category</span>
                <strong>{dashboard.topCategory || "No data"}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;