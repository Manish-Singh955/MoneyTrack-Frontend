import { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState("2026-09");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [monthlyResponse, categoryResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/analytics/monthly", {
            params: { month },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/analytics/category-expenses", {
            params: { month },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAnalytics(monthlyResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnalytics();
  }, [month, token]);

  const maxCategoryAmount = Math.max(
    ...categories.map((item) => Number(item.amount)),
    0
  );
  const chartColors = [
    "#14b8a6",
    "#38bdf8",
    "#f59e0b",
    "#f43f5e",
    "#8b5cf6",
    "#84cc16",
  ];
  const totalCategoryAmount = categories.reduce(
    (total, item) => total + Number(item.amount),
    0
  );
  let chartStart = 0;
  const chartSegments = categories.map((item, index) => {
    const percentage = totalCategoryAmount
      ? (Number(item.amount) / totalCategoryAmount) * 100
      : 0;
    const segment = `${chartColors[index % chartColors.length]} ${chartStart}% ${chartStart + percentage}%`;
    chartStart += percentage;
    return segment;
  });
  const chartBackground = chartSegments.length
    ? `conic-gradient(${chartSegments.join(", ")})`
    : "#e2e8f0";
  const savingsRate = analytics?.totalIncome > 0
    ? Math.round((analytics.balance / analytics.totalIncome) * 100)
    : 0;

  return (
    <div className="container mt-4 analytics-page">
      <div className="analytics-page-header">
        <div>
          <p className="eyebrow">Financial overview</p>
          <h2>Analytics</h2>
          <p className="subheading">Understand where your money goes each month.</p>
        </div>
        <div className="analytics-month-control">
          <label htmlFor="analytics-month">Reporting month</label>
          <input
            id="analytics-month"
            type="month"
            className="form-control"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </div>
      </div>

      {analytics && (
        <div className="analytics-summary-grid">
          <div className="analytics-summary income">
            <span>Income</span>
            <strong>₹{Number(analytics.totalIncome).toFixed(2)}</strong>
          </div>
          <div className="analytics-summary expense">
            <span>Expenses</span>
            <strong>₹{Number(analytics.totalExpense).toFixed(2)}</strong>
          </div>
          <div className="analytics-summary balance">
            <span>Balance</span>
            <strong>₹{Number(analytics.balance).toFixed(2)}</strong>
          </div>
          <div className="analytics-summary rate">
            <span>Savings rate</span>
            <strong>{savingsRate}%</strong>
          </div>
        </div>
      )}

      <div className="analytics-section card">
        <div className="analytics-section-heading">
          <div>
            <p className="eyebrow small">Spending breakdown</p>
            <h3>Category-wise Expenses</h3>
          </div>
          <span>{categories.length} categor{categories.length === 1 ? "y" : "ies"}</span>
        </div>

        {categories.length > 0 ? (
          <>
            <div className="analytics-chart-grid">
              <div className="analytics-bar-chart" aria-label="Category expense bar chart">
                {categories.map((item) => {
                  const amount = Number(item.amount);
                  const barWidth = maxCategoryAmount
                    ? `${(amount / maxCategoryAmount) * 100}%`
                    : "0%";

                  return (
                    <div className="analytics-bar-row" key={`bar-${item.category}`}>
                      <div className="analytics-bar-label">
                        <span>{item.category}</span>
                        <strong>₹{amount.toFixed(2)}</strong>
                      </div>
                      <div className="analytics-bar-track">
                        <div className="analytics-bar-fill" style={{ width: barWidth }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="analytics-donut-section">
                <div
                  className="analytics-donut"
                  style={{ background: chartBackground }}
                  aria-label="Category expense doughnut chart"
                >
                  <div className="analytics-donut-hole">
                    <span>Total</span>
                    <strong>₹{totalCategoryAmount.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="analytics-chart-legend">
                  {categories.map((item, index) => (
                    <div className="analytics-legend-item" key={`legend-${item.category}`}>
                      <span
                        className="analytics-legend-swatch"
                        style={{ background: chartColors[index % chartColors.length] }}
                      />
                      <span>{item.category}</span>
                      <strong>
                        {totalCategoryAmount
                          ? `${((Number(item.amount) / totalCategoryAmount) * 100).toFixed(1)}%`
                          : "0%"}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted mb-3">No expense data for this month.</p>
        )}

        <div className="table-responsive analytics-table-wrap">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>₹{Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
