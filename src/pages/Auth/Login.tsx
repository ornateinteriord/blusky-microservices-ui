import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Paper, Checkbox, FormControlLabel, Link as MuiLink, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline, LockOutlined } from '@mui/icons-material';

import { LoadingComponent } from '../../App';
import { useLoginMutation } from '../../api/Auth';
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import uwtLogo from "../../assets/USDT1.png";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validate the structure of the saved data
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.username && parsedUser.password) {
          setFormData({
            username: parsedUser.username,
            password: parsedUser.password,
          });
          setRememberMe(true);
        } else {
          // If data is invalid formatted, remove it to prevent future errors
          localStorage.removeItem("rememberedUser");
        }
      } catch (error) {
        // If saved data is not valid JSON (e.g. was stored as plain text), remove it
        localStorage.removeItem("rememberedUser");
        console.error("Failed to parse rememberedUser data:", error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginMutation = useLoginMutation();
  const { mutate, isPending } = loginMutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle Remember Me logic
    if (rememberMe) {
      localStorage.setItem("rememberedUser", JSON.stringify(formData));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    mutate(formData);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* Stunning Premium Banking Dark Gradient */
        background: "linear-gradient(180deg, #050916 0%, #0f1e36 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Abstract Background Design Elements for modern feel */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(0,230,118,0.12) 0%, rgba(0,230,118,0) 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(0,230,118,0.08) 0%, rgba(0,230,118,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <Container component="main" maxWidth="xs" sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* LOGO OUTSIDE FORM */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img src={uwtLogo} alt="UWT Logo" style={{ height: "140px", marginBottom: "3px", objectFit: "contain", filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))" }} />
        </Box>

        <Paper
          elevation={24}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            p: { xs: 3, md: 4 },
            borderRadius: "28px",
            background: "rgba(255, 255, 255, 0.04)", // Sleek glassmorphism
            backdropFilter: "blur(12px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* TEXT INSIDE FORM */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 800 }}>
              USDT World Club
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, mt: 0.5 }}>
              Empowering your digital wealth journey
            </Typography>
          </Box>

          {isResetMode ? (
            <ForgotPasswordForm onBackToLogin={() => setIsResetMode(false)} />
          ) : (
            <>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              label="User ID"
              placeholder="Enter your registered ID"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.25)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFD700",
                    borderWidth: "2px"
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FFD700",
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.4)",
                  opacity: 1,
                }
              }}
            />

            <TextField
              required
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: "rgba(255, 255, 255, 0.6)", mr: 0.5 }}
                    >
                      {showPassword ? <VisibilityOff sx={{ color: "rgba(255, 255, 255, 0.6)" }} /> : <Visibility sx={{ color: "rgba(255, 255, 255, 0.6)" }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.25)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFD700",
                    borderWidth: "2px"
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FFD700",
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.4)",
                  opacity: 1,
                }
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: -0.5
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "rgba(255, 255, 255, 0.3)",
                      "&.Mui-checked": {
                        color: "#FFD700",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
                    Remember me
                  </Typography>
                }
              />
              <MuiLink
                component="button"
                type="button"
                onClick={() => setIsResetMode(true)}
                underline="hover"
                sx={{ color: "#FFD700", fontSize: "0.875rem", fontWeight: 600, "&:hover": { color: "#e6c200" } }}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              sx={{
                mt: 1,
                mb: 1,
                background: "linear-gradient(135deg, #FFD700 0%, #e6c200 100%)",
                color: "#050916",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "12px",
                borderRadius: "12px",
                textTransform: "none",
                boxShadow: "0 8px 16px rgba(0, 230, 118, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #e6c200 0%, #FFD700 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 20px rgba(0, 230, 118, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "rgba(255, 255, 255, 0.3)"
                }
              }}
            >
              Sign In to Account
            </Button>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 1, color: "rgba(255, 255, 255, 0.5)", fontWeight: 500 }}
            >
              Ready to start your journey?{" "}
              <Link
                to="/register"
                style={{
                  color: "#FFD700",
                  textDecoration: "none",
                  fontWeight: 700,
                  transition: "color 0.2s ease"
                }}
              >
                Open an Account
              </Link>
              </Typography>

              {/* SUPPORT BUTTONS */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 2 }}>
                <Button 
                    variant="text" 
                    href="/chat"
                    sx={{ 
                      color: '#00e676', 
                      textTransform: 'none',
                      fontWeight: 700,
                      padding: 0,
                      minWidth: 'auto',
                      '&:hover': { bgcolor: 'transparent', color: '#33ff99' }
                    }}
                >
                    💬 Live Chat
                </Button>
                <Button 
                    variant="text" 
                    href="mailto:support@usdtworld.club"
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      textTransform: 'none',
                      fontWeight: 500,
                      padding: 0,
                      minWidth: 'auto',
                      '&:hover': { color: '#fff', bgcolor: 'transparent' }
                    }}
                >
                    support@usdtworld.club
                </Button>
              </Box>
            </Box>
            </>
          )}
        </Paper>
      </Container>
      {isPending && <LoadingComponent />}
    </Box>
  );
};

export default Login;
