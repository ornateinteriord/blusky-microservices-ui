import { Box, Typography, Button, Container, Grid, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import uwtLogo from "../../assets/USDT1.png";
import slider1 from "../../assets/slider1.png";
import slider2 from "../../assets/slider2.png";
import slider3 from "../../assets/slider3.png";
import slider4 from "../../assets/slider4.png";

const slides = [slider1, slider2, slider3, slider4];

const Home = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { title: "Home", action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { title: "About", action: () => navigate("/about") },
  ];

  return (
    <Box sx={{ bgcolor: "#0a2558", minHeight: "100vh", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
      {/* Landing Navbar */}
      <AppBar position="fixed" sx={{ bgcolor: "rgba(10, 37, 88, 0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255, 215, 0, 0.2)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={uwtLogo} alt="UWT Logo" style={{ height: "60px", objectFit: "contain" }} />
          </Box>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Typography key={link.title} sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { color: '#FFD700' } }} onClick={link.action}>
                {link.title}
              </Typography>
            ))}
          </Box>

          {/* Desktop Auth Buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ borderColor: "#FFD700", color: "#FFD700", '&:hover': { bgcolor: "rgba(255, 215, 0, 0.1)" } }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/register')}
              sx={{ bgcolor: "#FFD700", color: "#000000", fontWeight: "bold", '&:hover': { bgcolor: "#e6c200" } }}
            >
              Register
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, color: "#FFD700" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        PaperProps={{
          sx: { width: 250, bgcolor: "rgba(10, 37, 88, 0.95)", backdropFilter: "blur(10px)", color: "#ffffff", borderLeft: "1px solid rgba(255, 215, 0, 0.2)" }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid rgba(255, 215, 0, 0.1)", mb: 2 }}>
          <img src={uwtLogo} alt="UWT Logo" style={{ height: "40px", objectFit: "contain" }} />
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#FFD700" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {navLinks.map((link) => (
            <ListItem key={link.title} onClick={() => { link.action(); handleDrawerToggle(); }} sx={{ borderRadius: "8px", mb: 1, '&:hover': { bgcolor: "rgba(255, 215, 0, 0.1)" }, cursor: "pointer" }}>
              <ListItemText primary={link.title} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          ))}
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => { navigate('/login'); handleDrawerToggle(); }}
              sx={{ borderColor: "#FFD700", color: "#FFD700", '&:hover': { bgcolor: "rgba(255, 215, 0, 0.1)" } }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => { navigate('/register'); handleDrawerToggle(); }}
              sx={{ bgcolor: "#FFD700", color: "#000000", fontWeight: "bold", '&:hover': { bgcolor: "#e6c200" } }}
            >
              Register
            </Button>
          </Box>
        </List>
      </Drawer>

      {/* Hero Section */}
      <Box sx={{ position: "relative", overflow: "hidden", pt: { xs: 30, md: 40 }, pb: { xs: 15, md: 20 }, px: 2, textAlign: "center" }}>
        {/* Background Slider */}
        <Box 
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${slides[currentSlide]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 1s ease-in-out",
            zIndex: 0
          }}
        />
        {/* Lighter gradient overlay for better image visibility while keeping text readable */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, rgba(10,37,88,0.3) 0%, rgba(5,5,5,0.7) 100%)", zIndex: 1 }} />
        
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "#FFD700", mb: 4, textShadow: "0 4px 20px rgba(255, 215, 0, 0.3)", fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" } }}>
            USDT WORLD CLUB
          </Typography>
          <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.9)", mb: 6, lineHeight: 1.6, fontWeight: 300, fontSize: { xs: "1.1rem", md: "1.5rem" } }}>
            Welcome to the world's largest trading investment and trading platform creating a solution for dream millionaires by integration with blockchain.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 3 }, justifyContent: "center" }}>
            <Button 
              variant="contained" 
              size="large"
              fullWidth={false}
              onClick={() => navigate('/register')}
              sx={{ bgcolor: "#FFD700", color: "#000000", px: { xs: 4, md: 6 }, py: 1.5, fontSize: "1.1rem", fontWeight: 800, borderRadius: "30px", textTransform: "uppercase", '&:hover': { bgcolor: "#e6c200", transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(255, 215, 0, 0.3)" }, transition: "all 0.3s ease", width: { xs: '100%', sm: 'auto' } }}
            >
              JOIN US TODAY !!
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              fullWidth={false}
              onClick={() => navigate('/login')}
              sx={{ borderColor: "rgba(255, 255, 255, 0.3)", color: "#ffffff", px: { xs: 4, md: 6 }, py: 1.5, fontSize: "1.1rem", fontWeight: 800, borderRadius: "30px", textTransform: "uppercase", '&:hover': { borderColor: "#FFD700", color: "#FFD700" }, transition: "all 0.3s ease", width: { xs: '100%', sm: 'auto' } }}
            >
              Member Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Company Overview Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 0 }, bgcolor: "#050505" }} id="service">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: "#FFD700", fontWeight: 800, letterSpacing: "2px", mb: 2, display: "block", textAlign: { xs: "center", md: "left" } }}>COMPANY OVERVIEW</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#ffffff", mb: 4, fontSize: { xs: "2rem", md: "3rem" }, textAlign: { xs: "center", md: "left" } }}>
                A Next-Generation Crypto Trading Company
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 3, fontSize: "1.1rem", lineHeight: 1.8, textAlign: { xs: "center", md: "left" } }}>
                Registered in the United Kingdom and operated from Dubai, UAE, USDT World Club is dedicated to transforming digital wealth creation.
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 4, fontSize: "1.1rem", lineHeight: 1.8, textAlign: { xs: "center", md: "left" } }}>
                We specialize in AI-powered Crypto Trading, DeFi & Staking Solutions, and Secure Wallet & Token Ecosystems.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: "20px", background: "linear-gradient(145deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.01) 100%)", border: "1px solid rgba(255, 215, 0, 0.1)" }}>
                <Typography variant="h5" sx={{ color: "#FFD700", fontWeight: 700, mb: 3, textAlign: { xs: "center", md: "left" } }}>Our Mission</Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8, textAlign: { xs: "center", md: "left" } }}>
                  To provide a secure, transparent, and rewarding investment ecosystem that empowers individuals to grow their wealth through cryptocurrency and digital assets. We bring together advanced technology, expert strategies, and a community-driven approach to ensure long-term growth and financial freedom for our members.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer is rendered globally in App.tsx */}
    </Box>
  );
};

export default Home;
