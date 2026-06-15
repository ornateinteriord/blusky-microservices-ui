import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Avatar, Card, CardContent, CardHeader } from '@mui/material';
import UserContext from "../../../context/user/userContext";
import { useUpdateMember } from '../../../api/Memeber';
import { LoadingComponent } from '../../../App';
import uwtLogo from '../../../assets/USDT1.png';

const Profile: React.FC = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    Name: "",
    gender: "",
    email: "",
    country: "",
    usdt_bep20_address: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name ?? "",
        gender: user.gender ?? "Male",
        email: user.email ?? "",
        country: user.country ?? "India",
        usdt_bep20_address: user.usdt_bep20_address ?? "",
        dob: user.dob ?? "",
      });
    }
  }, [user]);

  const updateMember = useUpdateMember();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMember.mutate(formData);
  };

  const inputStyles = {
    bgcolor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFD700',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
      padding: '10px 14px',
    },
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
      
      <Card sx={{ 
        width: '100%', 
        maxWidth: 800, 
        bgcolor: 'rgba(255, 255, 255, 0.04)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '24px', 
        color: '#ffffff',
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        
        <CardHeader 
          title={
            <Box sx={{ 
              display: 'inline-block',
              border: '2px solid rgba(255,255,255,0.5)', 
              borderRadius: '20px', 
              px: 4, 
              py: 0.5,
      
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '1px' }}>MY Profile</Typography>
            </Box>
          }
          sx={{ textAlign: 'center', pb: 0, pt: 2 }}
        />

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <form onSubmit={handleSubmit}>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              gap: { xs: 2, md: 2 },
              mb: 4 
            }}>
              
              {/* Left Column - Package Info */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center', 
                flex: 1, 
                p: { xs: 1, md: 2 }
              }}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'rgba(255,255,255,0.03)', 
                  borderRadius: '50%', 
                  mb: 1,
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.05)',
                  border: '1px solid rgba(255, 215, 0, 0.1)'
                }}>
                  <img src={uwtLogo} alt="Logo" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 2, fontSize: { xs: '1.1rem', md: '1.4rem' } }}>
                    My Top Package
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, fontWeight: 'bold' }}>ID:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFD700', letterSpacing: '1px' }}>
                      {user?.member_code || user?.Member_id || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right Column - User Info */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1.5, 
                gap: { xs: 1.5, md: 2 },
                p: { xs: 1, md: 2 }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 0.5, md: 2 } }}>
                  <Avatar sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, mb: 1.5, border: '2px solid rgba(255,255,255,0.8)', bgcolor: 'transparent' }} />
                  <Box sx={{ border: '1px solid rgba(255,255,255,0.4)', borderRadius: '6px', px: 2, py: 0.2 }}>
                    <Typography variant="caption" fontWeight="bold">Photo</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: { xs: 1, md: 2 }, fontSize: { xs: '1.2rem', md: '1.5rem' }, textAlign: 'center' }}>{formData.Name || 'RAM'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, color: 'rgba(255,255,255,0.7)', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Date of Birth</Typography>
                  <TextField
                    name="dob"
                    type="text"
                    value={formData.dob}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={inputStyles}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, color: 'rgba(255,255,255,0.7)', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Email Id</Typography>
                  <TextField
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={inputStyles}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, color: 'rgba(255,255,255,0.7)', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>Country</Typography>
                  <TextField
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={inputStyles}
                  />
                </Box>
              </Box>
            </Box>

            {/* Bottom Row - USDT Address */}
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(255,255,255,0.02)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.05)',
              mb: 4
            }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>USDT - BEP20 Address</Typography>
              <TextField
                name="usdt_bep20_address"
                value={formData.usdt_bep20_address}
                onChange={handleInputChange}
                fullWidth
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                disabled={updateMember.isPending}
                sx={{
                  bgcolor: '#FFD700',
                  color: '#050916',
                  px: 6,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '30px',
                  boxShadow: '0 4px 14px rgba(255, 215, 0, 0.3)',
                  "&:hover": { 
                    bgcolor: '#e6c200',
                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)'
                  },
                  "&:disabled": { 
                    bgcolor: 'rgba(255, 215, 0, 0.5)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                Submit
              </Button>
            </Box>

          </form>
        </CardContent>
        {updateMember.isPending && <LoadingComponent />}
      </Card>
    </Box>
  );
};

export default Profile;
