import { Box, Container, Typography, Grid, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                background: "linear-gradient(135deg, #0a2558 0%, #0f172a 50%, #020617 100%)",
                color: "white",
                pt: { xs: 4, md: 6 },
                pb: { xs: 3, md: 4 },
                mt: 0,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Subtle background glow effect */}
            <Box sx={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    {/* Branding Section */}
                    <Grid item xs={12} lg={4}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                mb: 3,
                                background: "linear-gradient(to right, #fff, #94a3b8)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-1px",
                                lineHeight: 1.1
                            }}
                        >
                            USDT WORLD CLUB
                        </Typography>
                        <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "inline-block", mb: 2 }}>
                            <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: "1px", color: "#60a5fa" }}>
                                www.usdtworld.club
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ opacity: 0.6, fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "400px" }}>
                            A next-generation crypto trading and investment company dedicated to transforming digital wealth creation.
                        </Typography>
                    </Grid>

                    {/* Links & Info Grouped */}
                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={3}>
                            {/* Location Section */}
                            <Grid item xs={12} sm={4}>
                                <Typography variant="overline" sx={{ fontWeight: 900, mb: 3, display: "block", color: "#3b82f6", letterSpacing: "2px" }}>
                                    Visit Us
                                </Typography>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <MapPin size={24} color="#60a5fa" style={{ flexShrink: 0 }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>Head Office</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>
                                            United Kingdom &<br />
                                            Dubai, UAE
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Contact Section removed */}
                            {/* Connect Section */}
                            <Grid item xs={12} sm={4}>
                                <Typography variant="overline" sx={{ fontWeight: 900, mb: 3, display: "block", color: "#3b82f6", letterSpacing: "2px" }}>
                                    Follow Us
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                        <IconButton
                                            key={idx}
                                            sx={{
                                                color: "white",
                                                bgcolor: "rgba(255,255,255,0.03)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                                "&:hover": {
                                                    bgcolor: "#3b82f6",
                                                    color: "white",
                                                    transform: "translateY(-5px) rotate(8deg)",
                                                    boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)"
                                                },
                                            }}
                                        >
                                            <Icon size={20} />
                                        </IconButton>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: "rgba(255,255,255,0.06)" }} />

                {/* Bottom Bar */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: { xs: 1.5, md: 2 },
                    }}
                >
                    <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 600 }}>
                        © {currentYear} USDT WORLD CLUB. All rights reserved.
                    </Typography>

                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 5 }, flexWrap: "wrap", justifyContent: "center" }}>
                        {[
                            { label: "About Us", path: "/about" },
                            // { label: "Privacy Policy", path: "/privacy-policy" },
                            // { label: "Terms & Conditions", path: "/terms" },
                            // { label: "Refund Policy", path: "/refund-policy" }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "0.8rem",
                                    opacity: 0.5,
                                    fontWeight: 700,
                                    transition: "all 0.3s ease",
                                    borderBottom: "1px solid transparent"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.color = "#60a5fa";
                                    e.currentTarget.style.borderBottomColor = "#60a5fa";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0.5";
                                    e.currentTarget.style.color = "white";
                                    e.currentTarget.style.borderBottomColor = "transparent";
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;

