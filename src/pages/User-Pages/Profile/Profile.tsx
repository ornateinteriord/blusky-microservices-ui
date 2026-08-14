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
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name ?? "",
        gender: user.gender ?? "Male",
        email: user.email ?? "",
        country: user.country ?? "India",
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
    bgcolor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E2E8F0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#BAE6FD',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0284C7',
    },
    '& .MuiInputBase-input': {
      color: '#0F172A',
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
        bgcolor: '#FFFFFF', 
        border: '1px solid #E2E8F0', 
        borderRadius: '24px', 
        color: '#0F172A',
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        
        <CardHeader 
          title={
            <Box sx={{ 
              display: 'inline-block',
              border: '2px solid #E2E8F0', 
              borderRadius: '20px', 
              px: 4, 
              py: 0.5,
              bgcolor: '#F8FAFC'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '1px', color: '#0F172A' }}>MY Profile</Typography>
            </Box>
          }
          sx={{ textAlign: 'center', pb: 0, pt: 3 }}
        />

        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            
            {/* Top Banner - Photo, Name, ID */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: 'center',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
              p: { xs: 3, md: 4 },
              borderRadius: '20px',
              border: '1px solid #BAE6FD',
              mb: 5,
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.05)',
              gap: { xs: 3, sm: 4 }
            }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ 
                    width: 90, 
                    height: 90, 
                    border: '4px solid #FFFFFF', 
                    bgcolor: '#E0F2FE',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.15)',
                    color: '#0284C7',
                    fontSize: '2.5rem'
                  }}>
                    {formData.Name ? formData.Name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 50 }} />}
                  </Avatar>
                </Box>
                
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="overline" sx={{ color: '#64748B', letterSpacing: '2px', display: 'block', lineHeight: 1.2, mb: 0.5 }}>
                    Profile
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '1px', lineHeight: 1.2, mb: 1.5 }}>
                    {formData.Name || 'RAM'}
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#64748B', mr: 1, fontWeight: 'medium' }}>ID:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0284C7', letterSpacing: '1.5px', lineHeight: 1 }}>
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
                <Typography variant="body2" sx={{ mb: 1.5, color: '#0284C7', fontWeight: 700, ml: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Date of Birth</Typography>
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
                <Typography variant="body2" sx={{ mb: 1.5, color: '#0284C7', fontWeight: 700, ml: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Email Id</Typography>
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
                <Typography variant="body2" sx={{ mb: 1.5, color: '#0284C7', fontWeight: 700, ml: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Country</Typography>
                <TextField
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  fullWidth
                  sx={inputStyles}
                />
              </Box>
            </Box>



            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                disabled={updateMember.isPending}
                sx={{
                  bgcolor: '#0284C7',
                  color: '#FFFFFF',
                  px: 6,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '30px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                  "&:hover": { 
                    bgcolor: '#0369A1',
                    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)'
                  },
                  "&:disabled": { 
                    bgcolor: '#E2E8F0',
                    color: '#94A3B8'
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
