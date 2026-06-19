import { TextField, InputAdornment,  } from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";

interface NomineeDetailsProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

}

export const NomineeDetails: React.FC<NomineeDetailsProps> = ({
  formData,
  handleInputChange,

}) => {
  return (
    <div>
      <div style={{ marginBottom: "1rem", color: "#000", fontWeight: "bold", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px"     }}>
        Nominee Details
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
              label="Nominee Name"
              name="Nominee_name"
              value={formData.Nominee_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Nominee Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0a2558" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nominee Relation"
              name="Nominee_Relation"
              value={formData.Nominee_Relation}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Nominee Relation"
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
              label="Nominee Age"
              name="Nominee_age"
              value={formData.Nominee_age}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Nominee Age"
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
  )
}
