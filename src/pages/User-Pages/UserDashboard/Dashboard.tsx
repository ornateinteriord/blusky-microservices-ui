// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import slider1 from '../../../assets/slider/slider1.png';
import slider2 from '../../../assets/slider/slider2.png';
import slider3 from '../../../assets/slider/slider3.png';
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockIcon from '@mui/icons-material/Lock';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import TokenService from '../../../api/token/tokenService';
import {
  useVerifyPayment,
  parsePaymentRedirectParams,
  useGetTransactionDetails,
  useGetWalletOverview,
  useGetMemberDetails,
  useGetDailyPayout
} from '../../../api/Memeber';
import { toast } from 'react-toastify';
import ProductsContainer from './ProductsContainer';


const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);
  const { data: memberDetails, refetch: refetchMemberDetails } = useGetMemberDetails(memberId);
  const { mutate: verifyPayment, isPending: isVerifyingPayment } = useVerifyPayment();
  const { refetch: refetchTransactions } = useGetTransactionDetails("all");
  useGetDailyPayout(memberId);

  const totalPrincipal = Number(walletOverview?.totalPackages || 0);


  // The user wants to see the exact purchased amount, not visually decreasing.
  const displayDeposit = totalPrincipal;


  const bannerImages = [slider1, slider2, slider3];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  useEffect(() => {
    const paymentParams = parsePaymentRedirectParams(searchParams);
    if (paymentParams.order_id && paymentParams.payment_status && !paymentProcessed) {
      setPaymentProcessed(true);
      verifyPayment(paymentParams.order_id, {
        onSuccess: () => {
          setSearchParams({});
          refetchTransactions();
          refetchMemberDetails();
        },
        onError: () => setSearchParams({})
      });
    }
  }, [searchParams, paymentProcessed, verifyPayment, setSearchParams, refetchTransactions, refetchMemberDetails]);

  const handleCopyReferralLink = () => {
    if (!memberDetails?.Member_id) return;
    const referralLink = `${window.location.origin}/register?ref=${memberDetails.Member_id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };


  const quickAccessGroups = [
    {
      title: "ACCOUNT",
      items: [
        { label: "Profile", icon: <AccountCircleIcon />, route: "/user/account/profile", color: "#3b82f6" },
        // { label: "KYC", icon: <VerifiedUserIcon />, route: "/user/account/kyc", color: "#10b981" },
        { label: "Password", icon: <LockIcon />, route: "/user/account/change-password", color: "#f59e0b" },
        // { label: "Load Fund", icon: <InventoryIcon />, onClick: () => navigate("/user/load-fund"), route: "", color: "#3b82f6" },
        { label: "New Subscription", icon: <InventoryIcon />, onClick: () => navigate("/user/new-subscription"), route: "", color: "#10b981" },
        // { label: "My Subscription", icon: <ReceiptLongIcon />, onClick: () => navigate("/user/my-subscriptions"), route: "", color: "#f59e0b" },
      ]
    },
    {
      title: "BENEFITS",
      items: [
        // { label: "ROI Benefits", icon: <ShowChartIcon />, route: "/user/earnings/roi-benefits", color: "#10b981" },
        // { label: "Referral Bonus", icon: <PaymentsIcon />, route: "/user/earnings/referral-bonus", color: "#f59e0b" },
        // { label: "Daily ROI", icon: <TrendingUpIcon />, route: "/user/earnings/daily-payout", color: "#ef4444" },
        // { label: "Level Bonus", icon: <AccountTreeIcon />, route: "/user/earnings/level-benefits", color: "#3b82f6" },
        { label: "Transactions", icon: <AttachMoneyIcon />, route: "/user/transactions", color: "#3b82f6" },
      ]
    },
    {
      title: "TEAM & TOOLS",
      items: [
        // { label: "Tree View", icon: <HubIcon />, route: "/user/team/tree", color: "#ef4444" },
        { label: "New Regi.", icon: <PersonAddAltIcon />, route: "/user/team/new-register", color: "#10b981" },
      ]
    }
  ];

  const SliderSection = () => (
    <Box sx={{ 
      mb: 4, 
      borderRadius: '28px', 
      overflow: 'hidden', 
      position: 'relative', 
      boxShadow: '0 25px 55px rgba(0,0,0,0.35)',
      height: { xs: '180px', sm: '220px', md: '280px' }
    }}>
      {bannerImages.map((src, index) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={`Promotion banner ${index + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: index === activeSlide ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === activeSlide ? 1 : 0,
          }}
        />
      ))}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,8,20,0.05) 0%, rgba(2,8,20,0.5) 100%)', zIndex: 2 }} />
      <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1.5, zIndex: 3 }}>
        {bannerImages.map((_, dot) => (
          <Box
            key={dot}
            onClick={() => setActiveSlide(dot)}
            sx={{
              width: dot === activeSlide ? 24 : 8,
              height: 8,
              borderRadius: '999px',
              bgcolor: 'white',
              opacity: dot === activeSlide ? 1 : 0.45,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </Box>
    </Box>
  );



  return (
    <Box sx={{
      pb: 6,
      background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)',
      minHeight: '100vh',
      px: { xs: 2.5, md: 5, lg: 10, xl: 16 },
      pt: { xs: 1.5, md: 4 },
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {isVerifyingPayment && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>Verifying payment...</Typography>
        </Box>
      )}

      <SliderSection />

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 4,
        mt: 1,
        flexWrap: 'nowrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
            Your Top Up Balance
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.5rem' }, color: '#ffffff', lineHeight: 1.1 }}>
            ${Number(walletOverview?.topUpBalance || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/user/load-fund')}
          sx={{
            bgcolor: '#00e676', // Vibrant neon green from screenshot
            color: '#050916',   // Dark text matching main dark theme
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: '999px',
            px: { xs: 3.5, md: 5 },
            py: { xs: 1.25, md: 1.5 },
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            boxShadow: '0 4px 14px rgba(0, 230, 118, 0.4)',
            minWidth: 'auto',
            flexShrink: 0,
            '&:hover': { 
              bgcolor: '#00c853',
              boxShadow: '0 6px 20px rgba(0, 230, 118, 0.6)',
            }
          }}
        >
          Load Fund
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 4, md: 5 },
        alignItems: 'flex-start'
      }}>
        {/* Left Column (Main/Services) */}
        <Box sx={{
          flex: 1,
          width: '100%',
          display: { xs: 'none', md: 'block' }
        }}>
          {/* CB Banner - Desktop only (mobile version is inside the header) */}
          <Box
            onClick={() => navigate('/user/chat')}
            sx={{
              display: { xs: 'none', md: 'block' },
              width: '100%',
              height: '160px',
              mb: 4,
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(23, 16, 16, 0.12)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 45px rgba(0,0,0,0.18)' },

            }}
          >
            <img src="/cb.png" alt="BMS Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>


          {/* Team Performance - In Left Column on Desktop */}
          <Box sx={{ mt: 6, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 3 }}>TEAM PERFORMANCE</Typography>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box 
                  onClick={() => navigate('/user/team')}
                  sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <GroupsIcon sx={{ fontSize: 36, color: '#3b82f6', mb: 1 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>My Team</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', mt: 1 }}>{memberDetails?.total_team || 0}</Typography>
                </Box>
                <Box 
                  onClick={() => navigate('/user/team/direct')}
                  sx={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <PersonAddAltIcon sx={{ fontSize: 36, color: '#6366f1', mb: 1 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>My Directs</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', mt: 1 }}>{memberDetails?.direct_referrals?.length || 0}</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        {/* Right Column / Mobile Conditional View */}
        <Box sx={{
          width: { xs: '100%', md: '380px', lg: '440px' },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          position: { md: 'sticky' },
          top: { md: '80px' }
        }}>
          {/* Mobile Only: Quick Access Header */}

          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                {quickAccessGroups.flatMap(group => group.items).map((item: any, i: number) => (
                  <Box key={i} onClick={() => item.onClick ? item.onClick() : navigate(item.route)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      bgcolor: 'rgba(255, 255, 255, 0.06)',
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      '&:hover': { transform: 'scale(1.1)', bgcolor: 'rgba(255, 255, 255, 0.12)' },
                      transition: '0.2s'
                    }}>
                      {item.icon}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', textAlign: 'center', color: '#ffffff' }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <ProductsContainer />

            {/* Team Performance - Mobile Only inside Quick Access */}
            <Box sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ffffff', mb: 2 }}>TEAM PERFORMANCE</Typography>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box 
                    onClick={() => navigate('/user/team')}
                    sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <GroupsIcon sx={{ fontSize: 32, color: '#3b82f6', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>My Team</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>{memberDetails?.total_team || 0}</Typography>
                  </Box>
                  <Box 
                    onClick={() => navigate('/user/team/direct')}
                    sx={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <PersonAddAltIcon sx={{ fontSize: 32, color: '#6366f1', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>My Directs</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>{memberDetails?.direct_referrals?.length || 0}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', xl: '420px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={0} sx={{
              p: 4,
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: 'white',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.25)'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>Referral link</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  fullWidth
                  sx={{
                    bgcolor: 'white',
                    color: '#1e3a8a',
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontWeight: 900,
                    py: 1.5
                  }}
                >
                  Share Now
                </Button>
                <IconButton
                  onClick={handleCopyReferralLink}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '16px',
                    width: 56,
                    height: 56
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Paper>

            {/* Wallet Section - Matched to 3rd Drawing */}
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', mb: -2, mt: { xs: 2, md: 3 } }}>
              DEPOSIT DETAILS
            </Typography>

            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', mt: 1 }}>
              <Stack spacing={4}>
                {/* 1st Section: Replaced with grid of icons */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box onClick={() => navigate('/user/my-subscriptions')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <ReceiptLongIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>My Subscription</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${displayDeposit.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Typography>
                  </Box>
                  <Box onClick={() => navigate('/user/earnings/referral-bonus')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <PaymentsIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Referral Bonus</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.directBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'default', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Single Level Income</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.singleLineIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box onClick={() => navigate('/user/earnings/level-benefits')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <AccountTreeIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Level Bonus</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.levelBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box onClick={() => navigate('/user/wallet')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#00e676' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Earnings Wallet</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box onClick={() => navigate('/user/upgrade-wallet')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Upgrade Wallet</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.upgradeWalletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', gridColumn: 'span 2' }}>
                    <AttachMoneyIcon sx={{ fontSize: 32, color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Total Withdrawal</Typography>
                    <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 900 }}>${Number(walletOverview?.totalWithdrawal || 0).toLocaleString('en-US')}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
