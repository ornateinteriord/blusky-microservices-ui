import DataTable from 'react-data-table-component';
import { Card, CardContent, TextField, CircularProgress } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getUsedPackageColumns } from '../../../utils/DataTableColumnsProvider';
import { getUsedandUnusedPackages } from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../../../context/user/userContext';
import useSearch from '../../../hooks/SearchQuery';

const UsedPackage = () => {

  const memberId = TokenService.getMemberId();
  const { user } = useContext(UserContext);

  const { data: usedPackage, isLoading, error, isError } = getUsedandUnusedPackages({
    memberId: memberId,
    status: 'used'
  });
  useEffect(() => {
    if (isError) {
      const err = error as any;

      toast.error(
        err?.response.data.message || "Failed to fetch package details"
      );
    }
  }, [isError, error]);


  const { searchQuery, setSearchQuery, filteredData } = useSearch(usedPackage)



  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
      <CardContent>
        <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>List of Used Package</div>
          <DataTable
              columns={getUsedPackageColumns(user)}
              data={filteredData}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              subHeader
              progressPending={isLoading}
              progressComponent={<CircularProgress />}
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

export default UsedPackage;