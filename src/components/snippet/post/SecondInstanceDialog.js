import React from 'react';
import CustomFormControlLabel from './CustomFormControlLabel';
// Material UI
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

export default ({ handleGenreSelection, submitButton, errors }) => (
  <DialogContent>
    <form>
      <FormControl required error={errors.error} component='fieldset'>
        <FormLabel component='legend'>Pick a genre</FormLabel>
        <RadioGroup
          aria-label='genre'
          name='genre'
          onChange={handleGenreSelection}
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <CustomFormControlLabel value='house' label='House' />
              <CustomFormControlLabel value='minimalhouse' label='Minimal House' />
              <CustomFormControlLabel value='deephouse' label='Deep House' />
              <CustomFormControlLabel value='techhouse' label='Tech House' />
              <CustomFormControlLabel value='techno' label='Techno' />
              <CustomFormControlLabel value='progressive' label='Progressive' />
              <CustomFormControlLabel value='drumnbass' label='Drum and Bass' />
              <CustomFormControlLabel value='dubstep' label='Dubstep' />
            </Grid>
            <Grid item xs={6}>
              <CustomFormControlLabel value='downtempo' label='Downtempo' />
              <CustomFormControlLabel value='nudisco' label='Nu Disco' />
              <CustomFormControlLabel value='trance' label='Trance' />
              <CustomFormControlLabel value='breaks' label='Breaks' />
              <CustomFormControlLabel value='traphiphop' label='Trap/Hip-Hop' />
              <CustomFormControlLabel value='reggaedub' label='Reggae/Dub' />
              <CustomFormControlLabel value='indiedance' label='Indie Dance' />
              <CustomFormControlLabel value='bluesrnb' label='Blues/Rnb' />
            </Grid>
          </Grid>
        </RadioGroup>
        <FormHelperText>ke?</FormHelperText>
      </FormControl>
    </form>
    {submitButton}
  </DialogContent>
);
