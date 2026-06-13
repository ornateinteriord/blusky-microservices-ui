import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, InputAdornment, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Checkbox, FormHelperText, Dialog, DialogTitle, DialogContent, DialogActions, Grid, useTheme, useMediaQuery, Avatar,  } from '@mui/material';

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import PublicIcon from '@mui/icons-material/Public';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BMSLogo from "../../assets/uwt.png";
import { useGetSponserRef, useSignupMutation } from '../../api/Auth';
import { LoadingComponent } from '../../App';

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  
  const [formData, setFormData] = useState<Record<string, string>>({
    Sponsor_code: "",
    Sponsor_name: "",
    gender: "",
    Name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileno: "",
    pincode: "",
    country: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [genderError, setGenderError] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<{ memberId: string; password: string; email: string }>({
    memberId: '',
    password: '',
    email: ''
  });

  const { data: sponsorData, isLoading, isError, error, refetch } = useGetSponserRef(formData.Sponsor_code);

  useEffect(() => {
    if (refCode) setFormData(prev => ({ ...prev, Sponsor_code: refCode }));
  }, [refCode]);

  useEffect(() => {
    if (formData.Sponsor_code && formData.Sponsor_code.length >= 5) refetch();
  }, [formData.Sponsor_code, refetch]);

  useEffect(() => {
    if (sponsorData && sponsorData.name) {
      setFormData(prev => ({ ...prev, Sponsor_name: sponsorData.name }));
    } else if (isError) {
      setFormData(prev => ({ ...prev, Sponsor_name: "" }));
    }
  }, [sponsorData, isError]);

  const sponsorError = isError && error instanceof Error ? error.message : "";

  const handleSponsorCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, Sponsor_code: e.target.value, Sponsor_name: "" }));
  };

  const handleSponsorCodeBlur = () => {
    if (formData.Sponsor_code && formData.Sponsor_code.length >= 5) refetch();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setErrorMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevData => ({ ...prevData, gender: e.target.value }));
    setGenderError(false);
  };

  const { mutate, isPending } = useSignupMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.gender) return setGenderError(true);
    if (!formData.password || formData.password.length <= 5) return setErrorMessage("Password must be at least 6 characters*");
    if (formData.password !== formData.confirmPassword) return setErrorMessage("Passwords do not match");
    if (!formData.Sponsor_code || formData.Sponsor_code.length < 5) return setErrorMessage("Valid sponsor code is required");
    if (!formData.Sponsor_name) return setErrorMessage("Please enter a valid sponsor code");
    if (!formData.country) return setErrorMessage("Country is required");

    try {
      const finalData = {
        sponsor_id: formData.Sponsor_code,
        Sponsor_code: formData.Sponsor_code,
        Sponsor_name: formData.Sponsor_name,
        spackage: 'USDT Plan',
        ...formData
      };

      mutate(finalData, {
        onSuccess: (response) => {
          if (response.success) {
            setRegistrationData({
              memberId: response.user.Member_id,
              password: formData.password,
              email: formData.email
            });
            setSuccessDialogOpen(true);
          }
        },
        onError: (error: any) => {
          setErrorMessage(error.response?.data?.message || "Registration failed");
        }
      });
    } catch (error: any) {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
    navigate("/login");
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "#ffffff",
      bgcolor: "rgba(255, 255, 255, 0.03)",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(0, 230, 118, 0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#00e676", borderWidth: "2px" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.6)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00e676" },
    "& .MuiOutlinedInput-input::placeholder": { color: "rgba(255, 255, 255, 0.3)", opacity: 1 }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#0D2658" }}>
      {/* Left Branding Panel (Hidden on mobile) */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            background: 'linear-gradient(135deg, #0a1c42 0%, #0D2658 100%)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
          }}
        >
          {/* Decorative Elements */}
          <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 230, 118, 0.15) 0%, rgba(255,215,0,0) 70%)', filter: 'blur(40px)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: '-5%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 230, 118, 0.1) 0%, rgba(255,215,0,0) 70%)', filter: 'blur(30px)', borderRadius: '50%' }} />
          
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 500 }}>
            <img src={BMSLogo} alt="BMS Logo" style={{ height: "180px", marginBottom: "2rem", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }} />
            <Typography variant="h2" sx={{ color: '#00e676', fontWeight: 900, mb: 2, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              Join the Future
            </Typography>
            <Typography variant="h5" sx={{ color: '#ffffff', opacity: 0.9, fontWeight: 500, lineHeight: 1.6, mb: 4 }}>
              Unlock exclusive benefits, instant transactions, and global opportunities with the world's leading USDT platform.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
              {[
                { label: 'Secure', icon: <LockIcon /> },
                { label: 'Global', icon: <PublicIcon /> },
                { label: 'Premium', icon: <AutoAwesomeIcon /> }
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00e676', width: 56, height: 56 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Right Registration Form Panel */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 600px' },
          bgcolor: '#0D2658',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          {isMobile && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <img src={BMSLogo} alt="BMS Logo" style={{ height: "100px", objectFit: "contain" }} />
            </Box>
          )}

          <Typography component="h1" variant="h4" sx={{ color: "#ffffff", fontWeight: 800, mb: 1 }}>
            Create Account
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", mb: 4 }}>
            Fill in your details below to get started.
          </Typography>

          {errorMessage && (
            <Box sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', border: '1px solid rgba(211, 47, 47, 0.3)' }}>
              <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>{errorMessage}</Typography>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              {/* Sponsor Code */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="Sponsor_code" placeholder="Sponsor Code"
                  value={formData.Sponsor_code} onChange={handleSponsorCodeChange} onBlur={handleSponsorCodeBlur}
                  error={(formData.Sponsor_code.length > 0 && formData.Sponsor_code.length < 5) || (formData.Sponsor_code.length >= 5 && !!sponsorError)}
                  helperText={(formData.Sponsor_code.length > 0 && formData.Sponsor_code.length < 5) ? "Minimum 5 chars." : formData.Sponsor_code.length >= 5 && sponsorError ? sponsorError : ""}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Sponsor Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="Sponsor_name" placeholder="Sponsor Name"
                  value={formData.Sponsor_name} disabled
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={{
                    ...textFieldStyles,
                    "& .MuiOutlinedInput-root.Mui-disabled": { bgcolor: "rgba(255,255,255,0.02)" },
                    "& .MuiOutlinedInput-input.Mui-disabled": { WebkitTextFillColor: "rgba(255, 255, 255, 0.5)" }
                  }}
                />
              </Grid>

              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  required fullWidth name="Name" placeholder="Full Name"
                  value={formData.Name} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Email & Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="email" placeholder="Email Address"
                  value={formData.email} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="mobileno" placeholder="Mobile Number" type="tel"
                  value={formData.mobileno} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Password & Confirm */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="password" type="password" placeholder="Password"
                  value={formData.password} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="confirmPassword" type="password" placeholder="Confirm Password"
                  value={formData.confirmPassword} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Country & Pincode */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="country" placeholder="Country"
                  value={formData.country} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required fullWidth name="pincode" placeholder="Pincode"
                  value={formData.pincode} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: "rgba(255,255,255,0.4)" }} /></InputAdornment> }}
                  sx={textFieldStyles}
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <FormControl error={!!genderError}>
                  <FormLabel sx={{ color: "rgba(255,255,255,0.7)", display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WcIcon sx={{ mr: 1, color: "rgba(255,255,255,0.4)" }} /> Gender
                  </FormLabel>
                  <RadioGroup row name="gender" value={formData.gender} onChange={handleRadioChange}>
                    <FormControlLabel value="Male" control={<Radio sx={{ color: "rgba(255,255,255,0.3)", "&.Mui-checked": { color: "#00e676" } }} />} label={<span style={{ color: "rgba(255,255,255,0.8)" }}>Male</span>} />
                    <FormControlLabel value="Female" control={<Radio sx={{ color: "rgba(255,255,255,0.3)", "&.Mui-checked": { color: "#00e676" } }} />} label={<span style={{ color: "rgba(255,255,255,0.8)" }}>Female</span>} />
                  </RadioGroup>
                  {genderError && <FormHelperText sx={{ color: "#d32f2f" }}>Please select a gender</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Terms */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} sx={{ color: "rgba(255,255,255,0.3)", "&.Mui-checked": { color: "#00e676" } }} />}
                  label={<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>I accept the Terms and Conditions</Typography>}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit" fullWidth variant="contained" disabled={!isChecked || isPending}
                  sx={{
                    py: 1.8,
                    bgcolor: "#00e676",
                    color: "#0D2658",
                    fontWeight: 800,
                    fontSize: "1rem",
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: "0 8px 24px rgba(0, 230, 118, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: "#00c853", transform: "translateY(-2px)", boxShadow: "0 12px 28px rgba(0, 230, 118, 0.3)" },
                    "&:disabled": { bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }
                  }}
                >
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 4, color: "rgba(255,255,255,0.5)" }}>
            Already registered?{" "}
            <Link to="/login" style={{ color: "#00e676", textDecoration: "none", fontWeight: 700 }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#0D2658', border: '1px solid rgba(0, 230, 118, 0.2)', borderRadius: '24px', p: 2 } }}
      >
        <DialogTitle sx={{ color: '#00e676', textAlign: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
          Registration Successful!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            Welcome aboard! Here are your credentials:
          </Typography>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block', textAlign: 'left', minWidth: 250 }}>
            <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}><strong style={{ color: '#00e676' }}>Member ID:</strong> {registrationData.memberId}</Typography>
            <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}><strong style={{ color: '#00e676' }}>Email:</strong> {registrationData.email}</Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}><strong style={{ color: '#00e676' }}>Password:</strong> {registrationData.password}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 4, color: 'rgba(255,255,255,0.5)' }}>
            Please save these securely. You will need your Member ID to log in.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ bgcolor: '#00e676', color: '#0D2658', fontWeight: 700, px: 6, py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: '#00c853' } }}>
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
      {(isLoading || isPending) && <LoadingComponent />}
    </Box>
  );
};

export default Register;
