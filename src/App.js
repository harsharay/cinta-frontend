import './App.css';
import AddForm from './Components/AddForm/AddForm';
import { BrowserRouter, Route, Switch } from "react-router-dom"
import ShowUserData from './Components/ShowUserData/ShowUserData';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" component={AddForm} exact/>
          <Route path="/showAllUserData" component={ShowUserData} exact/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
