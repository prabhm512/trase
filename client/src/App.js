import './App.css';
import Home from './pages/Home';
import TimesheetPage from './pages/TimesheetPage';
import { Route, Switch } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path={["/", "/api/tasks"]}>
                    <Home></Home>
                </Route>
                <Route exact path="/timesheet">
                    <TimesheetPage></TimesheetPage>
                </Route>
            </Switch>
        </div>
    )
}

export default App;