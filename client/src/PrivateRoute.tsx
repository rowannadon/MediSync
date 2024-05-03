import React from "react";
import { useAuth } from "./AuthProvider";
import { Route, Redirect } from "wouter";

export const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
    const auth = useAuth();
    const token = auth?.getAccessToken();

    const errComponent = () => {
        return <Redirect to="/login" />;
    }

    return (
        <Route
            {...rest}
            component={token ? Component : errComponent}
        />
    );
};