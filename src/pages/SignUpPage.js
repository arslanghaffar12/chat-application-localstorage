import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { generateUniqueID, handlePasswordValidation, validateEmail } from '../helpers/common';
import useLocalStorage from '../hooks/useLocalStorage';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

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



export default function SignUp() {


    const existingIDs = ['AA1111', 'XY1234'];

    const [userIds, setUserIds] = useLocalStorage("userIds", []);






    const location = useLocation()
    const navigate = useNavigate();

    const [totalUsers, setTotalUsers] = useLocalStorage('totalUser', []);

    console.log("totalUsers", totalUsers);


    let _user = {
        _id: "",
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        login: false,
        status: false,
        chats: []
    }


    const [userData, setUserData] = useState(
        _user
    );

    const [error, setError] = useState({});
    const [signUpSuccess, setSignUpSuccess] = useState(false);


    console.log("userData is", userData);


    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };



    const handleSubmit = (event) => {

        event.preventDefault();

        const passwordError = handlePasswordValidation(userData.password);
        const emailError = validateEmail(userData.email);



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
        console.log("emailExist", emailExist);

        if (emailExist) {
            setError({ email: 'Email already exists. Please use a different email.' });
            return;
        } else {
            setError({ email: '' });
        }




        const newID = generateUniqueID(userIds);
        userData["_id"] = newID;




        let _totalUsers = [...totalUsers, userData];
        setTotalUsers(_totalUsers)



        // Clear form data
        setUserData(_user);

        // Reset error messages
        setError({});
        setSignUpSuccess(true);

    };

    useEffect(() => {
        let redirectTimer;
        if (signUpSuccess) {
            redirectTimer = setTimeout(() => {
                // Redirect to sign-in page after 3 seconds
                // Replace the URL with the actual sign-in page URL
                navigate('/login')
            }, 1000);
        }

        return () => {
            clearTimeout(redirectTimer);
        };
    }, [signUpSuccess]);



    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={userData.username}
                                    onChange={handleChange}

                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={userData.lastName}
                                    onChange={handleChange}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!!error.email}
                                    helperText={error.email}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={userData.email}
                                    onChange={handleChange}

                                />

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!!error.password}
                                    helperText={error.password}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={userData.password}

                                    onChange={handleChange}
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}



