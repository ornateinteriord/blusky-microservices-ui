import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, CardHeader, InputAdornment, Box,  } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import KeyIcon from '@mui/icons-material/Key';
import { useUpdateMember } from '../../../api/Memeber';
import { toast } from 'react-toastify';
import { LoadingComponent } from '../../../App';

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateMember = useUpdateMember();

  const handleSubmit = () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    updateMember.mutate({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
  };

  const inputStyles = {
    bgcolor: '#F8FAFC',
    borderRadius: '8px',
    color: '#0F172A',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E2E8F0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E2E8F0',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      bordercolor: '#0284C7',
    },
    '& .MuiInputBase-input': {
      color: '#0F172A',
    },
    '& .MuiInputLabel-root': {
      color: '#475569',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#0284C7',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: "0 15px 35px rgba(0,0,0,0.2)", borderRadius: '28px', color: '#0F172A', mt: { xs: 4, md: 10 }, alignSelf: 'flex-start' }}>
        <CardHeader 
          title="CHANGE PASSWORD" 
          sx={{ bgcolor: '#F8FAFC', color: '#0F172A', py: 2.5, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 900, letterSpacing: '1px' }}
        />
        <CardContent sx={{ p: 4 }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your current password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon sx={{ color: '#475569' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your new password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#475569' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Confirm your new password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: '#475569' }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!formData.oldPassword || !formData.newPassword || !formData.confirmPassword || updateMember.isPending}
                sx={{
                  bgcolor: '#0284C7',
                  color: '#FFFFFF',
                  px: 5,
                  py: 1.2,
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '999px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: '#0369A1',
                    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.6)'
                  },
                  "&:disabled": {
                    bgcolor: 'rgba(2, 132, 199, 0.3)',
                    color: '#475569'
                  }
                }}
              >
                Update Password
              </Button>
            </Box>
          </form>
        </CardContent>
        {updateMember.isPending && <LoadingComponent />}
      </Card>
    </Box>
  );
};

export default ChangePassword;
