import DataTable from 'react-data-table-component';
import { Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DASHBOARD_CUTSOM_STYLE, getLevelBenifitsColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetTransactionDetails } from '../../../api/Memeber';

const LevelBenifits = () => {
  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
  } = useGetTransactionDetails();

  // Ensure transactions is always an array
  const transactions = Array.isArray(transactionsData?.data)
    ? transactionsData.data
    : Array.isArray(transactionsData)
      ? transactionsData
      : [];

  const levelBenefitsData = transactions
    .filter((transaction: any) => {
      if (!transaction || typeof transaction !== 'object') return false;

      const txType = transaction.transaction_type?.toLowerCase() || "";
      const benefitType = transaction.benefit_type?.toLowerCase() || "";

      // Allow all level-related transactions including ROI Level Bonus

      const matchesLevel =
        txType === 'level benefits' ||
        txType === 'roi level benefit' ||
        (benefitType.includes('level') && txType !== 'roi payout');

      return matchesLevel;
    })
    .map((transaction: any) => {
      // Helper for ordinal numbers (1st, 2nd, etc.)
      const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      let levelStr = transaction.description && transaction.description.toLowerCase().includes('level') 
          ? transaction.description 
          : transaction.level 
            ? `${getOrdinal(transaction.level)} Level Bonus` 
            : 'N/A';

      if (levelStr) {
        levelStr = levelStr.replace(/Level Benefits?/gi, 'Level Bonus');
        levelStr = levelStr.replace(/Benefit/gi, 'Bonus');
      }

      return {
        id: transaction._id || transaction.transaction_id,
        date: transaction.transaction_date,
        payoutLevel: levelStr,
        memberName: transaction.related_member_name || 'N/A',
        memberId: transaction.related_member_id || 'N/A',
        amount: transaction.ew_credit || '0',
        description: transaction.description,
        transactionType: transaction.transaction_type
      };
    });


  const noDataComponent = (
    <div style={{ padding: '24px' }}>
      No level bonus data available
    </div>
  );

  if (isError) {
    return (
      <Card sx={{ margin: '2rem', mt: 10 }}>
        <CardContent>
          <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}>
            Error loading level bonus data: {error?.message}
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
            List of Level Bonus ({levelBenefitsData.length})
          </AccordionSummary>
          <AccordionDetails>
            <DataTable
              columns={getLevelBenifitsColumns()}
              data={levelBenefitsData}
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

export default LevelBenifits;