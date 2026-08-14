import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0284C7", // Light Blue
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0F172A", // Dark Slate/Navy
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC", // Light Gray/Off-white
      paper: "#FFFFFF", // White
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
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
          backgroundColor: "#0284C7",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0369A1",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(2, 132, 199, 0.3)",
          },
        },
        outlined: {
          borderColor: "#0284C7",
          color: "#0284C7",
          "&:hover": {
            backgroundColor: "rgba(2, 132, 199, 0.1)",
            borderColor: "#0284C7",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "none",
          color: "#0F172A",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          color: "#0F172A",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#CBD5E1",
            },
            "&:hover fieldset": {
              borderColor: "rgba(2, 132, 199, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0284C7",
            },
          },
        },
      },
    },
  },
});
