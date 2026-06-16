import DataTable from 'react-data-table-component';
import { Card, CardContent, TextField, CircularProgress } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getUnUsedPackageColumns } from '../../../utils/DataTableColumnsProvider';
import TokenService from '../../../api/token/tokenService';
import { getUsedandUnusedPackages } from '../../../api/Memeber';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../../../context/user/userContext';
import useSearch from '../../../hooks/SearchQuery';

const UnUsedPackage = () => {

  const memberId = TokenService.getMemberId();
  const { user } = useContext(UserContext);
  const { data: unUsedPackages, isLoading, error, isError } = getUsedandUnusedPackages({
    memberId: memberId,
    status: 'active'
  });

  useEffect(() => {
    if (isError) {
      const err = error as any;

      toast.error(
        err?.response.data.message || "Failed to fetch package details"
      );
    }
  }, [isError, error]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(unUsedPackages)


  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
      <CardContent>
        <div style={{ marginBottom: "1rem", color: "#000", fontWeight: "bold", fontSize: "1.25rem"     }}>List of Unused Package</div>
          <DataTable
              columns={getUnUsedPackageColumns(user)}
              data={filteredData}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              progressPending={isLoading}
              progressComponent={<CircularProgress />}
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

export default UnUsedPackage