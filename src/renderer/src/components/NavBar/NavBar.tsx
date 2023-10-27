import styles from './navbar.module.css';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav}>
      <ul>
        <li className={pathname == '/' ? styles.active : ''}>
          <Link to={`/`}>Yhteenveto</Link>
        </li>
        <li className={pathname == '/log' ? styles.active : ''}>
          <Link to={`/log`}>Loki</Link>
        </li>
      </ul>

      <ul>
        <li className={pathname == '/help' ? styles.active : ''}>
          <Link to={`/help`}>Help</Link>
        </li>
        <li className={pathname == '/settings' ? styles.active : ''}>
          <Link to={`/settings`}>Asetukset</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
