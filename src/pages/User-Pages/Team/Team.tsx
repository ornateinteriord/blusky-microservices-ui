
import DataTable from 'react-data-table-component';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { DASHBOARD_CUTSOM_STYLE, getMultiLevelColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetMultiLevelSponsorship } from '../../../api/Memeber';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Team = () => {
  const { data: multiLevelData, isLoading, isError, error } = useGetMultiLevelSponsorship();

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError, error]);

  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
      <CardContent>
        <div style={{ marginBottom: "1rem", color: "#000", fontWeight: "bold", fontSize: "1.25rem"     }}>{!isLoading && `Team (${multiLevelData?.length || 0} Levels)`}</div>
          <DataTable
              columns={getMultiLevelColumns()}
              data={multiLevelData || []}
              pagination
              progressPending={isLoading}
              progressComponent={
                <CircularProgress size={"4rem"} sx={{ color: "#04112F" }} />
              }
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30]}
              highlightOnHover
              customStyles={DASHBOARD_CUTSOM_STYLE}
            />
      </CardContent>
    </Card>
  );
};

export default Team;
