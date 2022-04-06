import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie'
import './index.css';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";

const env = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/graphql' : 'https://api.coordinatea.me/graphql';
const link = createHttpLink({
  uri: env,
  credentials: 'include'
})

Sentry.init({
  dsn: "https://3cbf26173ebc4d7c8ef3a8c5e05c7de3@o1191121.ingest.sentry.io/6312433",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link
})

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <CookiesProvider>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </CookiesProvider>
    </React.StrictMode>
  </BrowserRouter>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
