function DashboardSettings() {
    return (
      <div className="dashboard-settings-page">
        <div className="settings-header">
          <h2>Settings</h2>
          <p>Manage your application preferences</p>
        </div>
        
        <div className="settings-content">
          <div className="settings-card">
            <h3>Appearance</h3>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Theme</h4>
                <p>Choose your preferred theme</p>
              </div>
              <div className="theme-selector">
                <button className="theme-button active">Light</button>
                <button className="theme-button">Dark</button>
                <button className="theme-button">System</button>
              </div>
            </div>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Sidebar</h4>
                <p>Default sidebar state</p>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="sidebar-toggle" defaultChecked />
                <label htmlFor="sidebar-toggle"></label>
              </div>
            </div>
          </div>
          
          <div className="settings-card">
            <h3>Notifications</h3>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Email Notifications</h4>
                <p>Receive email updates</p>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="email-toggle" defaultChecked />
                <label htmlFor="email-toggle"></label>
              </div>
            </div>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Push Notifications</h4>
                <p>Receive browser notifications</p>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="push-toggle" defaultChecked />
                <label htmlFor="push-toggle"></label>
              </div>
            </div>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Task Reminders</h4>
                <p>Get reminded about upcoming tasks</p>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="reminder-toggle" />
                <label htmlFor="reminder-toggle"></label>
              </div>
            </div>
          </div>
          
          <div className="settings-card">
            <h3>Privacy</h3>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Activity Status</h4>
                <p>Show when you're active</p>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="activity-toggle" defaultChecked />
                <label htmlFor="activity-toggle"></label>
              </div>
            </div>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Data Collection</h4>
                <p>Allow anonymous usage data collection</p>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="data-toggle" />
                <label htmlFor="data-toggle"></label>
              </div>
            </div>
          </div>
          
          <div className="settings-actions">
            <button className="primary-button">Save Changes</button>
            <button className="secondary-button">Reset to Default</button>
          </div>
        </div>
      </div>
    )
  }
  
  export default DashboardSettings
  