import React from 'react';
import {Link} from 'react-router';

const Header = () => (
    <div>
        <Link to='/'>
            <div className="logo img-responsive"></div>
        </Link>
    </div>
);

export default Header;