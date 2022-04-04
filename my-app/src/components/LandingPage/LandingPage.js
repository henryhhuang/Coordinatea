import landing1 from '../../static/landing-1.svg'
import landing2 from '../../static/landing-2.svg'
import astronaut4 from '../../static/astronaut4.png'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Button, Grow, Icon, IconButton, Typography } from '@mui/material'

import Fade from '@mui/material/Fade';

import "./LandingPage.css"

export function LandingPage() {

    return (
        <div id="landing-page">
            <div id="section1" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#282e2f', height: '100vh' }}>
                <div style={{ display: 'flex', height: '95vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50vw' }}>
                        <Grow in={true} timeout={2000}>
                            <img src={landing1} style={{ width: '50vw' }} />
                        </Grow>
                    </div>
                    <div style={{ marginLeft: '5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '40vw' }}>
                        <Fade in={true} timeout={3000}>
                            <Typography align='left'
                                variant='h1' sx={{ fontSize: '10vh', fontWeight: 'bold', color: 'white' }}>
                                Explore the world!
                            </Typography>
                        </Fade>
                        <Fade in={true} timeout={4000}>
                            <Typography align='left' variant='h3' sx={{ fontSize: '5vh', fontWeight: 'bold', color: 'white' }}>
                                In the time it takes to make a cup of tea
                            </Typography>
                        </Fade>
                    </div>
                </div>
                <div style={{ height: '5vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton href="#section2" sx={{ color: 'white' }}>
                        <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                    </IconButton>
                </div>
            </div >
            <div id="section2" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
                    <Typography align='center' variant='h2' sx={{ mt: 1, fontWeight: 'bold', color: 'black' }}>
                        Share Your Journeys with Your Friends & Family!
                    </Typography>

                    <img src={landing2} style={{ height: '75vh' }} />
                </div>
                <div style={{ height: '5vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton href="#section3" sx={{ position: 'relative' }}>
                        <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                    </IconButton>
                </div>
            </div >
            <div id="section3" style={{ backgroundColor: '#282e2f', height: '100vh' }}>
                <div style={{ height: '5vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton href="#section1" sx={{ color: 'white', position: 'relative' }}>
                        <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                    </IconButton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
                    <Typography align='center' variant='h2' sx={{ fontWeight: 'bold', color: 'white' }}>
                        Become and Explorer!
                    </Typography>
                    <Typography align='center' variant='h2' sx={{ fontWeight: 'bold', color: 'white' }}>
                        Make Your Account Today!
                    </Typography>
                    <img src={astronaut4} style={{ p: '5vh', height: '50vh', width: '50vh' }} />
                    <Button href={"./signup/"} variant='contained' sx={{ backgroundColor: 'white', color: 'black', width: '20vw', fontSize: 32, fontWeight: 'bold' }}>Sign Up</Button>
                </div>
            </div >
        </div >
    )
}