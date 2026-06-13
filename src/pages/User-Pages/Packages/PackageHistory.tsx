import { Card, CardContent, TextField } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useMediaQuery } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getUserPackageHistoryColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetPackagehistory } from '../../../api/Memeber';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useSearch from '../../../hooks/SearchQuery';

const PackageHistory = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { data: historyData, isLoading, isError, error } = useGetPackagehistory();
  const { filteredData, searchQuery, setSearchQuery } = useSearch(historyData);

  useEffect(() => {
    const err = error as any;
    if (isError) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  }, [isError, error]);

  return (
    <Card sx={{
      margin: isMobile ? '1rem' : '2rem',
      backgroundColor: '#fff',
      mt: 10
    }}>
      <CardContent sx={{ padding: isMobile ? '12px' : '24px' }}>
        <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>Package History</div>
          <DataTable
              columns={getUserPackageHistoryColumns()}
              data={filteredData}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={isMobile ? 10 : 25}
              paginationRowsPerPageOptions={isMobile ? [10, 20, 50] : [25, 50, 100]}
              highlightOnHover
              progressPending={isLoading}
              progressComponent={<CircularProgress />}
              noDataComponent={<div>No data found</div>}
              responsive
              subHeader
              subHeaderComponent={
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: isMobile ? '0.25rem' : '0.5rem' }}>
                  <TextField
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </div>
              }
            />
      </CardContent>
    </Card>
  );
};

export default PackageHistory;
