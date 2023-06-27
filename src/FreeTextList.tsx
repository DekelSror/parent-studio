import { Divider, Stack, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { RemoveButton, AddButton, colors, DInput } from './styles'

type FreeTextListProps = {
    initialItems: string[], 
    onChange: (items: string[]) => void
    addLabel: string
    description?: string
}

const FTLContainer = styled(Stack)(({theme}) => ({
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    },
}))

const FreeTextList = ({initialItems, onChange, addLabel, description}: FreeTextListProps) => {
    const [items, setItems] = useState<string[]>(initialItems)
    const [edited, setEdited] = useState<string>()

    useEffect(() => {
        onChange(items)
    }, [items])

    return <Stack sx={{
            p: 2, 
            // backgroundColor: colors.bg.darkHighlight, 
            borderRadius: '0.3rem', 
            boxShadow: '2px 1px 1px #aaaaaa',
        }}>
        {description && <Typography variant='h4' sx={{mb: 3}} > {description}  </Typography>}

        <Stack gap={1} sx={{mb: 2}}>
            {items.length > 0 && items.map(item => <form key={item}>
                <Stack 
                    direction='row' 
                    alignItems='center' 
                    gap={2}
                    sx={{borderRadius: 1, p: 0.4}} 
                >
                    <Typography variant='subtitle2'> {item} </Typography>
                    <RemoveButton
                        variant='text'
                        onClick={() => {
                            const i = items.indexOf(item)
                            let after = items.slice()
                            after.splice(i, 1)

                            setItems(after)
                        }} 
                    >
                        remove
                    </RemoveButton>
                     
            </Stack>
            <Divider />
            </form>)}
        </Stack>

        <Typography variant='subtitle2' > {addLabel} </Typography>
        
        <form>
            <DInput value={edited} onChange={e => setEdited(e.target.value)} />
            <AddButton 
                
                onClick={() => {
                    if (!edited || edited === '') return
                    
                    setItems([...items, edited])
                    setEdited(undefined)
                }} 
            >
                Add
            </AddButton>

        </form>
    </Stack>
}

export default FreeTextList