import React, { useEffect } from 'react';
import { useMineStore } from './stores/mineStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

// Pages
import { AdminLogin } from './pages/AdminLogin';
import { DigitalTwin } from './pages/DigitalTwin';
import { WorkerTracking } from './pages/WorkerTracking';
import { AIAnalytics } from './pages/AIAnalytics';
import { HeatMap } from './pages/HeatMap';
import { IncidentReplay } from './pages/IncidentReplay';
import { RescueRobotControl } from './pages/RescueRobotControl';
import { PredictiveMaintenance } from './pages/PredictiveMaintenance';
import { FederatedLearning } from './pages/FederatedLearning';
import { Reports } from './pages/Reports';
import { UserManagement } from './pages/UserManagement';
import { AISafetyAssistant } from './pages/AISafetyAssistant';
import { WorkerMobileApp } from './pages/WorkerMobileApp';

const App: React.FC = () => {
  const { currentPage, initialize, startSimulation } = useMineStore();

  useEffect(() => {
    // Automatically boot system on initial startup
    initialize();
    startSimulation();
  }, [initialize, startSimulation]);

  // Handle splash Login screen
  if (currentPage === 'Login') {
    return <AdminLogin />;
  }

  // Render main dashboard layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mine-bg text-[#E8F4FD]">
      
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Console View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top telemetry control bar */}
        <TopBar />

        {/* Dynamic page routes switch */}
        <main className="flex-1 flex flex-col min-h-0 bg-[#050B18] overflow-hidden">
          {currentPage === 'Twin' && <DigitalTwin />}
          {currentPage === 'Workers' && <WorkerTracking />}
          {currentPage === 'Analytics' && <AIAnalytics />}
          {currentPage === 'Heatmap' && <HeatMap />}
          {currentPage === 'Replay' && <IncidentReplay />}
          {currentPage === 'Robots' && <RescueRobotControl />}
          {currentPage === 'Maintenance' && <PredictiveMaintenance />}
          {currentPage === 'Federated' && <FederatedLearning />}
          {currentPage === 'Reports' && <Reports />}
          {currentPage === 'Admin' && <UserManagement />}
          {currentPage === 'Assistant' && <AISafetyAssistant />}
          {currentPage === 'MobileApp' && <WorkerMobileApp />}
        </main>

      </div>

    </div>
  );
};

export default App;
