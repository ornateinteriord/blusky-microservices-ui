
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TokenService from '../../../api/token/tokenService';
import { useGetWalletOverview } from '../../../api/Memeber';
import USDTLogo from "../../../assets/USDT1.png";
import PaymentsIcon from '@mui/icons-material/Payments';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LanguageIcon from '@mui/icons-material/Language';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const PACKAGES: Record<string, { title: string, color: string }> = {
  '30': { title: 'Starter Pip Plan', color: '#1de9b6' },
  '60': { title: 'Growth Trader Package', color: '#CD7F32' },
  '120': { title: 'Elite Currency Portfolio', color: '#C0C0C0' },
  '250': { title: 'Global FX Advantage Plan', color: '#FFD700' },
  '500': { title: 'Pro Trader Wealth Package', color: '#E5E4E2' },
  '1000': { title: 'VIP Liquidity Master Plan', color: '#b9f2ff' }
};

const PackageDetail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const packageFilter = searchParams.get('package') || '60';

  const memberId = TokenService.getMemberId();
  const { data: walletOverview } = useGetWalletOverview(memberId);

  const pkgInfo = PACKAGES[packageFilter] || { title: 'PACKAGE', color: '#FFD700' };

  // If we have package-specific income data, use it; otherwise fallback to general wallet stats.
  const packageIncome = walletOverview?.singleLevelIncomeByPackage?.[packageFilter] || 0;

  return (
    <Box sx={{
      pb: 10,
      background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)',
      minHeight: '100vh',
      px: { xs: 1, md: 5 },
      pt: { xs: 1, md: 4 }
    }}>
      {/* Auto calculation block - INR conversion */}
      <Box sx={{ 
        bgcolor: 'rgba(255,255,255,0.04)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '16px', 
        p: { xs: 2, md: 3 }, 
        mb: 2, 
        mt: { xs: 2, md: 0 },
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

      {/* Logo and Package Name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          width: '130px', 
          height: '130px', 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          p: 1,
          boxShadow: `0 0 30px ${pkgInfo.color}20`,
          border: `1px solid ${pkgInfo.color}40`
        }}>
          <img src={USDTLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
        
        <Box sx={{ 
          border: `2px solid ${pkgInfo.color}`,
          borderRadius: '999px',
          px: 5,
          py: 1.2,
          bgcolor: 'rgba(255,255,255,0.05)',
          boxShadow: `0 0 20px ${pkgInfo.color}30`
        }}>
          <Typography variant="h6" sx={{ color: pkgInfo.color, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {pkgInfo.title}
          </Typography>
        </Box>
      </Box>

      {/* Cards Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 2, 
        maxWidth: '500px', 
        margin: '0 auto' 
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <PaymentsIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>Referral Bonus</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.directBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <TrendingUpIcon sx={{ fontSize: 32, color: '#ef4444' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>Single Level Income</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(packageIncome || walletOverview?.singleLineIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <AccountTreeIcon sx={{ fontSize: 32, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>Level Bonus</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.levelBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <AttachMoneyIcon sx={{ fontSize: 32, color: '#ef4444' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>Total Withdrawal</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.totalWithdrawal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <LanguageIcon sx={{ fontSize: 32, color: '#1de9b6' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>Global Income</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2.5, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, textAlign: 'center', fontSize: '0.75rem' }}>Earning Balance</Typography>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>${Number(walletOverview?.totalIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default PackageDetail;
