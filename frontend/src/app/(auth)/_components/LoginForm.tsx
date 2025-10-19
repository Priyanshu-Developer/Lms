import {
    Box,
    Typography,
    Button,
    Link,
    Stack,
    IconButton,
    useTheme,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon,  } from '@mui/icons-material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import React from 'react';
import { styled } from '@mui/material/styles';

interface LoginFormProps {
    setIsStudent: React.Dispatch<React.SetStateAction<boolean>>;
    isStudent: boolean;
    user: { email: string; password: string };
    setUser: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2.5),
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        backgroundColor: theme.palette.custom.primaryLight,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? theme.palette.custom.border : theme.palette.custom.primaryMain,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.custom.hover,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.custom.primaryDark,
            borderWidth: 3,
        },
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.mode === 'dark' ? theme.palette.custom.labelFocused : theme.palette.custom.label,
        fontWeight: 500,
        transition: 'color 0.3s ease',
    },
    '& .Mui-focused .MuiInputLabel-root': {
        color: theme.palette.custom.primaryDark,
    },
}));

export default function LoginForm({ setIsStudent, isStudent, user, setUser }: LoginFormProps) {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();
    const handleMouseUpPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();



    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: theme.palette.primary.main, mb: 0.5 }}
            >
                EduLearn LMS
            </Typography>
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                Sign in as {isStudent ? 'Student' : 'Instructor'}
            </Typography>

            <StyledFormControl>
                <InputLabel htmlFor="email">Email / Username</InputLabel>
                <OutlinedInput
                    id="email"
                    value={user.email}
                    onChange={(e) =>
                        setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    label="Email / Username"
                />
            </StyledFormControl>

            <StyledFormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={user.password}
                    onChange={(e) =>
                        setUser((prev) => ({ ...prev, password: e.target.value }))
                    }
                    label="Password"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </StyledFormControl>

            <Link
                href="#"
                underline="none"
                sx={{ color: theme.palette.custom.primaryMain, fontSize: '1rem', mb: 2 }}
            >
                Forgot password?
            </Link>

            <Button
                fullWidth
                sx={{
                    py: 1.2,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: theme.palette.custom.gradient,
                    color: theme.palette.custom.textOnGradient,
                    boxShadow: theme.palette.custom.boxShadow,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                }}
            >
                Sign In
            </Button>

            <Button
                fullWidth
                onClick={() => setIsStudent(!isStudent)}
                sx={{
                    backgroundColor: theme.palette.custom.primaryLight,
                    border: `1.5px solid ${theme.palette.custom.border}`,
                    borderRadius: 2,
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: theme.palette.custom.primaryMain,
                    mb: 2,
                }}
            >
                {isStudent ? 'Sign In as Instructor' : 'Sign In as Student'}
            </Button>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                <IconButton
                    sx={{
                        backgroundColor: theme.palette.custom.primaryLight,
                        border: `1.5px solid ${theme.palette.custom.border}`,
                        '&:hover': { backgroundColor: theme.palette.custom.primaryLight },
                    }}
                >
                    <GoogleIcon sx={{ color: theme.palette.custom.primaryMain }} />
                </IconButton>
                <IconButton
                    sx={{
                        backgroundColor: theme.palette.custom.primaryLight,
                        border: `1.5px solid ${theme.palette.custom.border}`,
                        '&:hover': { backgroundColor: theme.palette.custom.primaryLight },
                    }}
                >
                    <MicrosoftIcon sx={{ color: theme.palette.custom.primaryMain }} />
                </IconButton>
            </Stack>
        </Box>
    );
}
