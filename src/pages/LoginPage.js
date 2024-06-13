import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo5 from "../assets/moto5.jpg"
import logo4 from "../assets/moto4.png"
import logo3 from "../assets/moto3.jpg"
import logo2 from "../assets/moto2.jpg"
import logo1 from "../assets/moto1.png"
import { handlePasswordValidation, validateEmail } from '../helpers/common';
import useLocalStorage from '../hooks/useLocalStorage';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { setLogin } from '../redux/actions/auth';
import { useDispatch } from 'react-redux';





function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {



    const [error, setError] = useState({});
    const navigate = useNavigate();

    const dispatch = useDispatch();


    const [singinSuccess, setSigninSuccess] = useState(false);

    const [totalUsers, setTotalUsers] = useLocalStorage('totalUser', []);

    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        const passwordError = handlePasswordValidation(userData.password);
        const emailError = validateEmail(userData.email);


        console.log("emailError", emailError);
        // Check for email error
        if (emailError) {
            setError({ email: emailError });
            return;
        } else {
            setError({ email: '' });
        }


        // Check for password error
        if (passwordError) {
            setError({ password: passwordError });
            return;
        } else {
            setError({ password: '' });
        }



        const emailExist = totalUsers.find(item => item.email === userData.email);
        let passwordMatch = false;
        console.log("emailExist", emailExist);

        if (emailExist) {

            passwordMatch = emailExist.password === userData.password;


        } else {
            setError({ email: 'User does not exists. Please signup first' });
            return
        }


        if (passwordMatch) {

        } else {
            setError({ password: "credentials not matched" })
            return
        }



        dispatch(setLogin(emailExist))
        setSigninSuccess(true)
        setError({});

    };


    useEffect(() => {
        let redirectTimer;
        if (singinSuccess) {
            redirectTimer = setTimeout(() => {

                navigate('/')
            }, 2000);
        }

        return () => {
            clearTimeout(redirectTimer);
        };
    }, [singinSuccess]);



    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${logo5})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={!!error.email}
                                helperText={error.email}
                                onChange={handleChange}

                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!!error.password}
                                helperText={error.password}
                                onChange={handleChange}

                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}