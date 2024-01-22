import React, { useState } from 'react';
import Navbar from './Navbar';
import Search from '../pages/Search';

const CommonAncestor = () => {
    const [searchData, setSearchData] = useState(null);

    const handleSearchSubmit = (data) => {
        setSearchData(data);
    };

    return (
        <>
        </>
    );
};

export default CommonAncestor;