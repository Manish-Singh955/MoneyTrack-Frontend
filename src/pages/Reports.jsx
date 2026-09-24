import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { API_BASE_URL } from "../config/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatMonth = (month) => {
  const [year, monthNumber] = month.split("-");
  return new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );
};

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.transactions || []);
      } catch (error) {
        setMessage("Unable to load report data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const monthlyReports = useMemo(() => {
    const reportMap = new Map();

    transactions.forEach((transaction) => {
      const month = new Date(transaction.occurred_at).toISOString().slice(0, 7);
      const report = reportMap.get(month) || {
        month,
        income: 0,
        expense: 0,
        transactions: 0,
      };

      const amount = Number(transaction.amount || 0);
      if (transaction.type === "income") report.income += amount;
      if (transaction.type === "expense") report.expense += amount;
      report.transactions += 1;
      reportMap.set(month, report);
    });

    return Array.from(reportMap.values())
      .map((report) => ({
        ...report,
        balance: report.income - report.expense,
      }))
      .sort((first, second) => second.month.localeCompare(first.month));
  }, [transactions]);

  const activeMonth = selectedMonth || monthlyReports[0]?.month || "";
  const activeReport = monthlyReports.find((report) => report.month === activeMonth);

  const downloadPdf = () => {
    const pdf = new jsPDF();
    const reportRows = monthlyReports.length
      ? monthlyReports
      : [{ month: "No data", income: 0, expense: 0, balance: 0, transactions: 0 }];

    pdf.setFontSize(20);
    pdf.setTextColor(15, 23, 42);
    pdf.text("FinTrack Monthly Report", 14, 20);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 28);

    let y = 42;
    pdf.setFillColor(224, 242, 254);
    pdf.rect(14, y - 7, 182, 10, "F");
    pdf.setTextColor(3, 105, 161);
    pdf.setFontSize(10);
    pdf.text("Month", 18, y);
    pdf.text("Income", 65, y);
    pdf.text("Expense", 102, y);
    pdf.text("Balance", 140, y);
    pdf.text("Transactions", 174, y);

    y += 10;
    pdf.setTextColor(51, 65, 85);
    reportRows.forEach((report) => {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(report.month === "No data" ? report.month : formatMonth(report.month), 18, y);
      pdf.text(formatCurrency(report.income), 65, y);
      pdf.text(formatCurrency(report.expense), 102, y);
      pdf.text(formatCurrency(report.balance), 140, y);
      pdf.text(String(report.transactions), 180, y);
      y += 9;
    });

    pdf.save("fintrack-monthly-report.pdf");
  };

  return (
    <div className="container mt-4 reports-page">
      <div className="reports-header">
        <div>
          <p className="eyebrow">Financial overview</p>
          <h2>Monthly Reports</h2>
          <p className="subheading">Review your money movement month by month.</p>
        </div>
        <button className="primary-btn report-download-button" onClick={downloadPdf}>
          Download PDF
        </button>
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      {loading ? (
        <div className="card p-4 text-center">Loading report data...</div>
      ) : monthlyReports.length === 0 ? (
        <div className="card p-4 text-center">
          No transaction data is available for a monthly report.
        </div>
      ) : (
        <>
          <div className="report-filter card p-3">
            <label htmlFor="report-month">Inspect month</label>
            <select
              id="report-month"
              value={activeMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="form-select"
            >
              {monthlyReports.map((report) => (
                <option value={report.month} key={report.month}>
                  {formatMonth(report.month)}
                </option>
              ))}
            </select>
          </div>

          {activeReport && (
            <div className="report-highlight-grid">
              <div className="report-highlight income">
                <span>Income</span>
                <strong>{formatCurrency(activeReport.income)}</strong>
              </div>
              <div className="report-highlight expense">
                <span>Expenses</span>
                <strong>{formatCurrency(activeReport.expense)}</strong>
              </div>
              <div className="report-highlight balance">
                <span>Balance</span>
                <strong>{formatCurrency(activeReport.balance)}</strong>
              </div>
              <div className="report-highlight count">
                <span>Transactions</span>
                <strong>{activeReport.transactions}</strong>
              </div>
            </div>
          )}

          <div className="card report-table-card">
            <div className="report-table-heading">
              <div>
                <p className="eyebrow small">History</p>
                <h4>Monthly performance</h4>
              </div>
              <span>{monthlyReports.length} month{monthlyReports.length === 1 ? "" : "s"}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Balance</th>
                    <th>Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReports.map((report) => (
                    <tr key={report.month}>
                      <td>{formatMonth(report.month)}</td>
                      <td className="amount-income">{formatCurrency(report.income)}</td>
                      <td className="amount-expense">{formatCurrency(report.expense)}</td>
                      <td>{formatCurrency(report.balance)}</td>
                      <td>{report.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
