import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MemoryPage } from '../features/memory/MemoryPage';
import { OperationsPage } from '../features/operations/OperationsPage';
import { SpacePage } from '../features/space/SpacePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<DashboardPage />} />
      <Route path="/operations" element={<OperationsPage />} />
      <Route path="/memory" element={<MemoryPage />} />
      <Route path="/space" element={<SpacePage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
