import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD700", // Gold
      contrastText: "#0a2558", // Black text on gold background
    },
    secondary: {
      main: "#0a2558",
      contrastText: "#FFD700",
    },
    background: {
      default: "#0a2558", // Very dark grey/black
      paper: "#0a2558", // Slightly lighter for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    error: {
      main: "#ff4444",
    },
    success: {
      main: "#00C851",
    },
    warning: {
      main: "#ffbb33",
    },
    info: {
      main: "#33b5e5",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 24px",
          transition: "all 0.3s ease-in-out",
        },
        contained: {
          backgroundColor: "#FFD700",
          color: "#0a2558",
          "&:hover": {
            backgroundColor: "#e6c200",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(255, 215, 0, 0.3)",
          },
        },
        outlined: {
          borderColor: "#FFD700",
          color: "#FFD700",
          "&:hover": {
            backgroundColor: "rgba(255, 215, 0, 0.1)",
            borderColor: "#FFD700",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a2558",
          borderRadius: "16px",
          border: "1px solid rgba(255, 215, 0, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a2558",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a2558",
          borderBottom: "1px solid rgba(255, 215, 0, 0.2)",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0a2558",
          borderRight: "1px solid rgba(255, 215, 0, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 215, 0, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFD700",
            },
          },
        },
      },
    },
  },
});
