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
        spackage: 'INR Plan',
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
      bgcolor: '#F8FAFC',
      color: '#0F172A',
      borderRadius: '12px',
      '& fieldset': {
        borderColor: '#E2E8F0',
      },
      '&:hover fieldset': {
        borderColor: '#E2E8F0',
      },
      '&.Mui-focused fieldset': {
        bordercolor: '#0284C7',
      },
      '&.Mui-disabled': {
        bgcolor: 'rgba(0,0,0,0.2)',
        color: '#0F172A',
        WebkitTextFillcolor: '#0F172A',
        opacity: 1,
      }
    },
    '& .MuiOutlinedInput-input': {
      '&.Mui-disabled': {
        color: '#0F172A',
        WebkitTextFillcolor: '#0F172A',
        opacity: 1,
      }
    },
    '& .MuiInputLabel-root': {
      color: '#475569',
      '&.Mui-focused': {
        color: '#0284C7',
      },
      '&.Mui-disabled': {
        color: '#0F172A',
      }
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: '#64748B',
      opacity: 1,
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: '#F8FAFC', p: { xs: 2, md: 5 }, pt: { xs: 4, md: 10 } }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 800, mb: 1, textAlign: 'center' }}>
          Create New Member
        </Typography>
       

        <Card sx={{ borderRadius: '24px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', backdropFilter: 'blur(10px)' }}>
          <CardContent sx={{ p: { xs: 2, md: 5 } }}>
            {/* Joining Details Section */}
            <Typography variant="h6" sx={{ color: '#0284C7', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#64748B' }} /></InputAdornment>,
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
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#64748B' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />
            </Box>

            {/* New Member Details Section */}
            <Typography variant="h6" sx={{ color: '#0284C7', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#0284C7' }} /></InputAdornment>,
                }}
                sx={textFieldStyles}
              />

              <FormControl error={!!genderError} sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <FormLabel sx={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 1, mb: 1, '&.Mui-focused': { color: '#0284C7' } }}>
                  <WcIcon sx={{ color: '#0284C7' }} />
                  Gender
                </FormLabel>
                <RadioGroup row name="gender" value={formData.gender || ''} onChange={handleRadioChange}>
                  <FormControlLabel value="Male" control={<Radio sx={{ color: '#475569', '&.Mui-checked': { color: '#0284C7' } }} />} label={<Typography sx={{ color: '#0F172A' }}>Male</Typography>} />
                  <FormControlLabel value="Female" control={<Radio sx={{ color: '#475569', '&.Mui-checked': { color: '#0284C7' } }} />} label={<Typography sx={{ color: '#0F172A' }}>Female</Typography>} />
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
                  startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#0284C7' }} /></InputAdornment>,
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
                  startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#0284C7' }} /></InputAdornment>,
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
                  startAdornment: <InputAdornment position="start"><PublicIcon sx={{ color: '#0284C7' }} /></InputAdornment>,
                }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value) {
                      return <span style={{ color: '#64748B' }}>Enter country</span>;
                    }
                    return value;
                  }
                }}
                sx={{
                  ...textFieldStyles,
                  "& .MuiSelect-icon": { color: '#475569' }
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
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#0284C7' }} /></InputAdornment>,
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
                  color: '#FFFFFF',
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
                    background: '#E2E8F0',
                    color: '#64748B',
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
              bgcolor: '#F1F5F9',
              color: '#0F172A',
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
            {/* <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: '#475569' }}>
              New member has been successfully added to your network.
            </Typography> */}
            <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#475569' }}>Member ID</Typography>
                <Typography variant="h6" sx={{ color: '#0284C7', fontWeight: 700 }}>{registrationData.memberId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#475569' }}>Password</Typography>
                <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{registrationData.password}</Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 3, color: '#475569', textAlign: 'center' }}>
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
                background: '#E2E8F0',
                color: '#0F172A',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: '#E2E8F0',
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
