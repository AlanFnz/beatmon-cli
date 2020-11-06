import React from 'react';
// Material UI
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';

export default ({
  textField,
  uploadButton,
  waves,
  cropButton,
  nextButton,
  handleSubmit
}) => (
  <DialogContent>
    <form>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          {textField}
        {/* </Grid>
        <Grid item xs={12} sm={6}> */}
          <label htmlFor='upload-audio'>
            <Grid
              container
              direction='column'
              alignItems='center'
              justify='center'
            >
              {uploadButton}
              {waves}
              {cropButton}
            </Grid>
          </label>
        </Grid>
      </Grid>
      {nextButton}
    </form>
  </DialogContent>
);
