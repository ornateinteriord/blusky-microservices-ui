import { Container, Typography, Box, Grid, Card, Button } from '@mui/material';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicLoan = () => {
    const navigate = useNavigate();

    const loans = [
        {
            title: "Personal Loan",
            desc: "Quick and easy personal loans to meet your immediate financial requirements with minimal documentation and fast approval.",
            features: ["Fast Approval", "Minimal Documentation", "Flexible Repayment", "Competitive Interest Rates"],
            image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Business Loan",
            desc: "Expand your business with our customized loan options. We provide capital for operations, equipment, or expansion.",
            features: ["High Loan Amounts", "Customized Solutions", "Dedicated Support", "No Hidden Charges"],
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Home Loan",
            desc: "Turn your dream of owning a home into reality with our flexible and affordable home loan plans tailored for you.",
            features: ["Low Interest Rates", "Long Tenure Options", "Easy Processing", "Balance Transfer Facility"],
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Car Loan",
            desc: "Drive home your dream car today. We offer competitive rates on both new and pre-owned vehicle loans.",
            features: ["Up to 100% Funding", "Quick Processing", "Flexible Tenure", "Pre-approved Offers"],
            image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Education Loan",
            desc: "Invest in your future. Our education loans cover tuition fees, accommodation, and other related expenses.",
            features: ["Covers 100% Expenses", "Grace Period Available", "Simple Documentation", "Tax Benefits"],
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", color: "#1e293b", pb: 12 }}>
            
            {/* HERO SECTION */}
            <Box sx={{ bgcolor: '#1e3a8a', color: 'white', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                        Our <span style={{ color: '#93c5fd' }}>Loan Products</span>
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
                        Flexible financing solutions designed to help you achieve your personal and business goals.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 8 }}>
                <Grid container spacing={4}>
                    {loans.map((loan, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card sx={{ borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                <Box sx={{ height: 200, overflow: 'hidden' }}>
                                    <img src={loan.image} alt={loan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0f172a' }}>{loan.title}</Typography>
                                    <Typography sx={{ color: '#64748b', mb: 3, lineHeight: 1.6 }}>{loan.desc}</Typography>
                                    
                                    <Box sx={{ mb: 4, flexGrow: 1 }}>
                                        {loan.features.map((feature, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                <CheckCircle2 size={18} color="#2563eb" />
                                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>{feature}</Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Button 
                                        variant="outlined" 
                                        onClick={() => navigate('/login')}
                                        endIcon={<ArrowRight size={18} />}
                                        sx={{ borderColor: '#1e3a8a', color: '#1e3a8a', py: 1.5, borderRadius: '8px', fontWeight: 700, '&:hover': { bgcolor: '#1e3a8a', color: 'white' } }}
                                    >
                                        Apply Now
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PublicLoan;
