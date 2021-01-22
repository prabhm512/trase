import './App.css';
import ReactDND from './components/ReactDND/ReactDND';
import Timesheet from './components/Timesheet/Timesheet';
import { Route, Switch } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <ReactDND></ReactDND>
                </Route>
                <Route exact path="/timesheet">
                    <Timesheet></Timesheet>
                </Route>
            </Switch>
        </div>
    )
}

export default App;