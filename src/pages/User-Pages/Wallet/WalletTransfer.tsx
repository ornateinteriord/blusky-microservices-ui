import { useState, useEffect } from 'react';
import { Box, Typography, Card, MenuItem, Select, TextField, Button, CircularProgress, Fade, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useGetWalletOverview, useTransferWallet, useGetMemberDetails } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';
import { toast } from 'react-toastify';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { auth } from '../../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const WalletTransfer = () => {
  const memberId = TokenService.getMemberId();
  const userId = TokenService.getUserId();
  const { data: walletOverview, refetch } = useGetWalletOverview(memberId);
  const { data: memberDetails } = useGetMemberDetails(userId);
  const { mutate: transferWallet } = useTransferWallet();

  const [step, setStep] = useState<1 | 2>(1);
  const [fromWallet, setFromWallet] = useState('Earnings');
  const [toWallet, setToWallet] = useState('Purchase Wallet');

  useEffect(() => {
    if (fromWallet === 'Earnings') setToWallet('Purchase Wallet');
    else if (fromWallet === 'Top Up') setToWallet('Upgrade Wallet');
    else if (fromWallet === 'Upgrade') setToWallet('Purchase Wallet');
  }, [fromWallet]);
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>(null);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const earningsBalance = walletOverview?.balance || '0.00';
  const topUpBalance = walletOverview?.topUpBalance || '0.00';
  const upgradeBalance = walletOverview?.upgradeWalletBalance || '0.00';

  const getAvailableBalance = () => {
    if (fromWallet === 'Earnings') return earningsBalance;
    if (fromWallet === 'Top Up') return topUpBalance;
    if (fromWallet === 'Upgrade') return upgradeBalance;
    return '0.00';
  };

  const setupRecaptcha = () => {
    if (!(window as any).walletTransferRecaptchaVerifier) {
      (window as any).walletTransferRecaptchaVerifier = new RecaptchaVerifier(auth, 'wallet-transfer-recaptcha', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  useEffect(() => {
    return () => {
      if ((window as any).walletTransferRecaptchaVerifier) {
        try {
          (window as any).walletTransferRecaptchaVerifier.clear();
        } catch (e) {}
        (window as any).walletTransferRecaptchaVerifier = null;
      }
    };
  }, []);

  const handleSendOTP = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    if (Number(amount) > Number(getAvailableBalance())) {
      toast.error(`Insufficient balance in ${fromWallet}`);
      return;
    }

    const phoneNumber = memberDetails?.mobileno;
    if (!phoneNumber) {
      toast.error('Mobile number not found in profile');
      return;
    }

    let formattedPhone = String(phoneNumber).trim().replace(/\s+/g, '');
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone; // Default country code if missing
    }

    setIsSendingOTP(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).walletTransferRecaptchaVerifier;
      
      console.log("--- DEBUG START ---");
      console.log("Original phoneNumber from profile:", phoneNumber);
      console.log("Formatted Phone:", formattedPhone);
      console.log("App Verifier Object:", appVerifier);
      console.log("--- DEBUG END ---");

      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      
      toast.success('OTP sent to your mobile successfully');
      setStep(2);
    } catch (error: any) {
      console.error("SMS Error", error);
      toast.error('Failed: ' + (error.message || 'Unknown error'));
      // Removed recaptchaVerifier.clear() to prevent widget corruption
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleTransfer = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsTransferring(true);
    try {
      if (!confirmationResult) throw new Error("Session expired, please request OTP again.");
      
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      transferWallet({
        memberId: memberId || '',
        fromWallet,
        toWallet: toWallet === 'Purchase Wallet' ? 'Top Up Wallet' : toWallet,
        amount,
        otp: idToken // Send Firebase token to backend instead of raw OTP
      }, {
        onSuccess: () => {
          setTransferDetails({ amount, fromWallet, toWallet: toWallet === 'Purchase Wallet' ? 'Top Up Wallet' : toWallet });
          setSuccessDialogOpen(true);
          setAmount('');
          setOtp('');
          setStep(1);
          refetch();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Transfer failed');
        }
      });
    } catch (error: any) {
      console.error(error);
      toast.error('Invalid OTP or transfer failed.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh', bgcolor: '#F8FAFC', pt: { xs: 3, md: 10 } }}>
      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          {step === 2 && (
            <IconButton onClick={() => setStep(1)} sx={{ color: '#0F172A', bgcolor: '#F1F5F9' }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CurrencyExchangeIcon fontSize="small" />
          </Box>
          <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 800 }}>Wallet Transfer</Typography>
        </Box>

        <Card sx={{ p: 4, borderRadius: '24px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>

          {step === 1 ? (
            <Fade in={step === 1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>From Account</Typography>
                  <Select
                    fullWidth
                    value={fromWallet}
                    onChange={(e) => setFromWallet(e.target.value)}
                    sx={{
                      bgcolor: '#F8FAFC',
                      color: '#0F172A',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      '& .MuiSvgIcon-root': { color: '#0F172A' }
                    }}
                  >
                    <MenuItem value="Earnings">Payouts (Bal: {earningsBalance})</MenuItem>
                    <MenuItem value="Top Up">Purchase Wallet (Bal: {topUpBalance})</MenuItem>
                    <MenuItem value="Upgrade">Property Fund (Bal: {upgradeBalance})</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>To Account</Typography>
                  <Select
                    fullWidth
                    value={toWallet}
                    onChange={(e) => setToWallet(e.target.value)}
                    disabled={fromWallet !== 'Earnings'}
                    sx={{
                      bgcolor: '#F8FAFC',
                      color: '#0F172A',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                      '& .MuiSelect-select.Mui-disabled': { color: '#475569', WebkitTextFillColor: '#64748B', opacity: 1 },
                      '& .MuiSvgIcon-root': { color: '#64748B' }
                    }}
                  >
                    {fromWallet === 'Earnings' ? (
                      [
                        <MenuItem key="1" value="Purchase Wallet">Purchase Wallet (Bal: {topUpBalance})</MenuItem>,
                        <MenuItem key="2" value="Upgrade Wallet">Property Fund (Bal: {upgradeBalance})</MenuItem>
                      ]
                    ) : fromWallet === 'Top Up' ? (
                      <MenuItem value="Upgrade Wallet">Property Fund (Bal: {upgradeBalance})</MenuItem>
                    ) : (
                      <MenuItem value="Purchase Wallet">Purchase Wallet (Bal: {topUpBalance})</MenuItem>
                    )}
                  </Select>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>Amount (?)</Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter amount to transfer"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    InputProps={{
                      startAdornment: <Typography sx={{ color: '#475569', mr: 1 }}></Typography>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#F8FAFC',
                        color: '#0F172A',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#E2E8F0' },
                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#10b981', mt: 1, display: 'block' }}>
                    Available Balance: {getAvailableBalance()}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                    }
                  }}
                >
                  {isSendingOTP ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Transfer'}
                </Button>
              </Box>
            </Fade>
          ) : (
            <Fade in={step === 2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box textAlign="center">
                  <Typography variant="h6" sx={{ color: '#0F172A', mb: 1 }}>Security Verification</Typography>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Enter the 6-digit OTP sent to your registered mobile number.
                  </Typography>
                </Box>

                <Box sx={{ my: 2 }}>
                  <MuiOtpInput
                    length={6}
                    value={otp}
                    onChange={(newValue) => setOtp(newValue)}
                    TextFieldsProps={{
                      size: 'medium',
                      placeholder: '-',
                      type: 'password',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#F8FAFC',
                          color: '#0F172A',
                          borderRadius: '12px',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          '& fieldset': { borderColor: '#E2E8F0' },
                          '&:hover fieldset': { borderColor: '#E2E8F0' },
                          '&.Mui-focused fieldset': {
                            borderColor: '#10b981',
                            borderWidth: '2px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          textAlign: 'center',
                          px: 0,
                        }
                      }
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={handleTransfer}
                  disabled={isTransferring || otp.length !== 6}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                    },
                    '&.Mui-disabled': {
                      background: '#E2E8F0',
                      color: '#64748B',
                    }
                  }}
                >
                  {isTransferring ? <CircularProgress size={24} color="inherit" /> : 'Confirm Transfer'}
                </Button>
              </Box>
            </Fade>
          )}

        </Card>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#F1F5F9',
            color: '#0F172A',
            borderRadius: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4, color: '#10b981', fontWeight: 800, fontSize: '1.5rem' }}>
          Transfer Successful!
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: '#475569' }}>
            Your funds have been successfully transferred.
          </Typography>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>Amount Transferred</Typography>
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>{transferDetails?.amount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>From</Typography>
              <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{transferDetails?.fromWallet}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>To</Typography>
              <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{transferDetails?.toWallet}</Typography>
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
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#0F172A',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              }
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Permanent mount for invisible reCAPTCHA to prevent 'element has been removed' errors */}
      <div id="wallet-transfer-recaptcha"></div>
    </Box>
  );
};

export default WalletTransfer;

