import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import { StaticRouter } from "react-router-dom/server";
import Link from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

export function render(url: string, context?: any) {
    const helmetContext: any = {};
    const html = ReactDOMServer.renderToString(
        <React.StrictMode>
            <HelmetProvider context={helmetContext}>
                <StaticRouter location={url}>
                    <App />
                </StaticRouter>
            </HelmetProvider>
        </React.StrictMode>
    );

    return { html, helmet: helmetContext.helmet };
}
