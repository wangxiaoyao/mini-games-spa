import { AppLayout } from '../layout/AppLayout';
import { ScoreProvider } from '../features/score/ScoreProvider';
import { AppRoutes } from './router';

export default function App() {
  return (
    <ScoreProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </ScoreProvider>
  );
}
