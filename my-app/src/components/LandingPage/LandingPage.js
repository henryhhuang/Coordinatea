import astronaut from '../../static/astronaut.png'
import tea from '../../static/tea.png'
import earth from '../../static/earth.png'
import rocket from '../../static/rocket.png'
import astronaut2 from '../../static/astronaut2.png'
import astronaut3 from '../../static/astronaut3.png'
import astronaut4 from '../../static/astronaut4.png'
import earth2 from '../../static/earth2.png'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Button, Grow, Icon, IconButton, Typography } from '@mui/material'

import Fade from '@mui/material/Fade';

import "./LandingPage.css"

export function LandingPage() {

    const scrollToSection3 = (event) => {
        document.getElementById('section3').scrollIntoView();
    }

    return (
        <div id="landing-page">
            <div id="section1" style={{ backgroundColor: '#282e2f', height: '100vh' }}>
                <Grow in={true} timeout={2000}>
                    <img id='astronaut' src={astronaut} style={{ position: 'absolute', left: '10vw', top: '40vh', zIndex: 1, height: '50vh' }} />
                </Grow>
                <Grow in={true} timeout={2000}>
                    <img src={tea} style={{ position: 'absolute', left: '25vw', top: '25vh', transform: 'rotate(20deg)', zIndex: 2, height: '50vh' }} />
                </Grow>
                <Grow in={true} timeout={2000}>
                    <img src={earth} style={{ height: '20vh', position: 'absolute', left: '20vw', top: '35vh' }} />
                </Grow>
                <Grow in={true} timeout={2000}>
                    <img src={rocket} style={{ transform: 'rotate(-135deg)', zIndex: 0, height: '15vh', position: 'absolute', left: '5vw', top: '65vh' }} />
                </Grow>
                <Fade in={true} timeout={3000}>
                    <Typography align='left'
                        variant='h1' sx={{ fontWeight: 'bold', color: 'white', position: 'absolute', left: '50vw', top: '35vh' }}>
                        Explore the world
                    </Typography>
                </Fade>
                <Fade in={true} timeout={4000}>
                    <Typography align='left' variant='h3' sx={{ fontWeight: 'bold', color: 'white', position: 'absolute', left: '50vw', width: '40vw', top: '50vh' }}>
                        In the time it takes to make a cup of tea
                    </Typography>
                </Fade>
                <IconButton href="#section2" sx={{ color: 'white', position: 'relative', top: '90vh' }}>
                    <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                </IconButton>
            </div >
            <div id="section2" style={{ height: '100vh' }}>
                <Typography align='center' variant='h2' sx={{ pt: '15vh', pb: '10vh', fontWeight: 'bold', color: 'black' }}>
                    Share Your Journeys with Your Friends & Family!
                </Typography>
                <img src={astronaut2} style={{ zIndex: 2, height: '50vh', position: 'absolute', left: '20vw' }} />
                <img src={astronaut3} style={{ zIndex: 2, height: '50vh', position: 'absolute', right: '15vw' }} />
                <img src={earth2} style={{ height: '50vh', position: 'absolute', left: '37vw' }} />
                <img src={tea} style={{ position: 'absolute', left: '42vw', top: '145vh', transform: 'rotate(25deg)', height: '30vh' }} />
                <IconButton href="#section3" sx={{ position: 'relative', top: '60vh' }}>
                    <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                </IconButton>
            </div >
            <div id="section3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#282e2f', height: '100vh' }}>
                <IconButton href="#section1" sx={{ color: 'white', position: 'relative' }}>
                    <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                </IconButton>
                <Typography align='center' variant='h2' sx={{ pt: '5vh', pb: '10vh', fontWeight: 'bold', color: 'white' }}>
                    Make an Account Today!
                </Typography>
                <img src={astronaut4} style={{ height: '50vh', width: '50vh' }} />
                <Button href={"./signup/"} sx={{ backgroundColor: 'white', color: 'black', width: '20vw', fontSize: 48, fontWeight: 'bold' }}>Sign Up</Button>
            </div >
        </div >
    )
}