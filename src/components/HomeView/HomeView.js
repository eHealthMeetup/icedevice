import React from 'react';
import {Link} from 'react-router';

const HomeView = (props)  => (
    <div>
        <Link to='/'>
            <div className="logo img-responsive"></div>
        </Link>
        <div className="app-container">
            <h2 className="intro">Connecting <span className="text-white"><strong>Digital Health Devices</strong></span><br />
                has never been so easy, but how do<br />
                we <span className="text-white"><strong>retain and analyze efficiently</strong></span><br />
                a data series over time?
            </h2>
            <h4>Select your role:</h4>
            <div className="row">
                <div className="col-xs-12 col-sm-5 center-block">
                    <Link className="btn btn-default btn-round" to='/sensor'>I'M A SENSOR</Link>
                    <Link className="btn btn-default btn-round" to='/engineer'>I'M AN APP ENGINEER</Link>
                    <Link className="btn btn-default btn-round" to='/md'>I'M A HEALTHCARE PROFESSIONAL</Link>
                </div>
            </div>
        </div>
    </div>
);

export default HomeView;