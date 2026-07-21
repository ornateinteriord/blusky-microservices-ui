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
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockIcon from '@mui/icons-material/Lock';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
// import PublicIcon from '@mui/icons-material/Public';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SendIcon from '@mui/icons-material/Send';

import TokenService from '../../../api/token/tokenService';
import { useVerifyPayment, parsePaymentRedirectParams, useGetTransactionDetails, useGetWalletOverview, useGetMemberDetails, useGetDailyPayout } from '../../../api/Memeber';
import { toast } from 'react-toastify';
import ProductsContainer from './ProductsContainer';
import DashboardQRDialog from './DashboardQRDialog';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

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
    const referralLink = `₹{window.location.origin}/register?ref=₹{memberDetails.Member_id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };


  const quickAccessGroups = [
    {
      title: "ACCOUNT",
      items: [
        { label: "Profile", icon: <AccountCircleIcon />, route: "/user/account/profile", color: "#FFD700" },
        { label: "KYC", icon: <VerifiedUserIcon />, route: "/user/account/kyc", color: "#10b981" },
        { label: "Password", icon: <LockIcon />, route: "/user/account/change-password", color: "#f59e0b" },
        { label: "Transfer", icon: <SyncAltIcon />, route: "/user/transfer", color: "#10b981" },
        { label: "My QR", icon: <QrCode2Icon />, route: "/user/my-qr", color: "#1de9b6" },
        { label: "P2P Transfer", icon: <SendIcon />, route: "/user/p2p-transfer", color: "#FF6E40" },
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

      {/* User Header */}
      <Paper elevation={0} sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        mt: 1,
        p: { xs: 2, sm: 3 },
        borderRadius: '24px',
        bgcolor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        width: '100%'
      }}>
        <Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.70rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.5 }}>
            User ID
          </Typography>
          <Typography sx={{ color: 'white', fontSize: { xs: '1.1rem', sm: '1.3rem' }, fontWeight: 900 }}>
            {memberDetails?.Member_id || memberId}
          </Typography>
          <Typography sx={{ color: 'rgba(255,215,0,0.9)', fontSize: { xs: '0.85rem', sm: '1rem' }, fontWeight: 700, mt: 0.2 }}>
            {memberDetails?.Name || 'Loading...'}
          </Typography>
        </Box>
        <Button
          onClick={() => setIsQRDialogOpen(true)}
          variant="contained"
          startIcon={<QrCode2Icon />}
          sx={{
            background: 'linear-gradient(45deg, #FFD700 30%, #FFDF00 90%)',
            color: '#0D2658',
            borderRadius: '14px',
            px: { xs: 2, sm: 3 },
            py: 1.2,
            fontWeight: 800,
            textTransform: 'none',
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #e6c200 30%, #FFD700 90%)',
              boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap'
          }}
        >
          MY QR
        </Button>
      </Paper>

      {/* QR Dialog */}
      <DashboardQRDialog 
        open={isQRDialogOpen} 
        onClose={() => setIsQRDialogOpen(false)} 
        memberId={memberDetails?.Member_id || memberId || ''} 
        memberName={memberDetails?.Name || ''}
      />

      {/* <SliderSection /> */}
      <ProductsContainer />
      {/* <NewSliderSection /> */}


      {/* Earnings, Upgrade & Top Up Wallets */}
      {/* Load Fund Button & 3 Wallet Cards */}
      <Paper elevation={0} sx={{
        p: { xs: 2, md: 4 },
        mb: 4,
        borderRadius: '28px',
        bgcolor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        width: '100%'
      }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900, mb: 3, textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
          My Wallet
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5, 
          width: '100%'
        }}>
          {/* Top Up */}
          <Box onClick={() => navigate('/user/top-up-wallet')} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' }, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(0, 230, 118, 0.1)', display: 'flex', height: 'fit-content' }}>
                <PaymentsIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#00E676' }} />
              </Box>
              <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.topUpBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Top Up</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '13px' }}>Fund your wallet to unlock premium features and start growing your wealth.</Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/user/load-fund');
                  }}
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFDF00 90%)',
                    color: '#050916',
                    borderRadius: '999px',
                    px: 3.5,
                    py: 0.8,
                    fontWeight: 900,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #e6c200 30%, #FFD700 90%)',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Load
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Fixed Deposit */}
          <Box onClick={() => navigate('/user/fixed-deposit-wallet')} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' }, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255, 193, 7, 0.1)', display: 'flex', height: 'fit-content' }}>
                <AccountBalanceWalletIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFC107' }} />
              </Box>
              <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.fixedDepositBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Fixed Deposit</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '13px' }}>Your money securely saved for long-term growth—simple and always accessible.</Typography>
            </Box>
          </Box>

          {/* Upgrade */}
          <Box onClick={() => navigate('/user/upgrade-wallet')} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' }, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(41, 182, 246, 0.1)', display: 'flex', height: 'fit-content' }}>
                <TrendingUpIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#29B6F6' }} />
              </Box>
              <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.upgradeWalletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Upgrade</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '13px' }}>Take your wallet to the next level with more power, flexibility, and rewards.</Typography>
            </Box>
          </Box>

          {/* Earnings */}
          <Box onClick={() => navigate('/user/wallet')} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' }, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255, 215, 0, 0.1)', display: 'flex', height: 'fit-content' }}>
                <AccountBalanceWalletIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFD700' }} />
              </Box>
              <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Withdrawal</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '13px' }}>Watch your funds grow and withdraw them securely anytime.</Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/user/wallet?type=withdrawal');
                  }}
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFDF00 90%)',
                    color: '#050916',
                    borderRadius: '999px',
                    px: 3.5,
                    py: 0.8,
                    fontWeight: 900,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #e6c200 30%, #FFD700 90%)',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Withdraw
                </Button>
              </Box>
            </Box>
          </Box>
          {/* Purchase */}
          <Box onClick={() => navigate('/user/purchase-wallet')} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' }, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(156, 39, 176, 0.1)', display: 'flex', height: 'fit-content' }}>
                <InventoryIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#9C27B0' }} />
              </Box>
              <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number((walletOverview as any)?.purchaseBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Purchase</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '13px' }}>Manage your purchases and track your active product investments.</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

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
            <img src="/cb.png" alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Referral link</Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 3, opacity: 0.8, lineHeight: 1.4, fontSize: '0.8rem' }}>One link, endless connections—start building your network today</Typography>
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
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>

                  <Box onClick={() => navigate('/user/earnings/referral-bonus')} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(245, 158, 11, 0.1)', display: 'flex', height: 'fit-content' }}>
                        <PaymentsIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#f59e0b' }} />
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.directBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Referral Income</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Turn every referral into a rewarding opportunity with instant bonus earnings.</Typography>
                    </Box>
                  </Box>

                  <Box onClick={() => navigate('/user/earnings/level-benefits')} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255, 215, 0, 0.1)', display: 'flex', height: 'fit-content' }}>
                        <AccountTreeIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFD700' }} />
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.levelBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Level Income</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Every new level brings greater rewards—keep progressing and keep earning</Typography>
                    </Box>
                  </Box>

                  <Box onClick={() => navigate('/user/earnings/single-level-income-history')} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.1)', display: 'flex', height: 'fit-content' }}>
                        <TrendingUpIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#ef4444' }} />
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.singleLineIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Single Leg Income</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>One growing network, multiple earning opportunities—powered by your single-leg structure.</Typography>
                    </Box>
                  </Box>

                  {/* <Box onClick={() => navigate('/user/earnings/global-income-history')} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(59, 130, 246, 0.1)', display: 'flex', height: 'fit-content' }}>
                        <PublicIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#3b82f6' }} />
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.globalIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Global Income</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Earn from your global network as your community continues to grow</Typography>
                    </Box>
                  </Box> */}

                  <Box onClick={() => navigate('/user/transactions?type=Withdrawal')} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(168, 85, 247, 0.1)', display: 'flex', height: 'fit-content' }}>
                        <AttachMoneyIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#a855f7' }} />
                      </Box>
                      <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>₹{Number(walletOverview?.totalWithdrawal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Total Withdrawal</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Your total withdrawals, displayed for quick and easy financial tracking</Typography>
                    </Box>
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
