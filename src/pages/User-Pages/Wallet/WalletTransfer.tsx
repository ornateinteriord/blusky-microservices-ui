import { useState } from 'react';
import { Box, Typography, Card, MenuItem, Select, TextField, Button, CircularProgress } from '@mui/material';
import { useGetWalletOverview, useTransferWallet } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';
import { toast } from 'react-toastify';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const WalletTransfer = () => {
  const memberId = TokenService.getMemberId();
  const { data: walletOverview, refetch } = useGetWalletOverview(memberId);
  const { mutate: transferWallet, isPending } = useTransferWallet();

  const [fromWallet, setFromWallet] = useState('Earnings');
  const toWallet = fromWallet === 'Earnings' ? 'Top Up Wallet' : 'Upgrade Wallet';
  const [amount, setAmount] = useState('');

  const earningsBalance = walletOverview?.balance || '0.00';
  const topUpBalance = walletOverview?.topUpBalance || '0.00';
  const upgradeBalance = walletOverview?.upgradeWalletBalance || '0.00';

  const getAvailableBalance = () => {
    if (fromWallet === 'Earnings') return earningsBalance;
    if (fromWallet === 'Top Up') return topUpBalance;
    return '0.00';
  };

  const handleTransfer = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    if (Number(amount) > Number(getAvailableBalance())) {
      toast.error(`Insufficient balance in ${fromWallet}`);
      return;
    }

    transferWallet({
      memberId: memberId || '',
      fromWallet,
      toWallet,
      amount
    }, {
      onSuccess: () => {
        toast.success(`Successfully transferred $${amount} to ${toWallet}`);
        setAmount('');
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Transfer failed');
      }
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh', background: 'linear-gradient(180deg, #050916 0%, #0f1e36 100%)', pt: { xs: 3, md: 10 } }}>
      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CurrencyExchangeIcon fontSize="small" />
          </Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>Wallet Transfer</Typography>
        </Box>

        <Card sx={{ p: 4, borderRadius: '24px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 600 }}>From Account</Typography>
              <Select
                fullWidth
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' }
                }}
              >
                <MenuItem value="Earnings">Earnings Wallet (Bal: ${earningsBalance})</MenuItem>
                <MenuItem value="Top Up">Top Up Wallet (Bal: ${topUpBalance})</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 600 }}>To Account</Typography>
              <Select
                fullWidth
                value={toWallet}
                disabled
                sx={{
                  bgcolor: 'rgba(255,255,255,0.02)',
                  color: 'white',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '& .MuiSelect-select.Mui-disabled': { color: 'white', WebkitTextFillColor: 'white', opacity: 1 }
                }}
              >
                {toWallet === 'Top Up Wallet' ? (
                  <MenuItem value="Top Up Wallet">Top Up Wallet (Bal: ${topUpBalance})</MenuItem>
                ) : (
                  <MenuItem value="Upgrade Wallet">Upgrade Wallet (Bal: ${upgradeBalance})</MenuItem>
                )}
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 600 }}>Amount (USDT)</Typography>
              <TextField
                fullWidth
                placeholder="Enter amount to transfer"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <Typography sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>$</Typography>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
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
                Available Balance: ${getAvailableBalance()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleTransfer}
              disabled={isPending}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              {isPending ? <CircularProgress size={24} color="inherit" /> : 'Transfer Funds'}
            </Button>

          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default WalletTransfer;
