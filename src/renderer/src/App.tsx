import NavBar from './components/NavBar/NavBar';
import Summary from './views/Summary/Summary';
import Log from './views/Log/Log';
import Help from './views/Help/Help';
import Settings from './views/Settings/Settings';

import { HashRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/log" element={<Log />} />
          <Route path="/help" element={<Help />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
