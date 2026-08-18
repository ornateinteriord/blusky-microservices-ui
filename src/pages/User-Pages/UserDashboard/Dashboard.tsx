// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress, Paper, Button } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCode2Icon from '@mui/icons-material/QrCode2';


import TokenService from '../../../api/token/tokenService';
import { useVerifyPayment, parsePaymentRedirectParams, useGetTransactionDetails, useGetWalletOverview, useGetMemberDetails, useGetDailyPayout } from '../../../api/Memeber';

import ProductsContainer from './ProductsContainer';
import DashboardQRDialog from './DashboardQRDialog';
import bmsLogo from '../../../assets/bms_logo.png';

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


  const quickAccessGroups = [
    {
      title: "ACCOUNT",
      items: [
        { label: "Profile", icon: <AccountCircleIcon />, route: "/user/account/profile", color: '#0284C7' },
        { label: "KYC", icon: <VerifiedUserIcon />, route: "/user/account/kyc", color: "#0284C7" },
        { label: "Password", icon: <LockIcon />, route: "/user/account/change-password", color: "#f59e0b" },
        { label: "Portfolio", icon: <AccountBalanceWalletIcon />, route: "/user/portfolio", color: "#0284C7" },
      ]
    },
    {
      title: "TEAM & TOOLS",
      items: [
        { label: "New Regi.", icon: <PersonAddAltIcon />, route: "/user/team/new-register", color: "#0284C7" },
      ]
    }
  ];






  return (
    <Box sx={{
      pb: 6,
      background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
      minHeight: '100vh',
      px: { xs: 2.5, md: 5, lg: 10, xl: 16 },
      pt: { xs: 1.5, md: 4 },
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {isVerifyingPayment && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#0F172A', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#0F172A' }}>Verifying payment...</Typography>
        </Box>
      )}

      {/* User Header - Virtual Debit Card */}
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        height: '190px',
        mb: 4,
        mt: 1,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 65%, #0a0a0a 100%)',
        boxShadow: '0 20px 40px rgba(234, 88, 12, 0.25)',
        overflow: 'hidden',
        color: '#fff',
        p: 2.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(255,255,255,0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.15), transparent 50%)',
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <img 
            src={bmsLogo} 
            alt="BMS Logo" 
            style={{ height: '26px', objectFit: 'contain' }} 
          />
          
          {/* SIM / QR Button */}
          <Box 
            onClick={() => setIsQRDialogOpen(true)}
            sx={{ 
              width: '40px', 
              height: '30px', 
              borderRadius: '6px', 
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 0 2px 5px rgba(0,0,0,0.2)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: '4px',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '4px'
              },
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
            title="My QR"
          >
            <QrCode2Icon sx={{ color: '#78350f', fontSize: 20, zIndex: 2 }} />
          </Box>
        </Box>

        <Box sx={{ zIndex: 1 }}>
          <Typography sx={{ 
            fontFamily: 'monospace', 
            fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
            letterSpacing: '3px', 
            fontWeight: 600,
            mb: 1.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {memberDetails?.virtual_card_number || '4638 2926 4400 0000'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Cardholder Name
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {memberDetails?.Name || 'Loading...'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Valid
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'monospace' }}>
                {(() => {
                  const joinDateStr = memberDetails?.createdAt || memberDetails?.Created_at || memberDetails?.JoiningDate || null;
                  const joinDate = joinDateStr ? new Date(joinDateStr) : new Date();
                  if (isNaN(joinDate.getTime())) return "01/24 - 01/27";
                  const validThru = new Date(joinDate);
                  validThru.setFullYear(validThru.getFullYear() + 3);
                  
                  const formatDt = (dt: Date) => `${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getFullYear()).slice(-2)}`;
                  
                  return `${formatDt(joinDate)} - ${formatDt(validThru)}`;
                })()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

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
        bgcolor: '#F1F5F9',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        width: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5, 
          width: '100%'
        }}>
          {/* Credits */}
          <Box onClick={() => navigate('/user/top-up-wallet')} sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', bgcolor: '#F1F5F9' }, cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(2, 132, 199, 0.1)', display: 'flex', height: 'fit-content' }}>
                <PaymentsIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#00E676' }} />
              </Box>
              <Typography sx={{ color: '#0F172A', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>{Number(walletOverview?.topUpBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ color: '#1E293B', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Credits</Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '13px' }}>Fund your wallet to unlock premium features and start growing your wealth.</Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/user/load-fund');
                  }}
                  sx={{
                    background: 'linear-gradient(45deg, #0284C7 30%, #38BDF8 90%)',
                    color: '#0F172A',
                    borderRadius: '999px',
                    px: 3.5,
                    py: 0.8,
                    fontWeight: 900,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0369A1 30%, #0284C7 90%)',
                      boxShadow: '0 6px 20px rgba(2, 132, 199, 0.5)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                 Add Credit
                </Button>
              </Box>
            </Box>
          </Box>

        </Box>
      </Paper>

      {/* Quick Access Icons */}
      <Box sx={{ mb: 4, width: '100%' }}>
        <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 900, mb: 3, textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Quick Access
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: { xs: 2, md: 3 } }}>
          {quickAccessGroups.flatMap(group => group.items).map((item: any, i: number) => (
            <Box key={i} onClick={() => item.onClick ? item.onClick() : navigate(item.route)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
              <Box sx={{
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                borderRadius: '16px',
                bgcolor: '#F1F5F9',
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
                border: '1px solid #E2E8F0',
                '&:hover': { transform: 'scale(1.1)', bgcolor: '#F8FAFC' },
                transition: '0.2s'
              }}>
                {item.icon}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.8rem' }, textAlign: 'center', color: '#1E293B' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
