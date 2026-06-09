import React, { useState, useContext, useEffect } from "react";
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
  CircularProgress
} from "@mui/material";
import UserContext from "../../../context/user/userContext";
import { useGetWalletOverview } from "../../../api/Memeber";
import { useBuyPackageDirectlyMutation } from "../../../api/Packages";
import { toast } from "react-toastify";
import { get } from "../../../api/Api";

const NewSubscription: React.FC = () => {
  const { user } = useContext(UserContext);
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || '');
  const { mutate: buyPackage, isPending: isSubmitting } = useBuyPackageDirectlyMutation();

  const [formData, setFormData] = useState({
    targetMemberId: user?.Member_id || "",
    package: "",
    investAmount: "",
  });

  const [targetName, setTargetName] = useState(user?.Name || "");
  const [isSearching, setIsSearching] = useState(false);

  // Sync formData.targetMemberId when user context loads
  useEffect(() => {
    if (user?.Member_id && !formData.targetMemberId) {
      setFormData(prev => ({ ...prev, targetMemberId: user.Member_id }));
      setTargetName(user.Name);
    }
  }, [user]);

  useEffect(() => {
    if (!formData.targetMemberId) {
      setTargetName("");
      return;
    }
    
    if (formData.targetMemberId === user?.Member_id) {
      setTargetName(user?.Name || "");
      return;
    }

    const fetchName = async () => {
      setIsSearching(true);
      try {
        const res = await get(`/auth/get-sponsor/${formData.targetMemberId}`);
        if (res && res.success) {
          setTargetName(res.name || "Name not available");
        } else {
          setTargetName("Member Not Found");
        }
      } catch (e) {
        setTargetName("Member Not Found");
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchName, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.targetMemberId, user?.Member_id, user?.Name]);

  const handleSelectChange = (e: any) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      package: value,
      investAmount: value === 'custom' ? '' : value, // Auto-fill invest amount based on package selection
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.Member_id || !formData.investAmount) {
      toast.error("Please provide an investment amount");
      return;
    }

    if (Number(formData.investAmount) < 100) {
      toast.error("Minimum investment amount is $100");
      return;
    }

    if (targetName === "Member Not Found" || isSearching) {
      toast.error("Please provide a valid Target Member ID");
      return;
    }
    
    buyPackage({
      member_id: user.Member_id,
      target_member_id: formData.targetMemberId || user.Member_id,
      requested_amount: Number(formData.investAmount),
    }, {
      onSuccess: () => {
        setFormData(prev => ({ ...prev, package: "", investAmount: "" }));
      }
    });
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
      borderColor: '#00e676',
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
      opacity: 0.8,
    },
    '& .MuiSelect-icon': {
      color: 'rgba(255,255,255,0.7)',
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: "0 15px 35px rgba(0,0,0,0.2)", borderRadius: '28px', color: '#ffffff', alignSelf: 'flex-start' }}>
        <CardHeader 
          title="NEW SUBSCRIPTION" 
          sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff', py: 2.5, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 900, letterSpacing: '1px' }}
        />
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Target Member ID <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                name="targetMemberId"
                value={formData.targetMemberId}
                onChange={handleInputChange}
                fullWidth
                size="small"
                placeholder="Enter member ID to buy package for"
                sx={inputStyles}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Target Name</Typography>
              <TextField
                value={targetName}
                fullWidth
                size="small"
                disabled
                InputProps={{
                  endAdornment: isSearching ? <CircularProgress size={20} color="inherit" sx={{color: 'rgba(255,255,255,0.5)'}} /> : null
                }}
                sx={{ 
                  ...inputStyles, 
                  bgcolor: targetName === 'Member Not Found' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: targetName === 'Member Not Found' ? '#ef4444' : '#ffffff',
                    WebkitTextFillColor: targetName === 'Member Not Found' ? '#ef4444' : '#ffffff',
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Your Top-Up Balance</Typography>
              <TextField
                value={`$${Number(walletOverview?.topUpBalance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                fullWidth
                size="small"
                disabled
                sx={{ ...inputStyles, opacity: 0.8 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Package <span style={{color: '#ef4444'}}>*</span></Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="package"
                  value={formData.package}
                  onChange={handleSelectChange}
                  sx={inputStyles}
                  displayEmpty
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
                  <MenuItem value="" disabled>Select Package</MenuItem>
                  <MenuItem value="custom">Enter Custom Amount</MenuItem>
                  <MenuItem value="100">$100 Package</MenuItem>
                  <MenuItem value="250">$250 Package</MenuItem>
                  <MenuItem value="500">$500 Package</MenuItem>
                  <MenuItem value="1000">$1000 Package</MenuItem>
                  <MenuItem value="2000">$2000 Package</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Invest Amount <span style={{color: '#ef4444'}}>*</span></Typography>
              <TextField
                name="investAmount"
                type="text"
                value={formData.investAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    handleInputChange(e);
                  }
                }}
                fullWidth
                size="small"
                required
                disabled={formData.package !== 'custom'} // Only editable if custom is selected
                InputProps={{
                  startAdornment: <Typography sx={{color: '#00e676', mr: 1, fontWeight: 800}}>$</Typography>,
                }}
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
              <Typography sx={{ width: '150px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>Topup Date</Typography>
              <TextField
                value={new Date().toLocaleDateString('en-GB')}
                fullWidth
                size="small"
                disabled
                sx={{ ...inputStyles, opacity: 0.8 }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifySelf: 'center', mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || targetName === "Member Not Found" || isSearching}
                sx={{
                  bgcolor: '#00e676',
                  color: '#050916',
                  px: 5,
                  py: 1.2,
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '999px',
                  boxShadow: '0 4px 14px rgba(0, 230, 118, 0.4)',
                  width: { xs: '100%', sm: 'auto' },
                  "&:hover": { 
                    bgcolor: '#00c853',
                    boxShadow: '0 6px 20px rgba(0, 230, 118, 0.6)'
                  },
                  "&:disabled": {
                    bgcolor: 'rgba(0, 230, 118, 0.3)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                {isSubmitting ? "Processing..." : "Buy Package"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewSubscription;
