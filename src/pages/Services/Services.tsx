import { Box, Container, Typography, Grid } from '@mui/material';

const services = [
  {
    title: 'Property Purchases',
    description: 'Explore exclusive properties and real estate opportunities tailored to your needs. Whether you are looking for a luxurious new home, a prime commercial space, or a lucrative investment opportunity, we offer dedicated assistance every step of the way.',
    features: [
      'Access to premium, off-market real estate listings',
      'End-to-end purchasing and legal documentation support',
      'Expert market analysis and investment consultations',
      'Dedicated relationship managers to guide your decisions'
    ],
    images: [
      'https://picsum.photos/id/1015/800/600', // landscape
      'https://picsum.photos/id/1029/800/600', // architecture
      'https://picsum.photos/id/1040/800/600', // house
      'https://picsum.photos/id/122/800/600'   // street
    ]
  },
  {
    title: 'Gold Purchase',
    description: 'Invest in premium quality gold and precious metals with complete confidence. Secure your wealth and diversify your portfolio with our trusted, certified gold purchasing programs designed for long-term stability.',
    features: [
      '24k Hallmark certified pure physical gold',
      'Highly secure storage and vaulting options',
      'Real-time market tracking and pricing insights',
      'Flexible investment plans tailored for your portfolio'
    ],
    images: [
      '/assets/gold_bars.png',
      '/assets/gold_coins.png',
      '/assets/gold_vault.png',
      '/assets/gold_nuggets.png'
    ]
  },
  {
    title: 'Electronic Equipments & Gadgets',
    description: 'Access the latest electronics, high-end consumer gadgets, and smart appliances. Stay ahead of the technology curve with exclusive deals, premium products, and comprehensive extended warranties on top global brands.',
    features: [
      'Latest smartphones, laptops, and premium gadgets',
      'Exclusive member pricing and early access to launches',
      'Comprehensive warranties and after-sales support',
      'Smart home integration and setup services'
    ],
    images: [
      'https://picsum.photos/id/0/800/600', // laptop
      'https://picsum.photos/id/1/800/600', // computer
      'https://picsum.photos/id/119/800/600', // macbook
      'https://picsum.photos/id/160/800/600' // phone
    ]
  },
  {
    title: 'Vehicle Purchase',
    description: 'Discover seamless ways to purchase your dream vehicle. We offer comprehensive solutions for buying new and premium pre-owned automobiles, taking the hassle out of dealership visits and financing paperwork.',
    features: [
      'Extensive catalog of luxury and everyday vehicles',
      'Competitive financing rates and tailored loan structures',
      'Comprehensive pre-purchase inspection on used vehicles',
      'Hassle-free registration and doorstep delivery'
    ],
    images: [
      'https://picsum.photos/id/1071/800/600', // car/vehicle related
      'https://picsum.photos/id/1072/800/600', // car
      'https://picsum.photos/id/133/800/600', // cars
      'https://picsum.photos/id/183/800/600' // vw bug
    ]
  },
];

const Services = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={{ xs: 6, md: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1e3a8a', mb: { xs: 2, md: 3 }, mt: { xs: 2, md: 0 }, fontSize: { xs: '2rem', md: '3.5rem' } }}>
            Our Premium Services
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '800px', mx: 'auto', fontWeight: 400, lineHeight: 1.6, px: { xs: 2, md: 0 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            We provide a diverse range of exclusive services designed to elevate your lifestyle and secure your future. Explore our offerings below.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 10 } }}>
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <Grid container spacing={{ xs: 4, md: 6 }} key={index} alignItems="center" direction={isEven ? 'row' : 'row-reverse'}>
                {/* Content Side */}
                <Grid item xs={12} lg={5}>
                  <Box sx={{ pr: isEven ? { lg: 4 } : 0, pl: !isEven ? { lg: 4 } : 0 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: { xs: 2, md: 3 }, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#475569', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8, mb: { xs: 3, md: 4 } }}>
                      {service.description}
                    </Typography>
                    
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                      {service.features.map((feature, fIndex) => (
                        <Box component="li" key={fIndex} sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 1.5, md: 2 } }}>
                          <Box sx={{ 
                            color: '#2563eb', 
                            mr: 2, 
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(37, 99, 235, 0.1)'
                          }}>
                            ✓
                          </Box>
                          <Typography sx={{ color: '#334155', fontWeight: 500, fontSize: '1.05rem' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Images Grid Side */}
                <Grid item xs={12} lg={7}>
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: 2,
                      '& > div': {
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        position: 'relative',
                        paddingTop: '75%', // 4:3 aspect ratio
                      },
                      '& img': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      },
                      '& > div:hover img': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    {service.images.map((img, iIndex) => (
                      <Box key={iIndex} sx={{
                        // Add some visual interest by shifting the second column down slightly
                        transform: iIndex % 2 !== 0 ? 'translateY(16px)' : 'none'
                      }}>
                        <img src={img} alt={`${service.title} ${iIndex + 1}`} loading="lazy" />
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
