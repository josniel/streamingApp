import React, { /* useEffect */ } from 'react'
import clsx from 'clsx'
import { makeStyles, /* withStyles */ } from '@material-ui/core/styles'
import { useGlobalState, useGlobalMutation } from '../utils/container'
// import { Container } from '@material-ui/core'
import { Card } from '@material-ui/core'
import { CardContent } from '@material-ui/core'
// import { CardActions } from '@material-ui/core'
// import { Typography } from '@material-ui/core'
import { Box } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { Input } from '@material-ui/core'
// import { InputLabel } from '@material-ui/core'
import { FormControl } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import useRouter from '../utils/use-router'
import { useState } from 'react'
import api from '../utils/axios'

const useStyles = makeStyles((theme) => ({
    fontStyle: {
      color: '#9ee2ff'
    },
    midItem: {
      marginTop: '1rem',
      marginBottom: '6rem'
    },
    item: {
      flex: 1,
      display: 'flex',
      alignItems: 'center'
    },
    coverLeft: {
      background: 'linear-gradient(to bottom, #307AFF, 50%, #46cdff)',
      alignItems: 'center',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    coverContent: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      color: '#fff'
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    card: {
      display: 'flex',
      minWidth: 700,
      minHeight: 500,
      maxHeight: 500,
      borderRadius: '10px',
      boxShadow: '0px 6px 18px 0px rgba(0,0,0,0.2)'
    },
    input: {
      maxWidth: '250px',
      minWidth: '250px',
      alignSelf: 'center'
    },
    grid: {
      margin: '0 !important'
    },
    button: {
      lineHeight: '21px',
      color: 'rgba(255,255,255,1)',
      fontSize: '14px',
      textTransform: 'none',
      height: '44px',
      width: '95%',
      '&:hover': {
        backgroundColor: '#82C2FF'
      },
      margin: theme.spacing(1),
      backgroundColor: '#44a2fc',
    },
    radio: {
      padding: '0',
      fontSize: '14px',
      // display: 'flex',
      alignItems: 'center',
      paddingRight: '5px'
    }
  }))

const Register = () => {
    const classes = useStyles()
    const stateCtx = useGlobalState()
    const mutationCtx = useGlobalMutation()
    const routerCtx = useRouter()

    const [ full_name, setFullName ] = useState(null);
    const [ email, setEmail ] = useState(null);
    const [ password, setPassword ] = useState(null);

    const [ error, setError  ] = useState(null);

    const setUser = async () => {

        setError(null)
    
        const body = { full_name, email, password, rols: 2 }

        let formData = new FormData()
        formData.append('dat', JSON.stringify(body))
    
        await api.post('register', formData, {
            headers: {
              'Content-Type': undefined
            }
        }).then(res => {
            if (res) {
                logIn()
                console.log('res :>> ', res);
            } else {
                setError(res.message)
            }
        });
    
        /* if (res.success) {
          alert(res.message)
        }
        else {
          setError(res.message)
        } */
    
    }
    const logIn = async () => {
        const body = { email, password }
        await api.post('login', body).then(res => {
            if (res) { // Se debe ejecutar una mutacion que modifique el state con sessionInfo
            routerCtx.history.push({
                pathname: `/index`
            })
                /* const client = res.TRI_SESSION_INFO.roles.find(value => value === 2)
              if (client) {
                this.login(res)
                this.$router.push('/rooms')
              }  *//* else {
                this.login(res)
                this.$router.push('/')
              } */
            } else {
              console.log('error de ususario')
            }
        })
        
    
    }

    const bull = (
        <Box
          component="span"
          sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
          •
        </Box>
      );

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                <FormControl className={clsx(classes.input, classes.grid)}>
                <TextField id="full_name" label="Nombre" variant="outlined" onChange={(evt) => setFullName(evt.target.value)}/>
                <TextField id="email" label="Correo electronico" variant="outlined" onChange={(evt) => setEmail(evt.target.value)} />
                <TextField id="password" label="Contraseña" variant="outlined" onChange={(evt) => setPassword(evt.target.value)} />
                <div direction="column">
                    <Button
                        onClick={setUser}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >
                        Crear Usuario
                    </Button>
                </div>
                {/* <Input
                    id="email"
                    name="email"
                    value={stateCtx.config.email}
                    onChange={(evt) => {
                    const PATTERN = /^[a-zA-Z0-9!#$%&()+\-:;<=.>?@[\]^_{}|~,\s]{1,64}$/
                    const value = PATTERN.test(evt.target.value)
                    if (value && evt.target.value.length < 64) {
                        mutationCtx.updateConfig({ email: evt.target.value })
                    } else {
                        mutationCtx.updateConfig({ email: '' })
                    }
                    }}
                /> */}
                </FormControl>
                </CardContent>
            </Card>
        </Grid>
    )
}

  export default Register