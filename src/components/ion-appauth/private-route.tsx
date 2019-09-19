import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';

import { useAppAuth } from './ion-appauth';

type RouteComponent = React.StatelessComponent<RouteComponentProps<{}>> | React.ComponentClass<any>

export const PrivateRoute: React.StatelessComponent<RouteProps> = ({component, ...rest}) => {
    const { isAuthenticated } = useAppAuth(); 

    const renderFn = (Component?: RouteComponent) => {
        return (props: RouteProps) => {
            if (!Component) {
                return null;
            }
            if (isAuthenticated) {
                return <React.Component {...props} />;
            }
            const redirectProps = {
                to: {
                    pathname: "/landing"
                },
            };
            return <Redirect {...redirectProps} />;
        };
    }
  
    return <Route {...rest} render={renderFn(component)} />
  }
