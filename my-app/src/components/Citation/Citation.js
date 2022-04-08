import astronaut4 from '../../static/astronaut4.png'
import avatar from '../../static/avatar.png'
import home from '../../static/home.svg'
import landing1 from '../../static/landing-1.svg'
import landing2 from '../../static/landing-2.svg'
import logo from '../../static/logo.svg'
import notfound from '../../static/not_found.svg'
import "./Citation.css";

import { Typography } from '@mui/material'


export function Citation() {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Image Citations</h1>
            <div style={{ width: '25vw' }}>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/204126/awesome-pose-astronaut-colored">
                        Vexels.com: Awesome Pose Astronaut
                </a>
                <img src={astronaut4} style={{ height: '20vh' }} />
            </div>
            <div style={{ width: '25vw' }}>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/245302/yellow-cat-boba-tea-cute">
                    Vexels.com: Yellow Cat Boba Tea Cute - Edited using Canva
                </a>
                <img src={avatar} style={{ height: '20vh' }} />
            </div>
            <div style={{ width: '25vw' }}>
                <h3>Landing 1 Image Edited using canva with assets:</h3>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/245302/yellow-cat-boba-tea-cute">
                    Vexels.com: Yellow Cat Boba Tea Cute
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/239486/earth-with-moon-orbit-doodle">
                    Vexels.com: Earth with Moon Orbit Doodle
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/204261/hand-reach-astronaut-colored">
                    Vexels.com: Hand Reach Astronaut Colored
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/256754/american-rocket-ship-color-stroke">
                    Vexels.com: American Rocket Ship Color Stroke
                </a>
                <img src={landing1} style={{ height: '20vh' }} />
            </div>
            <div style={{ width: '25vw' }}>
                <h3>Landing 2 Image Edited using canva with assets:</h3>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/245302/yellow-cat-boba-tea-cute">
                    Vexels.com: Yellow Cat Boba Tea Cute
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/204257/hand-on-hip-astronaut-colored">
                    Vexels.com: Hand On Hip Astronaut Colored
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/204356/simple-standing-astronaut-colored">
                    Vexels.com: Simple Standing Astronaut Colored
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/256754/american-rocket-ship-color-stroke">
                    Vexels.com: American Rocket Ship Color Stroke
                </a>
                <img src={landing2} style={{ height: '20vh' }} />
            </div>
            <div style={{ width: '25vw' }}>
                <h3>Home Button Image Edited using canva with assets:</h3>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/245302/yellow-cat-boba-tea-cute">
                    Vexels.com: Yellow Cat Boba Tea Cute
                </a>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/239489/simple-earth-color-doodle">
                    Vexels.com: Simple Earth Color Doodle
                </a>
                <img src={home} style={{ height: '20vh' }} />
            </div>
            <div style={{ width: '25vw' }}>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/245302/yellow-cat-boba-tea-cute">
                    Vexels.com: Yellow Cat Boba Tea Cute
                </a>
                <img src={logo} style={{ height: '20vh' }} />
            </div>
            <div style={{ width: '25vw' }}>
                <a className="citation" target="_blank" href="https://www.vexels.com/png-svg/preview/204108/astronaut-colored-behind">
                    Vexels.com: Astronaut Colored Behind
                </a>
                <img src={notfound} style={{ height: '20vh' }} />
            </div>
            <h1>Images from Journeys</h1>
            <div style={{ width: '25vw' }}>
                Moscow<br />
                Photo by <a href="https://unsplash.com/@nikolayv?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nikolay Vorobyev</a> on <a href="https://unsplash.com/s/photos/moscow?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                <br />St.Petersburg<br />
                Photo by <a href="https://unsplash.com/@helenaast?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Helen Ast</a> on <a href="https://unsplash.com/s/photos/st.-petersburg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                <br />Stalingrad<br />
                Photo by <a href="https://unsplash.com/@ant746?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dmitry Antropov</a> on <a href="https://unsplash.com/s/photos/stalingrad?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                <br />Tokyo<br />
                Photo by <a href="https://unsplash.com/@jezar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jezael Melgoza</a> on <a href="https://unsplash.com/s/photos/tokyo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                <br />Kyoto<br />
                Photo by <a href="https://unsplash.com/@boontohhgraphy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sorasak</a> on <a href="https://unsplash.com/s/photos/kyoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                <br />Osaka<br />
                Photo by <a href="https://unsplash.com/@nomadicjulien?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nomadic Julien</a> on <a href="https://unsplash.com/s/photos/osaka?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
            </div>
            <h1>Code Citation</h1>
            <a target="_blank" href="https://medium.com/@mahyor.sam/tracking-errors-in-apollo-graphql-with-sentry-549ae52c0c76">
                Sentry Configuration for NodeJS
            </a>
            <a target="_blank" href="https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site">
                Calculate time since posting
            </a>
            <a target="_blank" href="https://codesandbox.io/s/l7p179qr6m?file=/src/index.js">
                Geocoder setup code
            </a>
            <a target="_blank" href="https://mui.com/">
                UI components built from Material UI
            </a>
            <br />Toronto Airport<br />
            Photo by <a href="https://unsplash.com/@h_w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">H W</a> on <a href="https://unsplash.com/s/photos/toronto-airport?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        </div >
    )
}