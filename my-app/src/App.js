import './App.css';
import { CreateJourney } from './components/CreateJourney/CreateJourney';
import NavBar from './components/NavBar/NavBar';
import { ViewJourney } from './components/ViewJourney/ViewJourney';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Journeys } from './components/Journeys/Journeys';
import { Outlet, Link, useRoutes, useLocation, Route, Routes } from 'react-router-dom';
import { SignIn } from './components/SignIn/SignIn';
import { SignUp } from './components/SignUp/SignUp';
import { Comment } from './components/Comments/Comment/Comment';
import { CommentForm } from './components/Comments/CommentForm/CommentForm';
import { Follow } from './components/Follow/Follow';
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat, ApolloProvider } from "@apollo/client";
import { useAuthToken } from "./util/authentication";
import { CommentList } from './components/Comments/CommentList/CommentList';

const theme = createTheme({
  palette: {
    primary: {
      light: '#e6ffff',
      main: '#b3e5fc',
      dark: '#82b3c9',
      contrastText: '#000',
    },
    secondary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
  },
});

function App() {
  // let element = useRoutes([
  //   {
  //     path: "/",
  //     element: <Journeys />,
  //   },
  //   { path: "/journey/:id", element: <ViewJourney /> },
  //   { path: "/signup/", element: <SignIn /> },
  //   { path: "/sigin/", element: <SignUp /> },
  //   { path: "/follow/", element: <Follow /> },

  //   { path: "/journey/:id/:id2", element: <ViewJourney /> },
  //   { path: "/journey/create", element: <CreateJourney /> },
  // ]);
  // return element;

  
  const token = useAuthToken();

  const apolloClient = new ApolloClient({
    uri: 'http://localhost:5000/',
    cache: new InMemoryCache(),
    headers: {
      authorization: token[0]
    }
  })

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <div className='App'>
          <NavBar></NavBar>

          <Routes>
            <Route path="/" element={<Journeys/>}></Route>
            <Route path="/journey/:id" element={<ViewJourney/>}></Route>
            <Route path="/journey/:id/:id2" element={<ViewJourney/>}></Route>
            <Route path="/journey/create" element={<CreateJourney/>}></Route>
            <Route path="/signin/" element={<SignIn/>}></Route>
            <Route path="/signup/" element={<SignUp/>}></Route>
            <Route path="/follow/" element={<Follow/>}></Route>
            <Route path="/comment/" element={
              <div>
              <Comment username={"DapperQuokka"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"} />
              <Comment username={"DapperQuokka"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"} />
              <CommentForm />
              <CommentList username={'A'} />
              </div>}
            ></Route>
          </Routes>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );

}

export default App;
