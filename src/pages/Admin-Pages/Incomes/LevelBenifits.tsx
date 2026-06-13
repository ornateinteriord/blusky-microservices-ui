import { useState } from 'react';
import { Box, Card, CardContent, TextField, Typography, CircularProgress } from '@mui/material';
import DataTable from "react-data-table-component";
import { DASHBOARD_CUTSOM_STYLE, getAdminAggregatedIncomeColumns,  } from '../../../utils/DataTableColumnsProvider';
import { useGetAllTransactionDetails } from '../../../api/Admin';

const LevelBenifits = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use the same transaction hook and filter for level benefits
  const { data: allTransactions, isLoading, isError } = useGetAllTransactionDetails();

  // Filter transactions to get only level benefits
  const levelBenefits = allTransactions?.filter((transaction: any) => {
    const isLevel = (
      transaction.type === 'level_benefit' ||
      transaction.transactionType === 'level' ||
      transaction.category === 'level_benefits' ||
      transaction.description?.toLowerCase().includes('level')
    );
    return isLevel;
  }) || [];

  // Aggregate level benefits by user
  const aggregatedData = levelBenefits.reduce((acc: any, curr: any) => {
    const memberId = curr.member_id || curr.related_member_id || 'N/A';
    if (!acc[memberId]) {
      acc[memberId] = {
        member_id: memberId,
        name: curr.Name || curr.name || curr.memberName || curr.member_name || '-',
        totalAmount: 0,
      };
    }
    acc[memberId].totalAmount += parseFloat(curr.ew_credit || curr.amount || 0);
    return acc;
  }, {});

  const finalData = Object.values(aggregatedData);

  const filteredData = finalData.filter((benefit: any) =>
    Object.values(benefit).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const noDataComponent = (
    <div style={{ padding: "24px" }}>
      {isError ? "Error loading data" : "No data available in table"}
    </div>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" sx={{ margin: "2rem", mt: 10 }}>
        Level Bonus
      </Typography>
      <Card sx={{ margin: "2rem", mt: 2 }}>
        <CardContent>
          <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>List of Level Bonus</div>
          <Box
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 200 }}
                />
              </Box>
              <DataTable
                columns={getAdminAggregatedIncomeColumns()}
                data={filteredData}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
                noDataComponent={noDataComponent}
              />
        </CardContent>
      </Card>
    </>
  );
};

export default LevelBenifits;