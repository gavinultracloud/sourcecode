import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Monitor from './components/Monitor';
import AboutUs from './components/AboutUs';
import ProductsServices from './components/ProductsServices';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import MyAccount from './components/MyAccount';
import LoggedOut from './components/LoggedOut';




function App() {
    return (
        <Router>
            <Header />
            <Routes>
            <Route path="/" element={<Welcome />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/monitor" element={<Monitor />} />
                <Route path="/products-services" element={<ProductsServices />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logged-out" element={<LoggedOut />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
        </Router>
    );
}


export default App;
