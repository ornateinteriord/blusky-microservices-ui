import { Card, CardContent, Typography, Grid, Box, CircularProgress,  } from '@mui/material';
import DataTable from "react-data-table-component";
import { useMediaQuery } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getUpgradeWalletColumns,  } from '../../../utils/DataTableColumnsProvider';
import TokenService from "../../../api/token/tokenService";
import { useGetWalletOverview } from '../../../api/Memeber';

const UpgradeWallet = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const memberId = TokenService.getMemberId();
  const { data: walletData, isLoading } = useGetWalletOverview(memberId);

  if (isLoading) {
    return (
      <Card
        sx={{
          margin: isMobile ? "1rem" : "2rem",
          mt: 1,
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
        mt: 1,
      }}
    >
      <CardContent sx={{ padding: isMobile ? "12px" : "24px" }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                textAlign: "center",
                border: "2px solid #0a2558",
                position: "relative",
              }}
            >
              <Typography variant="subtitle1" color="textSecondary">
                Upgrade Balance
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: "#0a2558", mt: 1, fontWeight: "bold" }}
              >
                ${Number(walletData?.upgradeWalletBalance || 0).toFixed(4)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Transaction History */}
        <div style={{ marginBottom: "1rem", color: "#000", fontWeight: "bold", fontSize: "1.25rem"     }}>Transaction History</div>
          {walletData?.transactions && walletData.transactions.filter((tx: any) => parseFloat(tx.uw_credit) > 0 || parseFloat(tx.uw_debit) > 0 || tx.transaction_type === "Upgrade Wallet Deduction").length > 0 ? (
              <DataTable
                columns={getUpgradeWalletColumns()}
                data={walletData.transactions.filter((tx: any) => parseFloat(tx.uw_credit) > 0 || parseFloat(tx.uw_debit) > 0 || tx.transaction_type === "Upgrade Wallet Deduction")}
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

export default UpgradeWallet;
