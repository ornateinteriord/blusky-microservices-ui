import React, { useState, useContext } from "react";
import { Box, Typography, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserContext from "../../../context/user/userContext";
import { useGetWalletOverview } from '../../../api/Memeber';
import { useBuyPackageDirectlyMutation } from '../../../api/Packages';
import { toast } from 'react-toastify';
import { useGetMemberAddOns } from '../../../api/Packages';
import USDTLogo from "../../../assets/USDT1.png";

const PACKAGES = [
  { id: 1, amount: 30, title: "Basic", yield: "3.3%", days: "210 Day", tag: "Members Only", color: "#1de9b6" },
  { id: 2, amount: 60, title: "Bronze", yield: "3.3%", days: "210 Day", tag: "Members Only", color: "#CD7F32" },
  { id: 3, amount: 120, title: "Silver", yield: "3.3%", days: "210 Day", tag: "Members Only", color: "#C0C0C0" },
  { id: 4, amount: 250, title: "Gold", yield: "3.3%", days: "210 Day", tag: "Members Only", color: "#FFD700" },
  { id: 5, amount: 500, title: "Platinum", yield: "3.3%", days: "210 Day", tag: "Members Only", color: "#E5E4E2" },
  { id: 6, amount: 1000, title: "Diamond", yield: "3.3%", days: "210 Day", tag: "Members Only", color: "#b9f2ff" }
];

const ProductsContainer: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || '');
  const { mutate: buyPackage, isPending } = useBuyPackageDirectlyMutation();

  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [confirmPkg, setConfirmPkg] = useState<any>(null);
  const { data: memberAddons } = useGetMemberAddOns(user?.Member_id || '');
  const topUpBalance = walletOverview?.topUpBalance || 0;

  const hasAnyPackagePurchased = React.useMemo(() => {
    if (walletOverview?.primaryPackage) return true;
    if (user?.package_value) return true;
    if (memberAddons && memberAddons.length > 0) return true;
    return false;
  }, [walletOverview, user, memberAddons]);

  const isPurchased = (pkgAmount: number) => {
    // Check primary package
    if (walletOverview?.primaryPackage === pkgAmount) return true;
    if (user?.package_value === pkgAmount) return true;
    
    // Check addon packages
    if (memberAddons && memberAddons.length > 0) {
      if (memberAddons.some((addon: any) => addon.amount === pkgAmount)) return true;
    }
    
    return false;
  };

  const handleBuyClick = (pkg: any) => {
    const amountToBuy = pkg.amount;
    if (topUpBalance < amountToBuy) {
      toast.error(`Insufficient Top Up Balance! You need $${amountToBuy} but have $${topUpBalance}`);
      return;
    }
    setConfirmPkg({ ...pkg, amount: amountToBuy });
  };

  const handleCardClick = (pkgAmount: number) => {
    if (isPurchased(pkgAmount)) {
      navigate(`/user/earnings/package-detail?package=${pkgAmount}`);
    }
  };

  const executeBuy = () => {
    if (!confirmPkg || !user?.Member_id) return;

    setBuyingId(confirmPkg.id);
    buyPackage(
      { member_id: user.Member_id, requested_amount: confirmPkg.amount },
      {
        onSettled: () => {
          setBuyingId(null);
          setConfirmPkg(null);
        }
      }
    );
  };

  return (
    <Box sx={{ mt: 4, width: '100%' }}>


      {/* Packages Container */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          gap: 3,
          pb: 2,
          px: 1,
          '&::-webkit-scrollbar': { height: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' },
          justifyContent: 'flex-start'
        }}
      >
        {PACKAGES.map((pkg) => (
          <Card 
            key={pkg.id}
            onClick={() => handleCardClick(pkg.amount)}
            sx={{ 
              minWidth: { xs: '260px', sm: '290px' },
              maxWidth: { xs: '260px', sm: '290px' },
              flexShrink: 0,
              bgcolor: '#1c1f2e', 
              border: '1px solid rgba(255,255,255,0.8)', 
              borderRadius: '16px', 
              color: '#ffffff',
              boxShadow: 'none',
              cursor: isPurchased(pkg.amount) ? 'pointer' : 'default',
              transition: 'transform 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }
            }}
          >
            {/* Clean Logo on the right side */}
            <Box sx={{
              position: 'absolute',
              top: '36px',
              right: '16px',
              width: '100px',
              height: '100px',
              opacity: 1,
              zIndex: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <img src={USDTLogo} alt="USDT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>

            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, position: 'relative', zIndex: 1 }}>
              <Typography variant="h5" fontWeight={900} sx={{ fontSize: '1.4rem', color: pkg.color, mb: 1, lineHeight: 1.3, height: '48px', display: 'flex', alignItems: 'center', gap: 0 }}>
                <Box sx={{
                  width: 38,
                  height: 38,
                  backgroundColor: pkg.color,
                  WebkitMaskImage: `url(${USDTLogo})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url(${USDTLogo})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }} />
                {pkg.title}
              </Typography>
              
              <Typography variant="h5" fontWeight={800} sx={{ color: '#FFD700', mb: 1, height: '36px', display: 'flex', alignItems: 'center' }}>
                ${pkg.amount}
              </Typography>
              
              {pkg.tag ? (
                <Chip 
                  label={pkg.tag} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    mb: 3,
                    borderRadius: '12px',
                    height: '24px'
                  }} 
                />
              ) : (
                <Box sx={{ height: '24px', mb: 3 }} />
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  {!isPurchased(pkg.amount) ? (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.5 }}>{pkg.yield}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.65rem' }}>Yield</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: '0.85rem', mb: 0.2 }}>Single Level Income</Typography>
                      <Typography variant="h5" fontWeight={900} sx={{ lineHeight: 1.2, color: '#FFD700' }}>
                        ${(walletOverview?.singleLevelIncomeByPackage?.[pkg.amount] || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {isPurchased(pkg.amount) ? (
                  <Chip 
                    label="Purchased" 
                    sx={{ 
                      bgcolor: 'rgba(59, 130, 246, 0.2)', 
                      color: '#FFD700',
                      fontWeight: 700,
                      borderRadius: '24px',
                      height: '24px',
                      fontSize: '0.65rem',
                      px: 0.5
                    }} 
                  />
                ) : (
                  <Button
                  variant="contained"
                  onClick={() => handleBuyClick(pkg)}
                  disabled={isPending || hasAnyPackagePurchased}
                  sx={{
                    bgcolor: '#FFD700',
                    color: '#000000',
                    fontWeight: 800,
                    textTransform: 'none',
                    borderRadius: '24px',
                    minWidth: '64px',
                    px: 3,
                    py: 0.8,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#e6c200',
                      boxShadow: 'none'
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(0, 230, 118, 0.3)',
                      color: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {isPending && buyingId === pkg.id ? <CircularProgress size={16} color="inherit" /> : "Buy"}
                </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog 
        open={!!confirmPkg} 
        onClose={() => !isPending && setConfirmPkg(null)}
        PaperProps={{
          sx: {
            bgcolor: '#1c1f2e',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Purchase</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Are you sure you want to buy <strong>{confirmPkg?.title}</strong> for <strong>${confirmPkg?.amount}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setConfirmPkg(null)} 
            disabled={isPending}
            sx={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={executeBuy} 
            variant="contained" 
            disabled={isPending}
            sx={{
              bgcolor: '#FFD700',
              color: '#000',
              fontWeight: 700,
              '&:hover': { bgcolor: '#e6c200' },
              '&:disabled': { bgcolor: 'rgba(0, 230, 118, 0.3)' }
            }}
          >
            {isPending ? <CircularProgress size={24} color="inherit" /> : "Yes, Buy Plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsContainer;
