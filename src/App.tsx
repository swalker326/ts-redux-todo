import { Todo } from "./components/Todo";
import { Signin } from "./account/Signin";
import { Signup } from "./account/Signup";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { PrivateRoute } from "./components/PrivateRoute";

Amplify.configure(awsExports);

function App() {
  return (
    <Router>
      <Route path="/" exact component={Signin} />
      <Route path="/signup" component={Signup} />
      <PrivateRoute path="/todos" component={Todo} />
    </Router>
  );
}

export default App;
