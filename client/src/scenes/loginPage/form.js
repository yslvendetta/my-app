import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    MenuItem,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from  "state";
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';


// Registration schema for form validation
const registerSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    location: yup.string().required('Location is required'),
    userType: yup.string().required('User type is required'),
    picture: yup.mixed().required('Profile picture is required'),
});

// Login schema for form validation
const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});


const initialValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    userType: '',
    picture: null,
};

const initialValuesLogin = {
    email: '',
    password: '',
};

const Form = () => {
    const [pageType, setPageType] = useState('login');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordColor, setPasswordColor] = useState('');


    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const isLogin = pageType === 'login';
    const isRegister = pageType === 'register';

    // Function to evaluate password strength
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength ++;
        if (/[A-Z]/.test(password)) strength ++;
        if (/[a-z]/.test(password)) strength ++;
        if (/\d/.test(password)) strength ++;
        if (/[@$!%*?&#^()_\-+=]/.test(password)) strength ++;

        if (strength <= 2) {
            setPasswordStrength('Weak');
            setPasswordColor('red');
        } else if (strength === 3 || strength === 4) {
            setPasswordStrength('Medium');
            setPasswordColor('orange');
        } else if (strength === 5) {
            setPasswordStrength('Strong');
            setPasswordColor('green');
        } else {
            setPasswordStrength('');
            setPasswordColor('');
        }
    };

const register = async (values, onSubmitProps) => {
    const formData = new FormData();


    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('location', values.location);
    formData.append('userType', values.userType);
    
    if (values.picture) {
        formData.append('picture', values.picture);
    }

    try {
        const savedUserResponse = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            body: formData,
        });

        const savedUser = await savedUserResponse.json();
        if (!savedUserResponse.ok) throw new Error(savedUser.message || 'Failed to register');

        onSubmitProps.resetForm();
        setPageType('login');
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'An error occurred during registration');
    }
};

    const login = async (values) => {
            const loggedInResponse = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            }
            );

            const loggedIn = await loggedInResponse.json();
            if (loggedIn) {
                dispatch(
                    setLogin({
                        user: loggedIn.user,
                        token: loggedIn.token,
                    })
                );
                navigate('/home');
            } 
    };


    const handleFormSubmit = async (values, onSubmitProps) => {
        onSubmitProps.resetForm();
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };


    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    select
                                    label="User Type"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.userType}
                                    name="userType"
                                    error={Boolean(touched.userType) && Boolean(errors.userType)}
                                    helperText={touched.userType && errors.userType}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <MenuItem value="Mentee">Mentee</MenuItem>
                                    <MenuItem value="Mentor">Mentor</MenuItem>
                                </TextField>
                                <Box
                                gridColumn="span 4"
                                border={`1px solid ${palette.neutral.medium}`}
                                borderRadius="5px"
                                p="1rem"
                                >
                                <Dropzone
                                    acceptedFiles=".jpg,.jpeg,.png"
                                    multiple={false}
                                    onDrop={(acceptedFiles) =>
                                    setFieldValue("picture", acceptedFiles[0] || "")
                                    }
                                >
                                    {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{ "&:hover": { cursor: "pointer" } }}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picture ? (
                                        <p>Add Picture Here</p>
                                        ) : (
                                        <FlexBetween>
                                            <Typography>{values.picture.name}</Typography>
                                            <EditOutlinedIcon />
                                        </FlexBetween>
                                        )}
                                    </Box>
                                    )}
                                </Dropzone>
                                {touched.picture && errors.picture && (
                                    <Typography color="error" variant="caption">
                                    {errors.picture}
                                    </Typography>
                                )}
                                </Box>

                            </>
                        )}
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                handleChange(e);
                                checkPasswordStrength(e.target.value);
                            }}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                        {isRegister && values.password && (
                            <Typography
                                sx={{
                                    color: passwordColor,
                                    gridColumn: "span 4",
                                    mt: "-20px",
                                    mb: "10px",
                                    fontWeight: 500,
                                }}
                            >
                                Password strength: {passwordStrength}
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                mt: "2rem",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { backgroundColor: palette.primary.dark },
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>


                        <FlexBetween sx={{ width: "100%" }}>
                            <Typography
                                onClick={() => {
                                    setPageType(isLogin ? "register" : "login");
                                    resetForm();
                                }}
                                sx={{
                                    textDecoration: "underline",
                                    color: palette.primary.main,
                                    "&:hover": {
                                        cursor: "pointer",
                                        color: palette.primary.light,
                                    },
                                }}
                            >
                                {isLogin
                                    ? "Not a member? Sign Up here."
                                    : "Already a member? Hop in here!"}
                            </Typography>
                        </FlexBetween>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;

                
