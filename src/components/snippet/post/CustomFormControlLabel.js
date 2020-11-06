import React from "react";
// Material UI
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';

export default ({ value, label }) => (
  <Box component='span' display='block'>
    <FormControlLabel
      value={value}
      control={<Radio size="small" />}
      label={<Typography style={{ fontSize: "12px" }}>{label}</Typography>}
    />
  </Box>
);
