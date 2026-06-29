import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Container, Grid, AppBar, Toolbar, IconButton, 
  Drawer, List, ListItem, ListItemText, Card
  // LinearProgress 
} from '@mui/material';
import { 
  Menu as MenuIcon, X as CloseIcon, TrendingUp, ShieldCheck, 
  Rocket
  // Users, Shield, Rocket as RocketLaunch, Pickaxe, 
  // LineChart, UserPlus, Fingerprint, Wallet, Activity
} from 'lucide-react';

const uwtLogo = "https://www.usdtworld.club/assets/images/usdtw.png";
const aboutImage = "https://www.usdtworld.club/assets/images/about_image.png";
const benefit1 = "https://www.usdtworld.club/assets/images/benefit1.png";
const benefit2 = "https://www.usdtworld.club/assets/images/benefit2.png";
const benefit3 = "https://www.usdtworld.club/assets/images/benefit3.png";
// const aboutSocial = "https://www.usdtworld.club/assets/images/about_social_vista.png";

const Home = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Countdown state
  // const [timeLeft, setTimeLeft] = useState({
  //   days: 60, hours: 14, minutes: 22, seconds: 45
  // });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft(prev => {
  //       if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
  //       if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
  //       if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
  //       if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
  //       return prev;
  //     });
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { title: "Home", id: "home" },
    // { title: "Token Sale", id: "token-sale" },
    { title: "Featured", id: "featured" },
    { title: "Benefits", id: "benefits" },
    { title: "Get Started", id: "get-started" },
    // { title: "Ecosystem", id: "ecosystem" },
    { title: "About", id: "about" },
  ];

  return (
    <Box sx={{ bgcolor: "#050916", color: "#ffffff", fontFamily: "'Space Grotesk', 'Inter', sans-serif", overflowX: 'hidden' }}>
      
      {/* NAVBAR */}
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          bgcolor: scrolled ? "rgba(5, 9, 22, 0.95)" : "transparent", 
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
          transition: "all 0.3s ease"
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
              <img src={uwtLogo} alt="USDT World" style={{ height: "45px", objectFit: "contain" }} />
              <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 800, letterSpacing: '-0.5px', display: { xs: 'none', sm: 'block' } }}>
                USDT WORLD
              </Typography>
            </Box>

            {/* Desktop Links */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 3, alignItems: "center" }}>
              {navLinks.map((link) => (
                <Typography key={link.title} sx={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#FFD700' }, transition: 'color 0.2s' }} onClick={() => scrollToSection(link.id)}>
                  {link.title}
                </Typography>
              ))}
            </Box>

            {/* Desktop Auth Buttons */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Button 
                onClick={() => window.location.href = '/login'}
                sx={{ color: "#ffffff", fontWeight: 600, '&:hover': { color: "#FFD700" } }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained" 
                onClick={() => window.location.href = '/register'}
                sx={{ 
                  bgcolor: "#FFD700", color: "#000000", fontWeight: 700, borderRadius: '50px', px: 3,
                  '&:hover': { bgcolor: "#E6C200", transform: 'translateY(-2px)' }, transition: 'all 0.2s' 
                }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { lg: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: { width: 280, bgcolor: "#0a1128", color: "#ffffff", borderLeft: "1px solid rgba(255,255,255,0.1)" } }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <img src={uwtLogo} alt="UWT Logo" style={{ height: "35px" }} />
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}><CloseIcon /></IconButton>
        </Box>
        <List sx={{ px: 2, py: 3 }}>
          {navLinks.map((link) => (
            <ListItem key={link.title} onClick={() => scrollToSection(link.id)} sx={{ borderRadius: "8px", mb: 1, '&:hover': { bgcolor: "rgba(255, 215, 0, 0.1)", color: '#FFD700' }, cursor: "pointer" }}>
              <ListItemText primary={link.title} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          ))}
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="outlined" onClick={() => window.location.href = '/login'} sx={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff", py: 1.5, borderRadius: '8px' }}>
              Sign In
            </Button>
            <Button variant="contained" onClick={() => window.location.href = '/register'} sx={{ bgcolor: "#FFD700", color: "#000", py: 1.5, borderRadius: '8px', fontWeight: 'bold' }}>
              Get Started
            </Button>
          </Box>
        </List>
      </Drawer>

      {/* HERO SECTION */}
      <Box id="home" sx={{ 
        pt: { xs: 15, md: 22 }, pb: { xs: 10, md: 15 }, position: 'relative',
        background: 'radial-gradient(circle at 50% 0%, rgba(26, 35, 126, 0.3) 0%, transparent 70%)'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', px: 2, py: 0.8, borderRadius: '50px', mb: 3, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFD700', mr: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '1px' }}>PRE-TOKEN SALE LIVE</Typography>
              </Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 800, lineHeight: 1.1, mb: 3 }}>
                Power the Future with <br/>
                <span style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.4)' }}>UWC+</span>
                <br/> Token Sale.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', mb: 5, maxWidth: '90%', lineHeight: 1.7 }}>
                Join the USDT World presale and secure your stake in a next-gen crypto launchpad ecosystem. Transparent pricing, real-time sale progress, and early access before public listing.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 6 }}>
                <Button variant="contained" onClick={() => navigate('/register')} sx={{ bgcolor: "#FFD700", color: "#000", px: 4, py: 1.8, borderRadius: '50px', fontWeight: 700, fontSize: '1rem', '&:hover': { bgcolor: "#E6C200" } }}>
                  Buy USDTW
                </Button>
                <Button variant="outlined" onClick={() => scrollToSection('token-sale')} sx={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff", px: 4, py: 1.8, borderRadius: '50px', fontWeight: 600, fontSize: '1rem', '&:hover': { borderColor: "#fff" } }}>
                  <Rocket size={18} style={{ marginRight: '8px' }} /> View Token Sale
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>$0.000139</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>USDTW Price</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>$25,555</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Funds Raised</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>60</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Days to Sale End</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', mx: 'auto' }}>
                <img src={aboutImage} alt="USDT World Platform" style={{ width: '100%' }} />
                
                {/* Floating Badges */}
                <Card sx={{ position: 'absolute', top: '10%', left: '-5%', bgcolor: 'rgba(10, 25, 41, 0.8)', backdropFilter: 'blur(10px)', p: 2, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', p: 1, borderRadius: '10px', color: '#FFD700' }}><TrendingUp size={24} /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Daily Profit</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFD700' }}>+15.4%</Typography>
                  </Box>
                </Card>

                <Card sx={{ position: 'absolute', bottom: '15%', right: '-5%', bgcolor: 'rgba(10, 25, 41, 0.8)', backdropFilter: 'blur(10px)', p: 2, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', p: 1, borderRadius: '10px', color: '#FFD700' }}><ShieldCheck size={24} /></Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Secured</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFD700' }}>100%</Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* TOKEN SALE COUNTDOWN */}
      {/* <Box id="token-sale" sx={{ py: 12, bgcolor: '#030612' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', p: { xs: 3, md: 5 }, textAlign: 'center', position: 'relative', overflow: 'visible' }}>
                <Box sx={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', bgcolor: '#FFD700', color: '#000', px: 3, py: 1, borderRadius: '50px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunch size={18} /> Pre Token Sale
                </Box>
                
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, mt: 2 }}>Ends In</Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 3 }, mb: 4 }}>
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <Box key={unit} sx={{ textAlign: 'center' }}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', width: { xs: 60, sm: 80 }, height: { xs: 70, sm: 90 }, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
                          {value.toString().padStart(2, '0')}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize', mt: 1, display: 'block' }}>{unit}</Typography>
                    </Box>
                  ))}
                </Box>

                <Typography sx={{ mb: 1, fontWeight: 600, color: '#ffffff' }}>Price 1 (USDTW) = $0.000139 per (USD)</Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Total Raise: <strong style={{color:'#fff'}}>25,555 USD (26%)</strong></Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Target: <strong style={{color:'#fff'}}>100,000 USD</strong></Typography>
                </Box>
                <LinearProgress variant="determinate" value={26} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#FFD700', borderRadius: 5 } }} />
                
                <Button variant="contained" onClick={() => navigate('/register')} fullWidth sx={{ mt: 5, bgcolor: '#FFD700', color: '#000', py: 1.5, borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', '&:hover': { bgcolor: '#E6C200' } }}>
                  Buy Token
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Token Sale <br/>Countdown</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, lineHeight: 1.8 }}>
                A token sale countdown creates urgency and drives investor interest before launch. It helps your community stay informed, builds trust through transparency, and prepares participants for the official sale window.
              </Typography>

              <Grid container spacing={3}>
                {['Investment Opportunity', 'Time Sensitivity', 'Community Engagement', 'Market Awareness'].map((feat, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', p: 1, borderRadius: '8px' }}>
                        <ShieldCheck size={20} />
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{feat}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box> */}

      {/* FEATURED PROJECTS */}
      <Box id="featured" sx={{ py: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography sx={{ color: '#FFD700', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2 }}>Top Picks</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Featured Projects</Typography>
          </Box>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
               {/* Just a stylized list of tickers to represent the visual */}
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', mx: 'auto' }}>
                  {[
                    { pair: 'BTC / USD', val: '$67,256', chg: '+2.4%', up: true },
                    { pair: 'ETH / USD', val: '$3,604', chg: '+1.8%', up: true },
                    { pair: 'USDT / USD', val: '$1.00', chg: '-0.01%', up: false },
                    { pair: 'USDTW', val: '$0.000139', chg: '+8.2%', up: true, highlight: true },
                  ].map((ticker, i) => (
                    <Card key={i} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: ticker.highlight ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255,255,255,0.03)', border: ticker.highlight ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{ticker.pair}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>{ticker.val}</Typography>
                      </Box>
                      <Typography sx={{ color: ticker.up ? '#FFD700' : '#ef4444', fontWeight: 700, bgcolor: ticker.up ? 'rgba(255, 215, 0, 0.1)' : 'rgba(239, 68, 68, 0.1)', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                        {ticker.chg}
                      </Typography>
                    </Card>
                  ))}
               </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', p: { xs: 3, md: 5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <img src={uwtLogo} alt="USDTW" style={{ height: '60px', width: '60px', borderRadius: '50%', background: '#fff', padding: '5px' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFD700' }}>UWC+</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>USDT World Token Ecosystem</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFD700' }}>60</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Days Left</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>Description</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>USDT World disrupts traditional finance through decentralized applications (dApps) and smart contracts built for modern traders.</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>Key Features</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Decentralized applications (dApps) and smart contracts. Yield farming and liquidity provision. Decentralized exchanges.</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)', p: 2, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: '#fff' }}>Token Price</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#FFD700' }}>1 USDTW = $0.000139 USD</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* LAUNCHPAD BENEFITS */}
      <Box id="benefits" sx={{ py: 12, bgcolor: '#030612' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography sx={{ color: '#FFD700', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2 }}>Launchpad Benefits</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>The Benefits of Using a <span style={{ color: '#FFD700' }}>Crypto Launchpad</span></Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              { img: benefit1, title: 'Access to Vetted Projects', desc: 'Access to vetted projects guarantees investors a curated selection of credible and high-quality opportunities, reducing the risk of fraudulent or low-quality investments.' },
              { img: benefit2, title: 'Early Investment Opportunities', desc: 'Early investment opportunities provide access to promising projects before they gain widespread attention, potentially offering significant returns on investment.' },
              { img: benefit3, title: 'Community and Support', desc: 'Community and support networks foster collaboration, knowledge sharing, and mutual assistance within the cryptocurrency ecosystem.' }
            ].map((benefit, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', p: 4, height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: 'rgba(255, 215, 0, 0.3)' } }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>{benefit.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, flexGrow: 1, lineHeight: 1.7 }}>{benefit.desc}</Typography>
                  <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                    <img src={benefit.img} alt={benefit.title} style={{ maxWidth: '80%', height: 'auto' }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* QUICK START */}
      {/* <Box id="get-started" sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography sx={{ color: '#FFD700', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2 }}>Quick Start</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>How to Get <span style={{ color: '#FFD700' }}>Started</span></Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { icon: <UserPlus size={32}/>, title: 'Create Account', desc: 'Create your account today to unlock a world of possibilities in the cryptocurrency and decentralized finance space.' },
              { icon: <Fingerprint size={32}/>, title: 'Verify Your Identity', desc: 'Complete the identity verification process to ensure compliance and unlock full access to our platform\'s features.' },
              { icon: <Wallet size={32}/>, title: 'Deposit Funds', desc: 'To begin investing, deposit funds securely into your account and start exploring our wide range of cryptocurrency opportunities.' },
              { icon: <LineChart size={32}/>, title: 'Start Trading', desc: 'Start trading today to take advantage of the dynamic cryptocurrency market and seize opportunities for growth and profit.' }
            ].map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', p: 4, height: '100%', textAlign: 'center' }}>
                  <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>{step.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{step.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      {/* ECOSYSTEM */}
      {/* <Box id="ecosystem" sx={{ py: 12, bgcolor: '#030612' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8, maxWidth: '800px', mx: 'auto' }}>
            <Typography sx={{ color: '#FFD700', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2 }}>Our Ecosystem</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>USDT World Ecosystem <span style={{ color: '#FFD700' }}>for Everyone</span></Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              USDT World ecosystem embodies a dynamic and inclusive landscape, redefining decentralized finance (DeFi) with innovative platforms and a user-centric approach built for modern traders.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              { icon: <Activity size={40}/>, title: 'Token Trading', desc: 'Token trading enables users to seamlessly exchange cryptocurrencies and tokens, facilitating efficient portfolio management and market participation.' },
              { icon: <Pickaxe size={40}/>, title: 'Liquidity Provision', desc: 'Liquidity provision on our platform facilitates market efficiency by enabling users to contribute assets to pools and earn rewards through liquidity mining.' },
              { icon: <Rocket size={40}/>, title: 'Token Launchpad', desc: 'Our token launchpad offers a platform for new cryptocurrency projects to raise capital and gain exposure, fostering innovation and growth within the crypto ecosystem.' }
            ].map((eco, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', p: 4, height: '100%', textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: 'rgba(255, 215, 0, 0.3)' } }}>
                  <Box sx={{ color: '#FFD700', mb: 4 }}>
                    {eco.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>{eco.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{eco.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      {/* ABOUT */}
      {/* <Box id="about" sx={{ py: 12 }}>
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', p: 2 }}>
                <img src={aboutSocial} alt="About USDT World" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
                <Card sx={{ position: 'absolute', bottom: '10%', right: '-5%', bgcolor: 'rgba(10, 25, 41, 0.9)', backdropFilter: 'blur(10px)', p: 3, borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.3)', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFD700', mb: 0.5 }}>USDTW</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Native Token</Typography>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: '#FFD700', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2 }}>About USDTW</Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>The Token Behind <span style={{ color: '#FFD700' }}>USDT World</span></Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, fontSize: '1.1rem', lineHeight: 1.8 }}>
                USDTW powers the USDT World launchpad ecosystem — from presale access and staking rewards to governance and platform utility across token trading, liquidity, and new project launches.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ minWidth: 60, height: 60, borderRadius: '16px', bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={28} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>Early Presale Access</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Secure USDTW at $0.000139 before public listing and benefit from early-bird pricing.</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ minWidth: 60, height: 60, borderRadius: '16px', bgcolor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={28} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>Launchpad Utility</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Use USDTW to participate in vetted token launches, liquidity pools, and ecosystem rewards.</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box> */}
      
      {/* Footer handles it's own global layout in App.tsx */}
    </Box>
  );
};

export default Home;
