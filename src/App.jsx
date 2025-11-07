import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Sparkles, Trophy, Zap } from 'lucide-react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const result = await window.storage.get('todo-tasks');
        if (result && result.value) {
          setTasks(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('No saved tasks found');
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      if (tasks.length > 0 || tasks.length === 0) {
        try {
          await window.storage.set('todo-tasks', JSON.stringify(tasks));
        } catch (error) {
          console.error('Error saving tasks:', error);
        }
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() === '') {
      return;
    }
    if (inputValue.length > 100) {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="app-wrapper">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <Sparkles className="sparkle" />
              </div>
              <div>
                <h1 className="title">TaskFlow</h1>
                <p className="tagline">Your productivity companion</p>
              </div>
            </div>
          </div>
        </header>

        <div className="main-grid">
          {/* Sidebar Stats */}
          <aside className="sidebar">
            <div className="stats-card card">
              <div className="card-header">
                <h2 className="card-title">Overview</h2>
                <Trophy size={20} className="icon-accent" />
              </div>
              
              <div className="stats-grid">
                <div className="stat-box stat-total">
                  <div className="stat-value">{totalTasks}</div>
                  <div className="stat-label">Total</div>
                </div>
                
                <div className="stat-box stat-active">
                  <div className="stat-value">{activeTasks}</div>
                  <div className="stat-label">Active</div>
                </div>
                
                <div className="stat-box stat-done">
                  <div className="stat-value">{completedTasks}</div>
                  <div className="stat-label">Done</div>
                </div>
              </div>

              <div className="progress-wrapper">
                <div className="progress-header">
                  <span className="progress-text">Progress</span>
                  <span className="progress-percent">{completionPercentage}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${completionPercentage}%` }}>
                    <div className="progress-shine"></div>
                  </div>
                </div>
              </div>

              {completedTasks > 0 && (
                <button onClick={clearCompleted} className="btn-clear">
                  <X size={16} />
                  Clear Completed
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="content">
            {/* Input Card */}
            <div className={`card input-card ${isInputFocused ? 'focused' : ''}`}>
              <div className="input-group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="What's on your mind?"
                  maxLength={100}
                  className="input-field"
                  style={{ color: "black" }}
                />
                <button onClick={addTask} className="btn-add">
                  <Plus size={20} />
                  <span>Add</span>
                </button>
              </div>
              <div className="input-footer">
                <span className={`char-count ${inputValue.length > 80 ? 'warning' : ''}`}>
                  {inputValue.length}/100
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-card card">
              <div className="filter-tabs">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                  >
                    <span className="filter-label">
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </span>
                    <span className="filter-badge">
                      {f === 'all' ? totalTasks : f === 'active' ? activeTasks : completedTasks}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="tasks-section">
              {filteredTasks.length === 0 ? (
                <div className="empty-state card">
                  <div className="empty-icon">
                    {filter === 'completed' ? '🎉' : filter === 'active' ? '⚡' : '✨'}
                  </div>
                  <h3 className="empty-title">
                    {filter === 'completed'
                      ? 'No completed tasks'
                      : filter === 'active'
                      ? 'All caught up!'
                      : 'Start your journey'}
                  </h3>
                  <p className="empty-text">
                    {filter === 'completed'
                      ? 'Complete some tasks to see them here'
                      : filter === 'active'
                      ? 'Time to take a break or add new tasks'
                      : 'Add your first task to get started'}
                  </p>
                </div>
              ) : (
                <div className="tasks-grid">
                  {filteredTasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="task-item card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="task-main">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        >
                          {task.completed && <Check size={14} strokeWidth={3} />}
                        </button>
                        
                        <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      
                      <button onClick={() => deleteTask(task.id)} className="btn-delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <Zap size={14} className="footer-icon" />
            <span>Press Enter to add tasks quickly</span>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-wrapper {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background */
        .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          z-index: -2;
        }

        .bg-shapes {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: -1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: #fbbf24;
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 500px;
          height: 500px;
          background: #ec4899;
          top: 50%;
          right: -250px;
          animation-delay: -7s;
        }

        .shape-3 {
          width: 350px;
          height: 350px;
          background: #3b82f6;
          bottom: -150px;
          left: 30%;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        /* Container */
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        /* Card Base */
        .card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Header */
        .header {
          margin-bottom: 30px;
          animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px 32px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .sparkle {
          color: white;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .tagline {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        /* Main Grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Sidebar */
        .sidebar {
          order: 2;
        }

        .stats-card {
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .icon-accent {
          color: #fbbf24;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-box {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 12px;
          padding: 16px 12px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .stat-total {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        }

        .stat-active {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
        }

        .stat-done {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .progress-wrapper {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-text {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .progress-percent {
          font-size: 13px;
          font-weight: 700;
          color: #10b981;
        }

        .progress-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 99px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          to { left: 100%; }
        }

        .btn-clear {
          width: 100%;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #ef4444;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-clear:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        /* Content */
        .content {
          order: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-card {
          padding: 20px;
          transition: all 0.3s ease;
        }

        .input-card.focused {
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
          border-color: #667eea;
        }

        .input-group {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }

        .input-field {
          flex: 1;
          padding: 14px 18px;
          border: 2px solid #060606ff;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s ease;
          background: white;
        }

        .input-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .btn-add {
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-add:active {
          transform: translateY(0);
        }

        .input-footer {
          display: flex;
          justify-content: flex-end;
        }

        .char-count {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .char-count.warning {
          color: #f59e0b;
        }

        /* Filter Card */
        .filter-card {
          padding: 8px;
        }

        .filter-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .filter-tab {
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
          font-weight: 500;
        }

        .filter-tab:hover {
          background: #f1f5f9;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .filter-label {
          font-size: 14px;
        }

        .filter-badge {
          font-size: 11px;
          font-weight: 700;
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 8px;
          border-radius: 10px;
        }

        /* Tasks Section */
        .tasks-section {
          min-height: 400px;
        }

        .tasks-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .task-item {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          animation: slideIn 0.4s ease-out both;
          cursor: pointer;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .task-item:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .task-main {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .task-checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .task-checkbox:hover {
          border-color: #10b981;
          transform: scale(1.1);
        }

        .task-checkbox.checked {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #10b981;
          animation: checkBounce 0.4s ease;
        }

        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .task-checkbox.checked svg {
          color: white;
        }

        .task-text {
          font-size: 15px;
          color: #000000 !important;
          font-weight: 500;
          word-break: break-word;
          transition: all 0.3s ease;
        }

        .task-text.completed {
          text-decoration: line-through;
          color: #94a3b8;
        }

        .btn-delete {
          padding: 8px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          transform: scale(1.1);
        }

        /* Empty State */
        .empty-state {
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: #64748b;
        }

        /* Footer */
        .footer {
          margin-top: 24px;
          animation: fadeIn 0.6s ease-out 0.4s both;
        }

        .footer-content {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .footer-icon {
          color: #fbbf24;
        }

        /* Responsive */
        @media (min-width: 640px) {
          .tasks-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filter-tabs {
            grid-template-columns: repeat(3, 1fr);
          }

          .filter-tab {
            flex-direction: row;
            justify-content: center;
          }
        }

        @media (min-width: 1024px) {
          .container {
            padding: 32px;
          }

          .main-grid {
            grid-template-columns: 320px 1fr;
            gap: 32px;
          }

          .sidebar {
            order: 1;
          }

          .content {
            order: 2;
          }

          .stats-card {
            position: sticky;
            top: 32px;
          }

          .tasks-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .title {
            font-size: 36px;
          }
        }

        @media (min-width: 1280px) {
          .tasks-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}