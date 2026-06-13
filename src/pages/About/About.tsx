import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Building2, Users, Target, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aboutBanner from "../../assets/about_banner.jpg";

const About = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "#0B2453", minHeight: "100vh", color: "white" }}>
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Button
                    startIcon={<ArrowLeft size={20} />}
                    onClick={() => navigate("/")}
                    sx={{
                        mt: 3,
                        mb: 3,
                        color: "#FFD700",
                        "&:hover": {
                            backgroundColor: "rgba(255, 215, 0, 0.1)",
                        },
                    }}
                >
                    Back to Home
                </Button>
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#FFD700",
                        }}
                    >
                        About Us
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.7)" sx={{ mb: 4 }}>
                        USDT.
                    </Typography>
                    <img 
                        src={aboutBanner} 
                        alt="About Us Banner" 
                        style={{ 
                            width: "100%", 
                            maxWidth: "800px", 
                            borderRadius: "20px", 
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            border: "1px solid rgba(255, 215, 0, 0.2)"
                        }} 
                    />
                </Box>

                <Paper elevation={3} sx={{ p: 4, mb: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255, 215, 0, 0.2)", color: "white" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#FFD700" }}>
                        Who We Are
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                        USDT (USDT) is a premier cooperative society dedicated to
                        providing comprehensive financial services to our valued members. Established with the vision of
                        financial inclusion and empowerment, we have been serving our community with integrity, transparency,
                        and excellence.
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                        Our society operates under the principles of cooperation, mutual assistance, and financial responsibility.
                        We are registered under the Cooperative Societies Act and are committed to maintaining the highest
                        standards of financial governance and member service.
                    </Typography>
                </Paper>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255, 215, 0, 0.2)", color: "white" }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Target size={32} style={{ color: "#FFD700", marginRight: "12px" }} />
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFD700" }}>
                                Our Mission
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            To provide accessible, reliable, and innovative financial services that empower our members
                            to achieve their financial goals while fostering a culture of savings, investment, and mutual growth.
                        </Typography>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255, 215, 0, 0.2)", color: "white" }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Award size={32} style={{ color: "#FFD700", marginRight: "12px" }} />
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFD700" }}>
                                Our Vision
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            To be the most trusted and preferred cooperative society, recognized for financial excellence,
                            member satisfaction, and contribution to the economic development of our community.
                        </Typography>
                    </Paper>
                </Box>

                <Paper elevation={3} sx={{ p: 4, mb: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255, 215, 0, 0.2)", color: "white" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Users size={32} style={{ color: "#FFD700", marginRight: "12px" }} />
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFD700" }}>
                            Our Values
                        </Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                        {[
                            { title: "Integrity", description: "We conduct our business with honesty and ethical principles" },
                            { title: "Transparency", description: "We maintain open and clear communication with all stakeholders" },
                            { title: "Member-Centric", description: "Our members' interests are at the heart of everything we do" },
                            { title: "Innovation", description: "We continuously improve our services through technology and best practices" },
                        ].map((value, index) => (
                            <Box key={index}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5, color: "#FFD700" }}>
                                    {value.title}
                                </Typography>
                                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    {value.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 4, background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)", color: "white", border: "1px solid rgba(255, 215, 0, 0.2)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Building2 size={32} style={{ marginRight: "12px", color: "#FFD700" }} />
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFD700" }}>
                            Registration Details
                        </Typography>
                    </Box>
                    <Typography variant="body1" paragraph>
                        <strong>Registration Number:</strong> DRP | 6112 | 21-22
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Address:</strong> Shop No. G6, Asha Chandra Trade Centre, Udupi, Karnataka
                    </Typography>
                    <Typography variant="body1">
                        <strong>Contact:</strong> +91 9004478100, 0820-7966887 | support@usdt.com
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default About;
