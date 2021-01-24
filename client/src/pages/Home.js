import React from 'react';
import ReactDND from '../components/ReactDND/ReactDND';
import { useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();
    
    const handleClick = () => {
        history.push('/timesheet')
    };

    return (
        <div className="home">
            <ReactDND></ReactDND>
            <button onClick={handleClick}>Timesheet</button>
        </div>
    )
}

export default Home;