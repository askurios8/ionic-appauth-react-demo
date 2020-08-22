
/* /src/routes/privateRoute.jsx */
import React from "react";
import { Route, Redirect } from "react-router-dom";

import { Auth } from "../services/AuthService";

export const PrivateRoute = ({ component, ...rest } : any) => {

    function renderFn(props: any) {
        if (Auth.Instance.session.isAuthenticated) {
            return React.createElement(component, props);
        }
        return <Redirect to="/landing" />
    }

    return <Route {...rest} render={renderFn} />;
};