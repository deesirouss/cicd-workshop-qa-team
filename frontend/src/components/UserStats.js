import React from "react";

const UserStats = ({ users }) => {
  const totalUsers = users.length;
  const recentUsers = users.filter((user) => {
    const userDate = new Date(user.createdAt || Date.now());
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return userDate > oneDayAgo;
  }).length;

  const getUsersByDomain = () => {
    const domains = {};
    users.forEach((user) => {
      if (user.email) {
        const domain = user.email.split("@")[1];
        domains[domain] = (domains[domain] || 0) + 1;
      }
    });
    return domains;
  };

  const domainStats = getUsersByDomain();

  return (
    <div className="user-stats" data-testid="user-stats">
      <h2>📊 User Statistics</h2>

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <div
          className="stat-card"
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #dee2e6",
          }}
        >
          <div style={{ fontSize: "2em", color: "#007bff" }}>👥</div>
          <h3 data-testid="total-users">{totalUsers}</h3>
          <p>Total Users</p>
        </div>

        <div
          className="stat-card"
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #dee2e6",
          }}
        >
          <div style={{ fontSize: "2em", color: "#28a745" }}>🆕</div>
          <h3 data-testid="recent-users">{recentUsers}</h3>
          <p>New Users (24h)</p>
        </div>

        <div
          className="stat-card"
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #dee2e6",
          }}
        >
          <div style={{ fontSize: "2em", color: "#ffc107" }}>📈</div>
          <h3 data-testid="growth-rate">
            {totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0}%
          </h3>
          <p>Growth Rate</p>
        </div>
      </div>

      {Object.keys(domainStats).length > 0 && (
        <div className="domain-stats" style={{ marginTop: "20px" }}>
          <h3>🌐 Users by Domain</h3>
          <div data-testid="domain-stats">
            {Object.entries(domainStats).map(([domain, count]) => (
              <div
                key={domain}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>{domain}</span>
                <span style={{ fontWeight: "bold", color: "#007bff" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-actions" style={{ marginTop: "20px" }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          data-testid="refresh-stats"
        >
          🔄 Refresh Stats
        </button>
      </div>
    </div>
  );
};

export default UserStats;
