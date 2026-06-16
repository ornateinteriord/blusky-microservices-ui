import { useState } from 'react';
import { Box, Card, CardContent, TextField, Typography, CircularProgress } from '@mui/material';

import DataTable from "react-data-table-component";
import { DASHBOARD_CUTSOM_STYLE, getAdminAggregatedIncomeColumns,  } from '../../../utils/DataTableColumnsProvider';
import { useGetAllDailyPayouts } from '../../../api/Admin';

const SingleLevelIncomeAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Properly destructure the useQuery return values
  const { data: dailyBenefits, isLoading, isError } = useGetAllDailyPayouts();

  console.log(dailyBenefits);

  // Handle the data structure from API
  // Aggregate daily benefits by user
  const aggregatedData = dailyBenefits?.reduce((acc: any, curr: any) => {
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
  }, {}) || {};

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "1rem", mt: 10 }}>
        <Typography variant="h4">
          Single Level Income
        </Typography>
      </Box>

      <Card sx={{ margin: "1rem", mt: 2 }}>
        <CardContent>
          <div style={{ marginBottom: "1rem", color: "#000", fontWeight: "bold", fontSize: "1.25rem"     }}>Single Level Income Details</div>
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

export default SingleLevelIncomeAdmin;
