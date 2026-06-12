import DataTable from 'react-data-table-component';
import { Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation } from 'react-router-dom';
import { DASHBOARD_CUTSOM_STYLE, getLevelBenifitsColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetTransactionDetails } from '../../../api/Memeber';

const SingleLevelIncome = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const packageFilter = searchParams.get('package');

  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
  } = useGetTransactionDetails();

  const transactions = Array.isArray(transactionsData?.data)
    ? transactionsData.data
    : Array.isArray(transactionsData)
      ? transactionsData
      : [];

  const incomeData = transactions
    .filter((transaction: any) => {
      if (!transaction || typeof transaction !== 'object') return false;
      const txType = transaction.transaction_type?.toLowerCase() || "";
      let isSingleLevel = txType === "single line income" || txType === "single level income" || txType === "single leg income";
      
      if (isSingleLevel && packageFilter) {
        const descStr = transaction.description || "";
        if (!descStr.includes(`($${packageFilter})`)) {
          isSingleLevel = false;
        }
      }
      return isSingleLevel;
    })
    .map((transaction: any) => {
      let extractedMemberId = 'N/A';
      if (transaction.related_member_id) {
        extractedMemberId = transaction.related_member_id;
      } else if (transaction.description && transaction.description.includes('from ')) {
        extractedMemberId = transaction.description.split('from ')[1];
      }

      return {
        id: transaction._id || transaction.transaction_id,
        date: transaction.transaction_date,
        payoutLevel: transaction.transaction_type, // Map to Payout Level column
        memberName: transaction.related_member_name || '-',
        memberId: extractedMemberId,
        amount: ((parseFloat(transaction.ew_credit) || 0) + (parseFloat(transaction.uw_credit) || 0)).toFixed(2),
        description: transaction.description,
        transactionType: transaction.transaction_type
      };
    });

  const noDataComponent = (
    <div style={{ padding: '24px' }}>
      No Single Level Income data available
    </div>
  );

  if (isError) {
    return (
      <Card sx={{ margin: '2rem', mt: 10 }}>
        <CardContent>
          <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}>
            Error loading data: {error?.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
      <CardContent>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: '#0a2558',
              color: '#fff',
              '& .MuiSvgIcon-root': { color: '#fff' }
            }}
          >
            List of Single Level Income ({incomeData.length})
          </AccordionSummary>
          <AccordionDetails>
            <DataTable
              columns={getLevelBenifitsColumns()}
              data={incomeData}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              noDataComponent={noDataComponent}
              highlightOnHover
              progressPending={isLoading}
              subHeader
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
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SingleLevelIncome;
