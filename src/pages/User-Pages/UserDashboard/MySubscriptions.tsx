import React, { useContext } from 'react';
import moment from 'moment';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Divider, Chip, LinearProgress, Button } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import UserContext from '../../../context/user/userContext';
import { useGetMemberAddOns } from '../../../api/Packages';
import { useGetWalletOverview } from '../../../api/Memeber';
import { openBondCertificate } from '../../../utils/BondCertificateGenerator';


const MySubscriptions: React.FC = () => {
  const { user } = useContext(UserContext);
  const { data: addOns = [], isLoading: addOnsLoading } = useGetMemberAddOns(user?.Member_id || '');
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || '');

  if (!user) {
    return (
      <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress sx={{ color: '#0284C7' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: '#F8FAFC', 
      minHeight: '100vh' 
    }}>
      <Box sx={{ mb: 4, mt: { xs: 1, md: 3 } }}>
        <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 900, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 1.5, textTransform: 'uppercase' }}>
          <Box sx={{ width: 4, height: 24, backgroundcolor: '#0284C7', borderRadius: 1 }} />
          My Subscriptions
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', mt: 0.5, ml: 2, fontWeight: 500 }}>
          Manage your deposits and investment tracks.
        </Typography>
      </Box>

      {addOnsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#0284C7' }} />
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
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-6px)', backgroundColor: '#F8FAFC' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            {pkg.isFD ? <AccountBalanceIcon sx={{ fontSize: 16, color: '#f59e0b' }} /> : <PaymentsIcon sx={{ fontSize: 16, color: '#475569' }} />}
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 800, color: pkg.isFD ? '#f59e0b' : '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              {pkg.isFD ? 'Fixed Deposit' : `My Subscription #${index + 1}`}
                            </Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#0F172A', lineHeight: 1.2 }}>
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
                            backgroundColor: pkg.roi_status === 'Active' ? 'rgba(2, 132, 199, 0.2)' : '#E2E8F0',
                            color: pkg.roi_status === 'Active' ? '#FFD700' : '#64748B',
                            border: `1px solid ${pkg.roi_status === 'Active' ? 'rgba(2, 132, 199, 0.3)' : '#E2E8F0'}`
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2, borderColor: '#E2E8F0' }} />
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#475569', display: 'block', fontWeight: 600 }}>
                          {pkg.isFD ? 'Interest Rate' : 'Single Leg Income'}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0284C7', fontSize: '1.2rem' }}>
                          {pkg.isFD ? `${pkg.interest_rate || 0}% p.a.` : `${sliAmount.toFixed(2)}`}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>
                          {pkg.isFD ? 'Maturity Progress' : `${buyersCount} of 100 Buyers`}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>
                          {pkg.isFD ? `${pkgProgress.toFixed(0)}%` : `${sliProgress.toFixed(0)}%`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pkg.isFD ? pkgProgress : sliProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #FFD700, #8b5cf6)',
                            borderRadius: 4
                          }
                        }}
                      />

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => openBondCertificate({
                          memberNumber: user.Member_id || user.member_id || '',
                          memberName: user.Name || user.name || '',
                          dob: user.dob || '',
                          fatherName: user.Father_name || user.father_name || '',
                          address: user.address || '',
                          accountNo: user.account_number || pkg.package_id || `FD${pkgId.toString().slice(-5)}`,
                          commencementDate: pkg.roi_start_date || user.Date_of_joining || new Date().toISOString(),
                          planTerm: 'FD / 3 Years',
                          planAmount: pkgAmount,
                          interestRate: pkg.interest_rate || 9.0,
                          maturityDate: moment(pkg.roi_start_date || user.Date_of_joining || new Date().toISOString()).add(3, 'years').toISOString(),
                          aadhaarNo: user.aadharcard_no || '',
                          panNo: user.Pan_no || user.pan_no || '',
                          nomineeName: user.Nominee_name || user.nominee || '',
                          nomineeRelation: user.Nominee_Relation || user.relation || '',
                          branchCode: user.branch_id || '004',
                          branch: 'UDUPI',
                          profilePhotoUrl: user.profile_image || user.member_image,
                        })}
                        sx={{
                          mt: 3,
                          width: '100%',
                          borderColor: '#0284C7',
                          color: '#0284C7',
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          py: 1,
                          borderRadius: '8px',
                          '&:hover': { bgcolor: 'rgba(2,132,199,0.1)', borderColor: '#0369A1' }
                        }}
                      >
                        Download Bond Certificate
                      </Button>

                      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon sx={{ color: '#64748B', fontSize: 14 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>
                            {new Date(pkg.roi_start_date || pkg.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace', fontWeight: 500 }}>
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
