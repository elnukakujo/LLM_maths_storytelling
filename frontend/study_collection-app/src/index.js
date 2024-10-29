import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import './assets/css/index.css';

import Home from './pages/Home.js';
import Consent from './pages/Consent.js';
import { ContextProvider } from './Context.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ContextProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/consent" element={<Consent />}/>
            </Routes>
        </Router>
    </ContextProvider>
);