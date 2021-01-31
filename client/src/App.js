import './App.css';
import Tasks from './pages/Tasks';
import Timesheet from './components/Timesheet/Timesheet';
import { Route, Switch } from 'react-router-dom';

import Navbar from "./components/Navbar/Navbar";
import Landing from "./pages/Landing/Landing";
import Register from "./components/Register/register";
import Login from "./components/Login/login";
import Admin from './components/Admin/Admin';

import Auth from './Auth';

function App() {

    return (
        <div className="App">
            <Switch>
                <div className="container-fluid pl-0 pr-0 m-0">
                        <Navbar />
                        <Route exact path="/" component={Landing} />
                        <div className='container-fluid m-0 p-0'>
                            <Route exact path="/tasks" component={Auth(Tasks)}/>
                            <Route exact path="/timesheet/:id" component={Auth(Timesheet)}/>
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/register-team" component={Admin}/>
                        </div>
                    </div>
            </Switch>
        </div>
    )
}

export default App;