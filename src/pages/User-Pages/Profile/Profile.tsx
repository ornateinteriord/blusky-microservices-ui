import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControl,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import UserContext from "../../../context/user/userContext";
import { useUpdateMember } from "../../../api/Memeber";
import { LoadingComponent } from "../../../App";

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

  const handleSelectChange = (e: any) => {
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
    color: '#ffffff',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.1)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFD700',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
    },
    '& .MuiSelect-icon': {
      color: 'rgba(255,255,255,0.7)',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: "0 15px 35px rgba(0,0,0,0.2)", borderRadius: '28px', color: '#ffffff' }}>
        <CardHeader 
          title="MEMBER PROFILE" 
          sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff', py: 2.5, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 900, letterSpacing: '1px' }}
        />
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Name <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                fullWidth
                size="small"
                required
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Date of Birth</Typography>
              <TextField
                name="dob"
                type="date"
                value={formData.dob ? formData.dob.split('T')[0] : ''}
                onChange={handleInputChange}
                fullWidth
                size="small"
                sx={{
                  ...inputStyles,
                  '& ::-webkit-calendar-picker-indicator': { filter: 'invert(1)' }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Email Id <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                size="small"
                required
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Gender</Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  sx={inputStyles}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#0f1e36',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }
                    }
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Country</Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleSelectChange}
                  sx={inputStyles}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#0f1e36',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }
                    }
                  }}
                >
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="United States">United States</MenuItem>
                  <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>USDT-BEP20 Address</Typography>
              <TextField
                name="usdt_bep20_address"
                value={formData.usdt_bep20_address}
                onChange={handleInputChange}
                fullWidth
                size="small"
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', justifySelf: 'center', mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={updateMember.isPending}
                sx={{
                  bgcolor: '#FFD700',
                  color: '#050916',
                  px: 5,
                  py: 1.2,
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '999px',
                  boxShadow: '0 4px 14px rgba(0, 230, 118, 0.4)',
                  width: { xs: '100%', sm: 'auto' },
                  "&:hover": { 
                    bgcolor: '#e6c200',
                    boxShadow: '0 6px 20px rgba(0, 230, 118, 0.6)'
                  },
                  "&:disabled": {
                    bgcolor: 'rgba(0, 230, 118, 0.3)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                Submit (F2)
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

