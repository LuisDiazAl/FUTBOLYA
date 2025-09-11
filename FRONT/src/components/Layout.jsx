import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import '../assets/styles/layout.css';

const Layout = ({ children, showNavigation = true, showFooter = true }) => {
  return (
    <div className="layout-wrapper">
      {showNavigation && <Navigation />}
      <main className="layout-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;