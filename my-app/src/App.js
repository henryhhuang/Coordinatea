import './App.css';
import { CreateJourney } from './components/CreateJourney/CreateJourney';
// import NavBar from './components/NavBar/NavBar';
import { ViewJourney } from './components/ViewJourney/ViewJourney';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        {/* <NavBar></NavBar> */}
        <ViewJourney></ViewJourney>
      </div>
    </ThemeProvider>
  );

}

export default App;
