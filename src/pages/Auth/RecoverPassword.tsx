import { Box, Card, CardContent, Container } from '@mui/material';
import LogBg from "../../assets/log_bg.jpg"; // Import the logo
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { useNavigate } from 'react-router-dom';

const RecoverPassword = () => {
  const navigate = useNavigate();

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            backgroundImage: `url(${LogBg})`, // Dark semi-transparent background
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <CardContent sx={{ padding: "2rem" }}>
            <ForgotPasswordForm onBackToLogin={() => navigate('/login')} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RecoverPassword;
