import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { ApplicantsPage } from './pages/ApplicantsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all');

  // Modals
  const [showCreateJobModal, setShowCreateJobModal] = useState<boolean>(false);
  const [showAddApplicantModal, setShowAddApplicantModal] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleViewJobApplicants = (jobId: string) => {
    setSelectedJobFilter(jobId);
    setActiveTab('applicants');
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'inline-block', width: 44, height: 44, border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <LoginPage onSwitchToRegister={() => setAuthView('register')} showToast={showToast} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthView('login')} showToast={showToast} />
        )}
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Background Glowing Ambient Orbs */}
      <div className="app-bg-glow">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ marginTop: '1.5rem' }}>
        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={setActiveTab}
            openCreateJobModal={() => {
              setActiveTab('jobs');
              setShowCreateJobModal(true);
            }}
            openAddApplicantModal={() => {
              setActiveTab('applicants');
              setShowAddApplicantModal(true);
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsPage
            onViewApplicants={handleViewJobApplicants}
            showCreateModal={showCreateJobModal}
            setShowCreateModal={setShowCreateJobModal}
            showToast={showToast}
          />
        )}

        {activeTab === 'applicants' && (
          <ApplicantsPage
            selectedJobIdFilter={selectedJobFilter}
            showAddModal={showAddApplicantModal}
            setShowAddModal={setShowAddApplicantModal}
            showToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage showToast={showToast} />
        )}
      </main>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
