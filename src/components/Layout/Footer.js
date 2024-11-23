import React from 'react';
import '../../styles/Layout.css';

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Politechnika Warszawska. Wszelkie prawa zastrzeżone.</p>
        </footer>
    );
}

export default Footer;
