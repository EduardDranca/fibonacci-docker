import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
    <Router>
      <Link to='/'>Home</Link>
      <Link to='/other'>Other</Link>
      <Routes>
        <Route path='/' element={<Fib />} />
        <Route path='/other' element={<OtherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
