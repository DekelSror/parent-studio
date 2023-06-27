import { Button, Card, CardMedia, Stack, Typography } from '@mui/material'
import { useContext } from 'react'
import { WizardContext } from '../store'


const Finalize = () => {
    const {outputUrl} = useContext(WizardContext)

    return <Stack>
        {!outputUrl && <Stack>
            <Typography> we are generating your video, hold tight! </Typography>
        </Stack>}

        {outputUrl && <Stack>
            <Card>
                <CardMedia>
                    <video 
                        src={outputUrl}
                        controls
                        muted
                        width={600}
                        height={400}
                    />
                </CardMedia>
            </Card>

            <Button onClick={() => window.open(outputUrl)} >
                <Typography> DOWNLOAD VIDEO </Typography>
            </Button>
        </Stack>}
    </Stack>
}




export default Finalize