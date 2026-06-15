// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress, IconButton, Paper, Button, Stack,  } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';



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
import SyncAltIcon from '@mui/icons-material/SyncAlt';

import TokenService from '../../../api/token/tokenService';
import { useVerifyPayment, parsePaymentRedirectParams, useGetTransactionDetails, useGetWalletOverview, useGetMemberDetails, useGetDailyPayout } from '../../../api/Memeber';
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
        { label: "Profile", icon: <AccountCircleIcon />, route: "/user/account/profile", color: "#FFD700" },
        // { label: "KYC", icon: <VerifiedUserIcon />, route: "/user/account/kyc", color: "#10b981" },
        { label: "Password", icon: <LockIcon />, route: "/user/account/change-password", color: "#f59e0b" },
        { label: "Transfer", icon: <SyncAltIcon />, route: "/user/transfer", color: "#10b981" },
        { label: "New Subscription", icon: <InventoryIcon />, onClick: () => navigate("/user/new-subscription"), route: "", color: "#10b981" },
        { label: "My Subscription", icon: <ReceiptLongIcon />, onClick: () => navigate("/user/my-subscriptions"), route: "", color: "#f59e0b" },
      ]
    },
    {
      title: "BENEFITS",
      items: [
        // { label: "ROI Benefits", icon: <ShowChartIcon />, route: "/user/earnings/roi-benefits", color: "#10b981" },
        // { label: "Referral Bonus", icon: <PaymentsIcon />, route: "/user/earnings/referral-bonus", color: "#f59e0b" },
        // { label: "Daily ROI", icon: <TrendingUpIcon />, route: "/user/earnings/daily-payout", color: "#ef4444" },
        // { label: "Level Bonus", icon: <AccountTreeIcon />, route: "/user/earnings/level-benefits", color: "#FFD700" },
        { label: "Transactions", icon: <AttachMoneyIcon />, route: "/user/transactions", color: "#FFD700" },
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

      {/* Auto calculation block */}
      <Box sx={{ 
        bgcolor: 'rgba(255,255,255,0.04)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '16px', 
        p: { xs: 2, md: 3 }, 
        mb: 3, 
        mt: 1,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto 24px auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 900, mb: 0.5 }}>USDT - 1$</Typography>
          <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '1px' }}>INDIA INR - 95.00</Typography>
        </Box>
        <Box sx={{ 
          width: '56px', 
          height: '40px', 
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fff'
        }}>
          <img src="https://flagcdn.com/w80/in.png" alt="India Flag" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      </Box>

      {/* <SliderSection /> */}
      <ProductsContainer />
      {/* <NewSliderSection /> */}


      {/* Earnings, Upgrade & Top Up Wallets */}
      {/* Load Fund Button & 3 Wallet Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/user/load-fund')}
          sx={{
            background: 'linear-gradient(45deg, #FFD700 30%, #FFDF00 90%)',
            color: '#050916',
            borderRadius: '999px',
            px: { xs: 5, md: 8 },
            py: { xs: 1.2, md: 1.5 },
            fontWeight: 900,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: { xs: '0.9rem', md: '1rem' },
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #e6c200 30%, #FFD700 90%)',
              boxShadow: '0 12px 30px rgba(255, 215, 0, 0.5)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Load Fund
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: { xs: 1, sm: 2 }, 
        mb: 4, 
        px: { xs: 0.5, md: 0 },
        width: '100%'
      }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, p: { xs: 1.5, sm: 2.5 }, borderRadius: { xs: '16px', sm: '24px' }, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <AccountBalanceWalletIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: { xs: '0.65rem', sm: '0.75rem' }, lineHeight: 1.2 }}>Top Up wlt</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>${Number(walletOverview?.topUpBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>
        <Box onClick={() => navigate('/user/upgrade-wallet')} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', p: { xs: 1.5, sm: 2.5 }, borderRadius: { xs: '16px', sm: '24px' }, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
          <AccountBalanceWalletIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: { xs: '0.65rem', sm: '0.75rem' }, lineHeight: 1.2 }}>Upgrade wlt</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>${Number(walletOverview?.upgradeWalletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>
        <Box onClick={() => navigate('/user/wallet')} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', p: { xs: 1.5, sm: 2.5 }, borderRadius: { xs: '16px', sm: '24px' }, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
          <AccountBalanceWalletIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: { xs: '0.65rem', sm: '0.75rem' }, lineHeight: 1.2 }}>Earnings wlt</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>${Number(walletOverview?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>
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
          {/* <Box
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
            <img src="/cb.png" alt="USDT Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box> */}


          {/* Team Performance - In Left Column on Desktop */}
          <Box sx={{ mt: 6, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 3 }}>TEAM PERFORMANCE</Typography>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', bgcolor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box 
                  onClick={() => navigate('/user/team')}
                  sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <GroupsIcon sx={{ fontSize: 36, color: '#FFD700', mb: 1 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>My Team</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', mt: 1 }}>{Math.max(memberDetails?.registration_stats?.total || 0, memberDetails?.total_team || 0)}</Typography>
                </Box>
                <Box 
                  onClick={() => navigate('/user/team/direct')}
                  sx={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <PersonAddAltIcon sx={{ fontSize: 36, color: '#6366f1', mb: 1 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>My Directs</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ffffff', mt: 1 }}>{Math.max(memberDetails?.registration_stats?.direct || 0, memberDetails?.direct_referrals?.length || 0)}</Typography>
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

            {/* Team Performance - Mobile Only inside Quick Access */}
            <Box sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ffffff', mb: 2 }}>TEAM PERFORMANCE</Typography>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box 
                    onClick={() => navigate('/user/team')}
                    sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <GroupsIcon sx={{ fontSize: 32, color: '#FFD700', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>My Team</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>{Math.max(memberDetails?.registration_stats?.total || 0, memberDetails?.total_team || 0)}</Typography>
                  </Box>
                  <Box 
                    onClick={() => navigate('/user/team/direct')}
                    sx={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', '&:hover': { opacity: 0.8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <PersonAddAltIcon sx={{ fontSize: 32, color: '#6366f1', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>My Directs</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>{Math.max(memberDetails?.registration_stats?.direct || 0, memberDetails?.direct_referrals?.length || 0)}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', xl: '420px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={0} sx={{
              p: 4,
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #FFD700 100%)',
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


            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', mt: 1 }}>
              <Stack spacing={4}>
                {/* 1st Section: Replaced with grid of icons */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>

                  <Box onClick={() => navigate('/user/earnings/referral-bonus')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <PaymentsIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Referral Bonus</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.directBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box onClick={() => navigate('/user/earnings/single-level-income-history')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Single Level Income</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.singleLineIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box onClick={() => navigate('/user/earnings/level-benefits')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <AccountTreeIcon sx={{ fontSize: 32, color: '#FFD700' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Level Bonus</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.levelBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>

                  <Box onClick={() => navigate('/user/transactions?type=Withdrawal')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', p: 2, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <AttachMoneyIcon sx={{ fontSize: 32, color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center' }}>Total Withdrawal</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.totalWithdrawal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
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
