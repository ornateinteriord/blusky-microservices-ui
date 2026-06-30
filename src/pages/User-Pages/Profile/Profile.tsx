import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Avatar, Card, CardContent, CardHeader } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import UserContext from "../../../context/user/userContext";
import { useUpdateMember } from '../../../api/Memeber';
import { LoadingComponent } from '../../../App';


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
    bgcolor: 'rgba(20, 24, 33, 0.8)',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFD700',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      padding: '14px 18px',
      fontSize: '1.05rem',
      fontWeight: 500,
      letterSpacing: '0.5px'
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
            
            {/* Top Banner - Photo, Name, ID */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: 'center',
              justifyContent: 'flex-start',
              bgcolor: 'rgba(0, 0, 0, 0.25)',
              p: { xs: 3, md: 4 },
              borderRadius: '20px',
              border: '1px solid rgba(255, 215, 0, 0.15)',
              mb: 5,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.2)',
              gap: { xs: 3, sm: 4 }
            }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ 
                    width: 90, 
                    height: 90, 
                    border: '2px solid rgba(255, 215, 0, 0.6)', 
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    fontSize: '2.5rem'
                  }}>
                    {formData.Name ? formData.Name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 50 }} />}
                  </Avatar>
                </Box>
                
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', display: 'block', lineHeight: 1.2, mb: 0.5 }}>
                    Profile
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: '1px', lineHeight: 1.2, mb: 1.5 }}>
                    {formData.Name || 'RAM'}
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, fontWeight: 'medium' }}>ID:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700', letterSpacing: '1.5px', lineHeight: 1 }}>
                      {user?.member_code || user?.Member_id || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
            </Box>

            {/* Form Fields Section */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3.5,
              mb: 5
            }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#FFD700', fontWeight: 600, ml: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>Date of Birth</Typography>
                <TextField
                  name="dob"
                  type="text"
                  value={formData.dob}
                  onChange={handleInputChange}
                  fullWidth
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#FFD700', fontWeight: 600, ml: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>Email Id</Typography>
                <TextField
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  sx={inputStyles}
                />
              </Box>

              <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#FFD700', fontWeight: 600, ml: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>Country</Typography>
                <TextField
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  fullWidth
                  sx={inputStyles}
                />
              </Box>
            </Box>

            {/* Bottom Row - USDT Address */}
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(0, 0, 0, 0.15)', 
              borderRadius: '20px', 
              border: '1px solid rgba(255, 215, 0, 0.15)',
              mb: 5,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative accent */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', bgcolor: '#FFD700' }} />
              
              <Typography variant="body2" sx={{ mb: 1.5, color: '#FFD700', fontWeight: 'bold', letterSpacing: '1px', ml: 1 }}>USDT - BEP20 Address</Typography>
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
