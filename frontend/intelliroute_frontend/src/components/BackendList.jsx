import '../styles/BackendList.css';

function BackendList({ backends, onToggle }) {
  return (
    <div className="backend-list">
      {backends.length === 0 ? (
        <div className="empty-state">
          <p>No backends configured yet.</p>
          <p className="hint">Add a backend service to get started.</p>
        </div>
      ) : (
        <div className="backends-grid">
          {backends.map(backend => (
            <div key={backend._id} className="backend-card">
              <div className="card-header">
                <h3>{backend.name}</h3>
                <span className={`status-badge ${backend.isActive ? 'active' : 'inactive'}`}>
                  {backend.isActive ? '● Active' : '● Inactive'}
                </span>
              </div>
              <div className="card-body">
                <div className="url-section">
                  <label>URL</label>
                  <code>{backend.url}</code>
                </div>
                <div className="id-section">
                  <label>ID</label>
                  <code className="id-code">{backend._id}</code>
                </div>
              </div>
              <div className="card-footer">
                <button 
                  onClick={() => onToggle(backend._id, backend.isActive)}
                  className={`toggle-btn ${backend.isActive ? 'active' : ''}`}
                >
                  {backend.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BackendList;
