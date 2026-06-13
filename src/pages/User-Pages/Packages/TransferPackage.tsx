import React, { useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent,  } from '@mui/material';
import { MuiDatePicker } from '../../../components/common/DateFilterComponent';
import { useGetSponserRef } from '../../../api/Auth';
import { useTransferPackage } from '../../../api/Memeber';

const TransferPackage: React.FC = () => {
  const [formData, setFormData] = useState({
    transfered_on: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
    quantity: 1,
    transfered_to: '',
  });
  const [userName, setUserName] = useState<string | null>('')

  const { data: memberdata, isError, error, refetch } = useGetSponserRef(formData.transfered_to);
  const transferPackage = useTransferPackage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setUserName(null);
  };

  useEffect(() => {
    if (memberdata && !isError) {
      setUserName(memberdata.name);
    } else if (isError && error instanceof Error) {
      setUserName(null);
    }
  }, [memberdata, isError, error]);

  const handleTransferedToBlur = () => {
    if (formData.transfered_to) {
      refetch();
    }
  };

  const handleSubmit = () => {
    transferPackage.mutate(formData);
  };

  return (
    <Card sx={{ margin: '2rem', mt: 10, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <CardContent>
        <div>
          <div style={{ marginBottom: "1rem", backgroundColor: "#0a2558", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
            Transfer Package Details
          </div>
          <div style={{ padding: "0 1rem 1rem 1rem" }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <MuiDatePicker
                date={formData.transfered_on}
                setDate={(date) => setFormData((prev) => ({ ...prev, transfered_on: date }))}
                label="Transfer Date"
              />
              <TextField
                label="Package Qty"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#0a2558',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0a2558',
                    }
                  }
                }}
              />
              <TextField
                label="Transfered To"
                name="transfered_to"
                value={formData.transfered_to}
                onChange={handleInputChange}
                onBlur={handleTransferedToBlur}
                fullWidth
                variant="outlined"
                placeholder="Enter transfer recipient"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#0a2558',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0a2558',
                    }
                  }
                }}
              />
              {userName && <p style={{ color: 'green' }}>{userName}</p>}
              <p style={{ color: 'red' }}>{isError && error instanceof Error && error.message}</p>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#0a2558',
                  alignSelf: 'flex-end',
                  '&:hover': {
                    backgroundColor: '#581c87'
                  }
                }}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferPackage;
