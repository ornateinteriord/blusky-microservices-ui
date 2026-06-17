import React, { useContext, useState } from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Button, Box, Card, CardContent, InputAdornment, FormHelperText, Dialog, DialogTitle, DialogContent, DialogActions, Typography, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import UserContext from '../../../context/user/userContext';
import { useSignupMutation } from '../../../api/Auth';
import { LoadingComponent } from '../../../App';
import { toast } from 'react-toastify';

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India", 
  "Germany", "France", "Japan", "China", "Brazil", "South Africa",
  "Nigeria", "United Arab Emirates", "Singapore", "Malaysia",
  "New Zealand", "Netherlands", "Switzerland", "Sweden", "Spain",
  "Italy", "Mexico", "Argentina", "Colombia", "Chile", "Peru",
  "Philippines", "Indonesia", "Vietnam", "Thailand", "South Korea",
  "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Saudi Arabia",
  "Qatar", "Oman", "Kuwait", "Bahrain", "Egypt", "Kenya", "Ghana",
  "Uganda", "Tanzania", "Morocco", "Algeria", "Tunisia", "Turkey",
  "Iran", "Iraq", "Israel", "Jordan", "Lebanon", "Russia", "Ukraine",
  "Poland", "Romania", "Czech Republic", "Hungary", "Greece", "Portugal",
  "Ireland", "Belgium", "Austria", "Denmark", "Finland", "Norway"
].sort();

const NewResgister: React.FC = () => {
  const { user } = useContext(UserContext)
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [genderError, setGenderError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<{ memberId: string; password: string }>({
    memberId: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: e.target.value,
    }));
  };

  const { mutate, isPending } = useSignupMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.gender) {
      setGenderError(true);
      return;
    }
    if (formData.password && formData.password.length <= 5) {
      setErrorMessage("Password must be at least 6 characters*");
      return;
    }
    try {
      mutate({
        sponsor_id: user.Member_id,
        Sponsor_code: user.Member_id,
        Sponsor_name: user.Name,
        spackage: 'USDT Plan',
        ...formData
      }, {
        onSuccess: (response) => {
          if (response.success) {
            setRegistrationData({
              memberId: response.user.Member_id,
              password: formData.password
            });
            setSuccessDialogOpen(true);
            toast.success("Registration successful");
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Registration failed");
        }
      });

    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
    setFormData({});
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'rgba(255,255,255,0.03)',
      color: '#fff',
      borderRadius: '12px',
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.1)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255,255,255,0.2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFD700',
      },
      '&.Mui-disabled': {
        bgcolor: 'rgba(0,0,0,0.2)',
        color: '#ffffff',
        WebkitTextFillColor: '#ffffff',
        opacity: 1,
      }
    },
    '& .MuiOutlinedInput-input': {
      '&.Mui-disabled': {
        color: '#ffffff',
        WebkitTextFillColor: '#ffffff',
        opacity: 1,
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.7)',
      '&.Mui-focused': {
        color: '#FFD700',
      },
      '&.Mui-disabled': {
        color: '#ffffff',
      }
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: 'rgba(255,255,255,0.3)',
      opacity: 1,
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', p: { xs: 2, md: 5 }, pt: { xs: 4, md: 10 } }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 1, textAlign: 'center' }}>
          Create New Member
        </Typography>
       

        <Card sx={{ borderRadius: '24px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
          <CardContent sx={{ p: { xs: 2, md: 5 } }}>
            {/* Joining Details Section */}
            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> Joining Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 3, width: '100%' }}>
              <TextField
                label="Sponsor Code"
                name="sponsorCode"
                value={user?.Member_id || ''}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'rgba(255,255,255,0.3)' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />
              <TextField
                label="Sponsor Name"
                name="sponsorName"
                value={user?.Name || ''}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'rgba(255,255,255,0.3)' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />
            </Box>

            {/* New Member Details Section */}
            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> New Member Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Full Name"
                name="Name"
                value={formData.Name || ''}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter member's full name"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#FFD700' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />

              <FormControl error={!!genderError} sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <FormLabel sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1, mb: 1, '&.Mui-focused': { color: '#FFD700' } }}>
                  <WcIcon sx={{ color: '#FFD700' }} />
                  Gender
                </FormLabel>
                <RadioGroup row name="gender" value={formData.gender || ''} onChange={handleRadioChange}>
                  <FormControlLabel value="Male" control={<Radio sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#FFD700' } }} />} label={<Typography sx={{ color: '#fff' }}>Male</Typography>} />
                  <FormControlLabel value="Female" control={<Radio sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#FFD700' } }} />} label={<Typography sx={{ color: '#fff' }}>Female</Typography>} />
                </RadioGroup>
                {genderError && <FormHelperText sx={{ color: "#f44336" }}>Please select gender*</FormHelperText>}
              </FormControl>

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter email address"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#FFD700' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />

              <TextField
                label="Mobile Number"
                name="mobileno"
                type="tel"
                value={formData.mobileno || ''}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter mobile number"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#FFD700' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />

              <TextField
                select
                label="Country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PublicIcon sx={{ color: '#FFD700' }} /></InputAdornment>,
                }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value) {
                      return <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>Enter country</span>;
                    }
                    return value;
                  }
                }}
                sx={{
                  ...textFieldStyles,
                  "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.6)" }
                }}
              >
                <MenuItem disabled value=""><em>Enter country</em></MenuItem>
                {COUNTRIES.map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Create a strong password"
                error={!!errorMessage}
                helperText={errorMessage}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#FFD700' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />
            </Box>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isPending}
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #e6c200 100%)',
                  color: '#050916',
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e6c200 0%, #cca000 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(255, 215, 0, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                  transition: 'all 0.2s'
                }}
              >
                {isPending ? 'Processing Registration...' : 'Register Member'}
              </Button>
            </Box>
          </CardContent>
          {isPending && <LoadingComponent />}
        </Card>

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              bgcolor: '#0f1e36',
              color: '#fff',
              borderRadius: '24px',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>Registration Successful!</Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            {/* <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'rgba(255,255,255,0.7)' }}>
              New member has been successfully added to your network.
            </Typography> */}
            <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Member ID</Typography>
                <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>{registrationData.memberId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Password</Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{registrationData.password}</Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              Please securely share these credentials with the new member.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 2, justifyContent: 'center' }}>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Close Window
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default NewResgister;