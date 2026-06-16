import { TextField, InputAdornment,  } from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";

interface JoiningDetailsProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const JoiningDetails: React.FC<JoiningDetailsProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div>
      <div style={{ marginBottom: "1rem", color: "#000", fontWeight: "bold", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px"     }}>
        Joining Details
      </div>
      <div style={{ padding: "0 1rem 1rem 1rem" }}>
        <div className="basic-details-accordion">
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              width: "100%",
            }}
          >
            <TextField
              label="Sponsor Code"
              name="Sponsor_code"
              value={formData.Sponsor_code}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Sponsor Code"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0a2558" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Position"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0a2558" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Position Name"
              name="positionName"
              value={formData.positionName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Position Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0a2558" }} />
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              width: "100%",
            }}
          >
            <TextField
              label="Sponsor Name"
              name="Sponsor_name"
              type="email"
              value={formData.Sponsor_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Sponsor Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0a2558" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Position Id"
              name="positionId"
              value={formData.positionId}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Position Id"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0a2558" }} />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
