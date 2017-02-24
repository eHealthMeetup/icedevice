import React from 'react';
import Header from '../Header/Header';

const Container = (props) => (
    <div>
        <Header />
        {props.children}
    </div>
);


export default Container;