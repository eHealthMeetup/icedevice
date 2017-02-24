import React from 'react';
import {Link} from 'react-router';

const HomeView = (props)  => (
    <div className="app-container">
        <div className="logo img-responsive"></div>
        <h2>Welcome to the eHealth mobile technologies meetup</h2>
        <h2>Select your role</h2>
        <div>
            <Link to='/sensor'>Im a sensor</Link>;
            <Link to='/engineer'>Im a eHealth app engineer</Link>
            <Link to='/md'>Im a healthcare proffessional</Link>
        </div>
    </div>
);

export default HomeView;