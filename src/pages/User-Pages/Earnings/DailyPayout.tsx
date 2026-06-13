import DataTable from 'react-data-table-component';
import { Card, CardContent, TextField } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getDailyPayoutColumns } from '../../../utils/DataTableColumnsProvider';
import TokenService from '../../../api/token/tokenService';
import { useGetDailyPayout } from '../../../api/Memeber';

const DailyPayout = () => {

  const memberId = TokenService.getMemberId();
  const { data = [] } = useGetDailyPayout(memberId);

  console.log('Daily Payout Data:', data);

  const noDataComponent = <div style={{ padding: '24px' }}>No data available in table</div>;

  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
      <CardContent>
        <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>Daily ROI Details</div>
          <DataTable
              columns={getDailyPayoutColumns()}
              data={data}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              noDataComponent={noDataComponent}
              subHeader
              highlightOnHover
              subHeaderComponent={
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0.5rem' }}>
                  <TextField
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                  />
                </div>
              }
            />
      </CardContent>
    </Card>
  );
};

export default DailyPayout;
