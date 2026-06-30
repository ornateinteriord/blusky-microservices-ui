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
  { id: 1, amount: 30, title: "Starter Pip Plan", yield: "5%", days: "210 Day", tag: "Members Only", color: "#1de9b6", description: "Begin your journey with the Starter PIP Plan and unlock new growth opportunities" },
  { id: 2, amount: 60, title: "Growth Trader Package", yield: "5%", days: "210 Day", tag: "Members Only", color: "#CD7F32", description: "The Growth Trader Package helps you explore enhanced features and expand your trading potential" },
  { id: 3, amount: 120, title: "Elite Currency Portfolio", yield: "5%", days: "210 Day", tag: "Members Only", color: "#C0C0C0", description: "Explore the Elite Currency Portfolio designed for advanced financial management and growth opportunities" },
  { id: 4, amount: 250, title: "Global FX Advantage Plan", yield: "5%", days: "210 Day", tag: "Members Only", color: "#FFD700", description: "Take your forex journey further with the Global FX Advantage Plan" },
  { id: 5, amount: 500, title: "Pro Trader Wealth Package", yield: "5%", days: "210 Day", tag: "Members Only", color: "#E5E4E2", description: "A premium package built to support smarter trading decisions and long-term growth" },
  { id: 6, amount: 1000, title: "VIP Liquidity Master Plan", yield: "5%", days: "210 Day", tag: "Members Only", color: "#b9f2ff", description: "Experience a higher level of financial flexibility with the VIP Liquidity Master Plan" }
];

const ProductsContainer: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || '');
  const { mutate: buyPackage, isPending } = useBuyPackageDirectlyMutation();

  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [confirmPkg, setConfirmPkg] = useState<any>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [purchasedPkg, setPurchasedPkg] = useState<any>(null);
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
        },
        onSuccess: () => {
          setPurchasedPkg(confirmPkg);
          setSuccessDialogOpen(true);
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
              top: '90px',
              right: '-10px',
              width: '135px',
              height: '135px',
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
              <Typography variant="h5" fontWeight={900} sx={{ fontSize: '1rem', color: pkg.color, mb: 1, lineHeight: 1.2, minHeight: '48px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', mb: 2, minHeight: '40px', lineHeight: 1.3, pr: '60px', position: 'relative', zIndex: 2 }}>
                {pkg.description}
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
                        ${(walletOverview?.singleLevelIncomeByPackage?.[pkg.amount] || 0).toFixed(4)}
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
          {confirmPkg?.description && (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, fontStyle: 'italic' }}>
              "{confirmPkg.description}"
            </Typography>
          )}
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

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#0f1e36',
            color: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4, color: '#10b981', fontWeight: 800, fontSize: '1.5rem' }}>
          Purchase Successful!
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'rgba(255,255,255,0.7)' }}>
            You have successfully subscribed to the package.
          </Typography>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Package Name</Typography>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, textAlign: 'right' }}>{purchasedPkg?.title}</Typography>
            </Box>
            {purchasedPkg?.description && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', textAlign: 'right', maxWidth: '80%' }}>
                  "{purchasedPkg.description}"
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Amount Paid</Typography>
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>${purchasedPkg?.amount}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, justifyContent: 'center' }}>
          <Button
            onClick={() => setSuccessDialogOpen(false)}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              }
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsContainer;
