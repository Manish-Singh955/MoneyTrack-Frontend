import { useEffect, useState } from "react";
import axios from "axios";

function Insights() {
  const [insights, setInsights] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getInsights = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insights", {
          params: { month },
          headers: { Authorization: `Bearer ${token}` },
        });
        setInsights(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getInsights();
  }, [month, token]);

  const insightItems = insights?.insights || [];
  const income = Number(insights?.income || 0);
  const expense = Number(insights?.expense || 0);
  const savings = income - expense;
  const usage = income > 0 ? Math.round((expense / income) * 100) : 0;
  const health = income === 0
    ? "Getting started"
    : savings >= 0 && usage < 50
      ? "Strong month"
      : savings >= 0
        ? "Watch your spending"
        : "Needs attention";

  const getInsightClass = (insight) => {
    const text = insight.toLowerCase();
    if (text.includes("higher") || text.includes("80%")) return "risk";
    if (text.includes("below 50%") || text.includes("saving")) return "positive";
    return "neutral";
  };

  return (
    <div className="container mt-4 insights-page">
      <div className="insights-page-header">
        <div>
          <p className="eyebrow">Personal guidance</p>
          <h2>Financial Insights</h2>
          <p className="subheading">A clearer read on your spending habits this month.</p>
        </div>
        <div className="insights-month-control">
          <label htmlFor="insights-month">Month</label>
          <input
            id="insights-month"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {!insights ? (
        <div className="card p-4 text-center">Loading your insights...</div>
      ) : (
        <>
          <div className="insights-summary-grid">
            <div className="insights-summary income">
              <span>Income</span>
              <strong>₹{income.toFixed(2)}</strong>
            </div>
            <div className="insights-summary expense">
              <span>Expenses</span>
              <strong>₹{expense.toFixed(2)}</strong>
            </div>
            <div className="insights-summary savings">
              <span>Net savings</span>
              <strong>₹{savings.toFixed(2)}</strong>
            </div>
            <div className="insights-summary health">
              <span>Health check</span>
              <strong>{health}</strong>
            </div>
          </div>

          <div className="insights-health-card">
            <div>
              <p className="eyebrow small">Income usage</p>
              <h4>{usage}% of income spent</h4>
            </div>
            <div className="insights-health-track">
              <div
                className={`insights-health-fill ${usage > 100 ? "over" : ""}`}
                style={{ width: `${Math.min(100, Math.max(0, usage))}%` }}
              />
            </div>
          </div>

          <section className="insights-list">
            <div className="insights-list-heading">
              <div>
                <p className="eyebrow small">What stands out</p>
                <h3>Recommendations for {month}</h3>
              </div>
              <span>{insightItems.length} insight{insightItems.length === 1 ? "" : "s"}</span>
            </div>

            {insightItems.length === 0 ? (
              <div className="insight-card neutral">
                <span className="insight-card-icon">✓</span>
                <div>
                  <strong>Everything looks steady</strong>
                  <p>No additional recommendations for this month.</p>
                </div>
              </div>
            ) : (
              insightItems.map((insight, index) => {
                const insightClass = getInsightClass(insight);
                return (
                  <div className={`insight-card ${insightClass}`} key={index}>
                    <span className="insight-card-icon">
                      {insightClass === "risk" ? "!" : insightClass === "positive" ? "✓" : "i"}
                    </span>
                    <p>{insight}</p>
                  </div>
                );
              })
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Insights;
