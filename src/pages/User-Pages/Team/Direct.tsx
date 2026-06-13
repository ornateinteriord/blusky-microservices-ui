import DataTable from 'react-data-table-component';
import { Card, CardContent, TextField, CircularProgress } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getDirectColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetSponsers } from '../../../api/Memeber';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useSearch from '../../../hooks/SearchQuery';

import TokenService from '../../../api/token/tokenService';

const Direct = () => {
  const memberId = TokenService.getMemberId();
  const { data: sponsers, isLoading, isError, error } = useGetSponsers(memberId);

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError, error]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(sponsers?.sponsoredUsers || [])


  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
      <CardContent>
        <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>{!isLoading && `List of Direct (${sponsers?.sponsoredUsers?.length})`}</div>
          <DataTable
              columns={getDirectColumns()}
              data={filteredData}
              pagination
              progressPending={isLoading}
              progressComponent={
                <CircularProgress size={"4rem"} sx={{ color: "#0a2558" }} />
              }
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              customStyles={DASHBOARD_CUTSOM_STYLE}
              subHeader
              subHeaderComponent={
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0.5rem' }}>
                  <TextField
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              }
            />
      </CardContent>
    </Card>
  );
};

export default Direct;
