import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./keycloak.js";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById("root")).render(
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
            onLoad: "check-sso",
            silentCheckSsoRedirectUri:
                window.location.origin + "/silent-check-sso.html",
        }}

    >
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </React.StrictMode>
    </ReactKeycloakProvider>
);
