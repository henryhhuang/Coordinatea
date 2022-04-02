import './App.css';
import { CreateMarker } from './components/CreateMarker/CreateMarker';
import NavBar from './components/NavBar/NavBar';
import { ViewJourney } from './components/ViewJourney/ViewJourney';
import { CreateJourney } from './components/CreateJourney/CreateJourney';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Journeys } from './components/Journeys/Journeys';
import { Route, Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn/SignIn';
import { SignUp } from './components/SignUp/SignUp';
import { Comment } from './components/Comments/Comment/Comment';
import { CommentForm } from './components/Comments/CommentForm/CommentForm';
import { Follow } from './components/Follow/Follow';
import { gql, useLazyQuery } from "@apollo/client";
import { CommentList } from './components/Comments/CommentList/CommentList';
import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material/';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { Profile } from './components/Profile/Profile';

const env = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/graphql' : 'https://api.coordinatea.me/graphql';
const link = createHttpLink({
  // uri: 'http://147.182.149.236:5000/graphql',
  // uri: 'https://api.coordinatea.me/graphql',
  uri: env,
  credentials: 'include'
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link
})

const theme = createTheme({
  palette: {
    primary: {
      light: '#e6ffff',
      main: '#1b264f',
      dark: '#4f1b4d',
      contrastText: '#fff',
      text: '#ffffff'
    },
    background: {
      default: '#f4f4f9'
    },
    secondary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
  },
});

const getUserQuery = gql`
  query {
    getUser {
      username
    }
  }
`

function App() {

  const [username, setUsername] = useState(null);

  const [getUser, { loading, error, data }] = useLazyQuery(getUserQuery, {
    onCompleted: (data) => {
      if (data.getUser)
        setUsername(data.getUser.username);
    }
  })

  useEffect(() => {
    getUser()
  }, [])

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className='App'>
          <NavBar username={username} setUsername={setUsername}></NavBar>
          <Routes>
            <Route path="/" element={<Journeys username={username} />}></Route>
            <Route path="/journey/:journeyId" element={<ViewJourney username={username}/>}></Route>
            <Route path="/journey/:journeyId/:markerId" element={<ViewJourney username={username}/>}></Route>
            <Route path="/journey/create/" element={<CreateJourney />}></Route>
            <Route path="/journey/create/:journeyId" element={<CreateMarker username={username}/>}></Route>
            <Route path="/signin/" element={<SignIn setUsername={setUsername} />}></Route>
            <Route path="/signup/" element={<SignUp setUsername={setUsername} />}></Route>
            <Route path="/follow/" element={<Follow />}></Route>
            <Route path="/profile/:username" element={<Profile />}></Route>
          </Routes>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );

}

export default App;
