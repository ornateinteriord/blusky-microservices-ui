
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TokenService from '../../../api/token/tokenService';
import { useGetWalletOverview } from '../../../api/Memeber';
import USDTLogo from "../../../assets/USDT1.png";
import PaymentsIcon from '@mui/icons-material/Payments';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LanguageIcon from '@mui/icons-material/Language';

const PACKAGES: Record<string, { title: string, color: string, description?: string }> = {
  '30': { title: 'Starter Pip Plan', color: '#1de9b6', description: 'Begin your journey with the Starter PIP Plan and unlock new growth opportunities' },
  '60': { title: 'Growth Trader Package', color: '#CD7F32', description: 'The Growth Trader Package helps you explore enhanced features and expand your trading potential' },
  '120': { title: 'Elite Currency Portfolio', color: '#C0C0C0', description: 'Explore the Elite Currency Portfolio designed for advanced financial management and growth opportunities' },
  '250': { title: 'Global FX Advantage Plan', color: '#FFD700', description: 'Take your forex journey further with the Global FX Advantage Plan' },
  '500': { title: 'Pro Trader Wealth Package', color: '#E5E4E2', description: 'A premium package built to support smarter trading decisions and long-term growth' },
  '1000': { title: 'VIP Liquidity Master Plan', color: '#b9f2ff', description: 'Experience a higher level of financial flexibility with the VIP Liquidity Master Plan' }
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
      {/* Logo and Package Name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, }}>
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
          <Typography variant="h6" sx={{ color: pkgInfo.color, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center' }}>
            {pkgInfo.title}
          </Typography>
        </Box>
        {pkgInfo.description && (
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, textAlign: 'center', maxWidth: '80%', fontStyle: 'italic' }}>
            "{pkgInfo.description}"
          </Typography>
        )}
      </Box>

      {/* Cards Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: 2, 
        maxWidth: '600px', 
        margin: '0 auto' ,
        padding:{xs:2,md:0}
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(245, 158, 11, 0.1)', display: 'flex', height: 'fit-content' }}>
              <PaymentsIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#f59e0b' }} />
            </Box>
            <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>${Number(walletOverview?.directBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</Typography>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Referral Income</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Turn every referral into a rewarding opportunity with instant bonus earnings.</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255, 215, 0, 0.1)', display: 'flex', height: 'fit-content' }}>
              <AccountTreeIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#FFD700' }} />
            </Box>
            <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>${Number(walletOverview?.levelBenefits || 0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</Typography>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Level Income</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Every new level brings greater rewards—keep progressing and keep earning</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.1)', display: 'flex', height: 'fit-content' }}>
              <TrendingUpIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#ef4444' }} />
            </Box>
            <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>${Number(packageIncome || walletOverview?.singleLineIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</Typography>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Single Leg Income</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>One growing network, multiple earning opportunities—powered by your single-leg structure.</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 }, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(29, 233, 182, 0.1)', display: 'flex', height: 'fit-content' }}>
              <LanguageIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: '#1de9b6' }} />
            </Box>
            <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '1px', m: 0 }}>${Number(0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</Typography>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, textTransform: 'uppercase', mb: 0.5 }}>Global Income</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.3, width: '100%', fontSize: '14px' }}>Earn from your global network as your community continues to grow</Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default PackageDetail;
