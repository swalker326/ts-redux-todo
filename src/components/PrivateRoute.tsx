import { RouteProps, Route, Redirect } from "react-router-dom";
import { useAppSelector } from "../state/hooks";

export const PrivateRoute: React.FunctionComponent<RouteProps> = ({
  component: Component,
  ...routeProps
}) => {
  const auth = useAppSelector((state) => state.auth.isAuthenticated);
  const ComponentToRender = Component as React.ElementType;
  return (
    <Route
      {...routeProps}
      render={(props) =>
        auth ? <ComponentToRender {...props} /> : <Redirect to="/" />
      }
    />
  );
};
