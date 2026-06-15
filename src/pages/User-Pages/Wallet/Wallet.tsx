import { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Box, Button, CircularProgress,  } from '@mui/material';
import DataTable from "react-data-table-component";
import { useMediaQuery } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getWalletColumns,  } from '../../../utils/DataTableColumnsProvider';
import TokenService from "../../../api/token/tokenService";
import { useGetWalletOverview, useWalletWithdraw, useGetMemberDetails } from '../../../api/Memeber';
import { toast } from 'react-toastify';

const Wallet = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [amount, setAmount] = useState("");
  const [tds, setTds] = useState(0); const [netAmount, setNetAmount] = useState(0);
  const [optimisticBalance, setOptimisticBalance] = useState<number | null>(null);
  const [isWithdrawalAllowed, setIsWithdrawalAllowed] = useState<boolean>(true);
  // const [ setLoanStatusMessage] = useState<string>("");

  const memberId = TokenService.getMemberId();

  const {
    data: walletData,
    isLoading,
    refetch,
  } = useGetWalletOverview(memberId);

  const { data: memberDetails } = useGetMemberDetails(memberId);

  const withdrawMutation = useWalletWithdraw(memberId);

  // --- Referral requirement logic ---
  const currentDirects = memberDetails?.data?.registration_stats?.direct || 0;
  const totalPackages = parseFloat(walletData?.data?.totalPackages || 0);

  let requiredReferrals = 0;
  if (totalPackages >= 1000) requiredReferrals = 10;
  else if (totalPackages >= 500) requiredReferrals = 8;
  else if (totalPackages >= 250) requiredReferrals = 6;
  else if (totalPackages >= 120) requiredReferrals = 4;
  else if (totalPackages >= 60) requiredReferrals = 2;
  else requiredReferrals = 0; // <= 30

  const isReferralConditionMet = currentDirects >= requiredReferrals;

  useEffect(() => {
    if (walletData?.data?.balance) {
      const balance = parseFloat(walletData.data.balance);
      setOptimisticBalance(balance);
    }

    // Check withdrawal allowance from API response
    if (walletData?.loanStatus) {
      setIsWithdrawalAllowed(walletData.loanStatus.isWithdrawalAllowed);
      // setLoanStatusMessage(walletData.loanStatus.message || "");
    }
  }, [walletData?.data?.balance, walletData?.loanStatus]);

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    // Allow only numeric input
    if (value !== "" && !/^\d*$/.test(value)) return;

    setAmount(value);

    if (value && value !== "0") {
      const withdrawalAmount = parseFloat(value);
      const tdsAmount = withdrawalAmount * 0.05; // 5% TDS
      const calculatedNetAmount = withdrawalAmount - tdsAmount;

      setTds(tdsAmount);
      setNetAmount(calculatedNetAmount);
    } else {
      setTds(0);
      setNetAmount(0);
    }
  };

  const handleWithdraw = () => {
    if (!amount || amount === "0") {
      return;
    }

    if (!memberId) {
      return;
    }

    if (!isReferralConditionMet) {
      toast.error(`You need ${requiredReferrals} direct referrals to withdraw at your current package level.`);
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    const currentBalance = optimisticBalance !== null ? optimisticBalance : parseFloat(walletData?.balance || 0);

    if (withdrawalAmount > currentBalance) {
      return;
    }

    if (withdrawalAmount < 5) {
      toast.error('Minimum withdrawal amount is $5');
      return;
    }

    const newBalance = currentBalance - withdrawalAmount;
    setOptimisticBalance(newBalance);

    withdrawMutation.mutate(
      { memberId: memberId, amount: amount },
      {
        onSuccess: () => {
          setAmount("");
          setTds(0);
          setNetAmount(0);
          refetch();
        },
        onError: () => {
          // Revert optimistic update on error
          setOptimisticBalance(parseFloat(walletData?.balance || 0));
        }
      }
    );
  };

  const displayBalance = Math.max(0, optimisticBalance !== null ? optimisticBalance : parseFloat(walletData?.balance || 0));

  if (isLoading) {
    return (
      <Card
        sx={{
          margin: isMobile ? "1rem" : "2rem",
          mt: 1, // Further reduced top margin
          textAlign: "center",
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress sx={{ color: "#0a2558" }} />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        margin: isMobile ? "0.5rem" : "1rem",
        backgroundColor: "#fff",
        mt: 1, // Further reduced top margin
      }}
    >
      <CardContent sx={{ padding: isMobile ? "12px" : "24px" }}>
        {/* Withdrawal Section */}
        <div>
          <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
            Withdrawal Request {!isWithdrawalAllowed && "(Temporarily Disabled)"}
          </div>
          <div style={{ padding: "0 1rem 1rem 1rem" }}>
            <form
              style={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <TextField
                label="Available Balance"
                value={`$${displayBalance.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                  },
                }}
              />

              <TextField
                label="Withdrawal Amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                fullWidth
                size="medium"
                placeholder="Enter amount (Min $5)"
                disabled={withdrawMutation.isPending || !isWithdrawalAllowed}
                error={parseFloat(amount) > displayBalance}
                helperText={parseFloat(amount) > displayBalance ? "Insufficient Balance" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                  },
                }}
              />

              {/* 
              <TextField
                label="Admin Charges (15%)"
                value={`$${adminCharges.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                  },
                }}
              />
              */}

              <TextField
                label="Admin (5%)"
                value={`$${tds.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                  },
                }}
              />

              <TextField
                label="Net Amount Received"
                value={`$${netAmount.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#0a2558" : "#ff9800" },
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Terms & Conditions:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 4, flexDirection: isMobile ? "column" : "row" }}>
                    <Box>
                      <Typography variant="body2">• 5% Admin applied</Typography>
                      <Typography variant="body2">• Minimum withdrawal: $5</Typography>
                      <Typography variant="body2">• One withdrawal per day allowed</Typography>
                    </Box>
                  </Box>
                  {!isWithdrawalAllowed && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ff9800",
                        fontWeight: "bold",
                        mt: 1
                      }}
                    >
                      • Withdrawal disabled due to unpaid loan from last Saturday
                    </Typography>
                  )}
                  {!isReferralConditionMet && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#f44336",
                        fontWeight: "bold",
                        mt: 1
                      }}
                    >
                      • Withdrawal locked: Your package level requires {requiredReferrals} direct referrals, but you currently have {currentDirects}.
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  onClick={handleWithdraw}
                  disabled={
                    withdrawMutation.isPending ||
                    !amount ||
                    amount === "0" ||
                    parseFloat(amount) > displayBalance ||
                    !isWithdrawalAllowed ||
                    !isReferralConditionMet
                  }
                  sx={{
                    backgroundColor: isWithdrawalAllowed && isReferralConditionMet ? "#0a2558" : "#ff9800",
                    minWidth: "120px",
                    "&:hover": {
                      backgroundColor: isWithdrawalAllowed && isReferralConditionMet ? "#581c87" : "#f57c00"
                    },
                    "&:disabled": { backgroundColor: "#cccccc" },
                  }}
                >
                  {withdrawMutation.isPending ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    (!isWithdrawalAllowed || !isReferralConditionMet) ? "Disabled" : "Withdraw"
                  )}
                </Button>
              </Box>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>Transaction History</div>
          {walletData?.transactions && walletData.transactions.filter((tx: any) => tx.transaction_type !== "Upgrade Wallet Deduction").length > 0 ? (
              <DataTable
                columns={getWalletColumns()}
                data={walletData.transactions.filter((tx: any) => tx.transaction_type !== "Upgrade Wallet Deduction")}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={isMobile ? 10 : 25}
                paginationRowsPerPageOptions={
                  isMobile ? [10, 20, 50] : [25, 50, 100]
                }
                highlightOnHover
                responsive
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No transactions found
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Your transaction history will appear here
                </Typography>
              </Box>
            )}
      </CardContent>
    </Card>
  );
};

export default Wallet;