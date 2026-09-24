function About() {
  return (
    <div className="container mt-4 about-page">
      <section className="about-hero">
        <div>
          <p className="eyebrow">About the application</p>
          <h1>FinTrack helps you make sense of every rupee.</h1>
          <p className="about-lead">
            A focused personal finance workspace for tracking transactions,
            planning budgets, understanding spending, and making better money
            decisions month after month.
          </p>
          <a
            href="https://scanrly.com/"
            target="_blank"
            rel="noreferrer"
            className="primary-btn about-contact-button"
          >
            Contact Scanrly
          </a>
        </div>
        <div className="about-mark">
          <img src="/fintrack-logo.png" alt="FinTrack logo" className="about-logo" />
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <p className="eyebrow small">What you can do</p>
          <h2>Everything important in one place.</h2>
        </div>
        <div className="about-feature-grid">
          <article className="about-feature-card">
            <span className="about-feature-icon">↗</span>
            <h3>Track transactions</h3>
            <p>Record income and expenses with categories, dates, notes, and merchants.</p>
          </article>
          <article className="about-feature-card">
            <span className="about-feature-icon">◷</span>
            <h3>Plan budgets</h3>
            <p>Set monthly limits and see what is spent, remaining, or over budget.</p>
          </article>
          <article className="about-feature-card">
            <span className="about-feature-icon">▥</span>
            <h3>Understand trends</h3>
            <p>Use analytics, reports, and insights to spot patterns in your finances.</p>
          </article>
        </div>
      </section>

      <section className="about-company-section">
        <div>
          <p className="eyebrow small">Built with Scanrly</p>
          <h2>Designed for calmer financial decisions.</h2>
          <p>
            FinTrack is made by Manish Kumar Singh with Scanrly. The goal is
            simple: give people a clear, approachable way to stay close to
            their financial life.
          </p>
        </div>
        <a
          href="https://scanrly.com/"
          target="_blank"
          rel="noreferrer"
          className="secondary-btn"
        >
          Visit scanrly.com
        </a>
      </section>
    </div>
  );
}

export default About;
