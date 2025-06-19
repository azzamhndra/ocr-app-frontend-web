import axios from "axios";
import { io } from "socket.io-client";
import DashboardHome from "./dashboard/DashboardHome";
import DashboardProfile from "./dashboard/DashboardProfile";
import DashboardSettings from "./dashboard/DashboardSettings";
import DashboardUsers from "./dashboard/DashboardUsers";
import DashboardMonitor from "./dashboard/DashboardMonitor";
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

function Dashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifSinyal = useRealtimeNotif();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // Check if a route is active

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="/logo.jpg"
              alt="Dashboard Logo"
              className="sidebar-logo-icon"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            {sidebarOpen && (
              <span className="sidebar-logo-text">Dashboard</span>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {sidebarOpen ? (
                <path d="M15 18l-6-6 6-6" />
              ) : (
                <path d="M9 18l6-6-6-6" />
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`sidebar-link ${
              isActive("/dashboard") &&
              !isActive("/dashboard/profile") &&
              !isActive("/dashboard/settings") &&
              !isActive("/dashboard/users") &&
              !isActive("/dashboard/monitor")
                ? "active"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/dashboard/users"
            className={`sidebar-link ${
              isActive("/dashboard/users") ? "active" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {sidebarOpen && <span>Users</span>}
          </Link>
          <Link
            to="/dashboard/monitor"
            className={`sidebar-link ${
              isActive("/dashboard/monitor") ? "active" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>

            {sidebarOpen && <span>Monitoring Data</span>}
          </Link>
          <Link
            to="/dashboard/profile"
            className={`sidebar-link ${
              isActive("/dashboard/profile") ? "active" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            {sidebarOpen && <span>Settings</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-welcome">
            <h1>Welcome, {user?.full_name || user?.username}</h1>
            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="header-profile">
            <div
              className="notification-icon"
              onClick={() => {
                console.log("Notifikasi diklik!");
                setShowNotif(!showNotif);
              }}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {notifSinyal.length > 0 && (
                <span className="notification-badge">{notifSinyal.length}</span>
              )}

              {showNotif && (
                <div className="notification-dropdown">
                  {notifSinyal.length > 0 ? (
                    <ul className="notif-list">
                      {notifSinyal.map((item, idx) => (
                        <li key={idx} className="notif-item">
                          <div className="notif-title">{item.lokasi}</div>
                          <div className="notif-details">
                            <div>{item.parameter.join(", ")}</div>
                            <div className="notif-tag">⚠ {item.note}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Tidak ada notifikasi.</p>
                  )}
                </div>
              )}
            </div>

            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-avatar">
                  {user?.full_name?.charAt(0) ||
                    user?.username?.charAt(0) ||
                    "U"}
                </div>
                <div className="profile-name">
                  <span>{user?.full_name || user?.username}</span>
                  <span className="profile-role">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<DashboardHome user={user} />} />
            <Route path="/profile" element={<DashboardProfile user={user} />} />
            <Route path="/settings" element={<DashboardSettings />} />
            <Route path="/users" element={<DashboardUsers />} />
            <Route path="/monitor" element={<DashboardMonitor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
function useRealtimeNotif() {
  const [notif, setNotif] = useState([]);

  useEffect(() => {
    const socket = io("https://api.ocrapp.biz.id");

    const processItem = (data) => {
      const isProblem =
        data.power < 45 ||
        data.cn < 20.5 ||
        data.mer < 26 ||
        data.linkMargin < 3;
      if (isProblem) {
        setNotif((prev) => [
          ...prev,
          {
            lokasi: `${data.daerah}, ${data.kecamatan}`,
            parameter: [
              ...(data.power < 45 ? [`Power (${data.power})`] : []),
              ...(data.cn < 20.5 ? [`C/N (${data.cn})`] : []),
              ...(data.mer < 26 ? [`MER (${data.mer})`] : []),
              ...(data.linkMargin < 3
                ? [`Link Margin (${data.linkMargin})`]
                : []),
            ],
            note: "Sinyal berada di bawah standar",
          },
        ]);
      }
    };

    axios
      .get("https://api.ocrapp.biz.id/data")
      .then((res) => {
        res.data.forEach(processItem);
      })
      .catch((err) => console.error("Gagal load data awal:", err));

    socket.on("new_data", processItem);

    return () => socket.off("new_data");
  }, []);

  return notif;
}
export default Dashboard;
