import notfound from '../../static/not_found.svg'

import { Typography } from '@mui/material'


export function NotFound() {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h1' sx={{ fontWeight: 'bold' }}>Page Not found</Typography>
            <Typography variant='h2' sx={{ width: '50vw' }}>It seems like what you were looking for is not here</Typography>
            <img src={notfound} style={{ height: '50vh' }} />
        </div >
    )
}