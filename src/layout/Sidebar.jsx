import { NavLink } from 'react-router-dom';

const links = [
  { to: '/home', label: 'Home', shortLabel: 'H' },
  { to: '/operations', label: 'Operations', shortLabel: 'Op' },
  { to: '/memory', label: 'Memory', shortLabel: 'Me' },
  { to: '/space', label: 'Space', shortLabel: 'S' },
];

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <img className="sidebar-logo" src="/logo.svg" alt="Logo" />
      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="sidebar-link">
            <span className="nav-label-full">{link.label}</span>
            <span className="nav-label-short">{link.shortLabel}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
