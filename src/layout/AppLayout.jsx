import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }) {
  return (
    <>
      <main className="app-main">{children}</main>
      <Sidebar />
      <Footer />
    </>
  );
}
