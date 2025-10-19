'use client';
import { Box, useMediaQuery } from '@mui/material';
import LoginForm from './LoginForm';
import React from 'react';

export default function Login() {
    const [isStudent, setIsStudent] = React.useState(true);
    const isMobile = useMediaQuery('(max-width:900px)');
    const [overlayStyle, setOverlayStyle] = React.useState<React.CSSProperties>({
        left: '0%',
        backgroundImage: 'url("/images/student-image.jpg")',
        opacity: 1,
    });
    const [formOpacity, setFormOpacity] = React.useState(0);
    const [user, setUser] = React.useState<{ email: string; password: string }>({ email: '', password: '' });

    

    // Fade in form on mount
    React.useEffect(() => {
        setTimeout(() => setFormOpacity(1), 300);
    }, []);

    const handleToggle = () => {
        setFormOpacity(0);

        setTimeout(() => {
            setIsStudent((prev) => !prev);
            setOverlayStyle({
                left: isStudent ? '50%' : '0%',
                backgroundImage: isStudent
                    ? 'url("/images/instructor-image.jpg")'
                    : 'url("/images/student-image.jpg")',
                opacity: 1,
            });

            setTimeout(() => setFormOpacity(1), 600);
        }, 200);
    };

    return (
        <Box
            sx={{
                backgroundImage: 'url("/images/background-education.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, // stack on mobile
                    width: { xs: '100%', sm: '90%', md: '80%' },
                    maxWidth: 1000,
                    position: 'relative',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: 'hidden',
                }}
            >
                {/* Left Form */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 2, md: 4 },
                        opacity: formOpacity,
                        transition: 'opacity 0.8s ease-in-out',
                        order: { xs: 2, md: 1 }, // move below overlay on mobile
                    }}
                >
                    {!isStudent && <LoginForm setIsStudent={handleToggle} isStudent={isStudent} user={user} setUser={setUser} />}
                </Box>

                {/* Right Form */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 2, md: 4 },
                        opacity: formOpacity,
                        transition: 'opacity 0.8s ease-in-out',
                        order: { xs: 2, md: 2 }, // maintain order
                    }}
                >
                    {isStudent && <LoginForm setIsStudent={handleToggle} isStudent={isStudent} user={user} setUser={setUser} />}
                </Box>
                <Box
                    position={!isMobile ? 'absolute' : 'relative'}
                    top={0}
                    width={{ xs: '100%', md: '50%' }}
                    height={{ xs: '250px', md: '100%' }}
                    sx={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 2,
                        transition:
                            'left 0.8s ease-in-out, background-image 1s ease-in-out, opacity 0.6s ease-in-out, height 0.6s ease-in-out, width 0.6s ease-in-out',
                        ...overlayStyle,
                        left: { xs: '0%', md: overlayStyle.left }, // full width overlay on mobile
                    }}
                />
            </Box>
        </Box>
    );
}
