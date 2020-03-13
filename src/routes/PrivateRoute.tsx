
/* /src/routes/privateRoute.jsx */
import React, { useState} from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthService } from "../services/AuthService";

export const PrivateRoute = ({ component, ...rest } : any) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loaded, setLoaded] = useState(false);

    AuthService.Instance.isAuthenticated().then((isAuth) => {
        setIsAuthenticated(isAuth);
        setLoaded(true);
    });
    
    function renderFn(props: any) {
        if(loaded) {
            if (isAuthenticated) {
                return React.createElement(component, props);
            }
            return <Redirect to="/landing" />
        }
        return <p>Loading</p>
    }

    return <Route {...rest} render={renderFn} />;
};