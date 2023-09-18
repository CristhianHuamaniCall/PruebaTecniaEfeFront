import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Menu from '../pages/Menu';
import Login from '../pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />}/>
        <Route exact path="/menu" element={<Menu />}/>
      </Routes>
    </Router>
  );
}

export default App;
