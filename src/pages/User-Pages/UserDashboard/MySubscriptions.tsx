import React, { useContext } from 'react';
import moment from 'moment';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Divider, Chip, LinearProgress,  } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UserContext from '../../../context/user/userContext';
import { useGetMemberAddOns } from '../../../api/Packages';
import { useGetWalletOverview } from '../../../api/Memeber';


const MySubscriptions: React.FC = () => {
  const { user } = useContext(UserContext);
  const { data: addOns = [], isLoading: addOnsLoading } = useGetMemberAddOns(user?.Member_id || '');
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || '');

  if (!user) {
    return (
      <Box sx={{ background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', minHeight: '100vh', display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', 
      minHeight: '100vh' 
    }}>
      <Box sx={{ mb: 4, mt: { xs: 1, md: 3 } }}>
        <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 900, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 1.5, textTransform: 'uppercase' }}>
          <Box sx={{ width: 4, height: 24, backgroundColor: '#FFD700', borderRadius: 1 }} />
          My Subscriptions
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, ml: 2, fontWeight: 500 }}>
          Manage your deposits and investment tracks.
        </Typography>
      </Box>

      {addOnsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {(() => {
            const primaryInAddOns = addOns.find((a: any) => a.package_id?.startsWith('PKG-P-'));
            let finalAddOns = [...addOns];
            if (primaryInAddOns) {
              finalAddOns = addOns.map((a: any) => a);
            }

            const baseAmount = user.package_value || 0;

            const primaryPkg = {
              request_id: 'PRIMARY',
              isPrimary: true,
              requested_amount: baseAmount,
              roi_status: user.roi_status || 'Active',
              roi_payout_target: user.roi_payout_target || ((user.package_value || 0) * 3),
              roi_payout_count: user.roi_payout_count || 0,
              roi_start_date: user.roi_start_date || user.Date_of_joining,
            };

            const allPackages = primaryInAddOns ? [...finalAddOns] : [primaryPkg, ...addOns];

            return allPackages.map((pkg: any, index: number) => {
              const pkgAmount = pkg.amount || pkg.requested_amount || 0;
              const pkgId = pkg.package_id || pkg.request_id || 'N/A';
              const totalDays = pkg.isFD 
                ? (moment(pkg.date_of_maturity).diff(moment(pkg.roi_start_date), 'days') || 1)
                : 120;
              const pkgProgress = pkg.roi_payout_count ? Math.min((pkg.roi_payout_count / totalDays) * 100, 100) : 0;



              // Calculate Single Leg Income buyers (Max 100)
              const sliAmount = walletOverview?.singleLevelIncomeByPackage?.[pkgAmount] || 0;
              const perBuyerIncome = pkgAmount * 0.015;
              const buyersCount = perBuyerIncome > 0 ? Math.round(sliAmount / perBuyerIncome) : 0;
              const sliProgress = Math.min((buyersCount / 100) * 100, 100);

              return (
                <Grid item xs={12} sm={6} md={4} key={pkgId}>
                  <Card sx={{
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-6px)', backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            {pkg.isFD ? <AccountBalanceIcon sx={{ fontSize: 16, color: '#f59e0b' }} /> : <PaymentsIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />}
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 800, color: pkg.isFD ? '#f59e0b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              {pkg.isFD ? 'Fixed Deposit' : `My Subscription #${index + 1}`}
                            </Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#ffffff', lineHeight: 1.2 }}>
                            ${pkgAmount.toLocaleString('en-US')}
                          </Typography>
                        </Box>
                          <Chip
                          label={pkg.roi_status}
                          size="small"
                          sx={{ 
                            height: 24, 
                            fontSize: '0.75rem', 
                            fontWeight: 800, 
                            borderRadius: '6px',
                            backgroundColor: pkg.roi_status === 'Active' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.1)',
                            color: pkg.roi_status === 'Active' ? '#FFD700' : 'rgba(255,255,255,0.7)',
                            border: `1px solid ${pkg.roi_status === 'Active' ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255,255,255,0.2)'}`
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', fontWeight: 600 }}>
                          {pkg.isFD ? 'Interest Rate' : 'Single Level Income'}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFD700', fontSize: '1.2rem' }}>
                          {pkg.isFD ? `${pkg.interest_rate || 0}% p.a.` : `$${sliAmount.toFixed(4)}`}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                          {pkg.isFD ? 'Maturity Progress' : `${buyersCount} of 100 Buyers`}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                          {pkg.isFD ? `${pkgProgress.toFixed(0)}%` : `${sliProgress.toFixed(0)}%`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pkg.isFD ? pkgProgress : sliProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #FFD700, #8b5cf6)',
                            borderRadius: 4
                          }
                        }}
                      />


                      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                            {new Date(pkg.roi_start_date || pkg.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontWeight: 500 }}>
                          #{pkgId.toString().slice(-8)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            });
          })()}
        </Grid>
      )}
    </Box>
  );
};

export default MySubscriptions;
