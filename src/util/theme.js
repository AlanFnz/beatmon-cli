export default {
    palette: {
      primary: {
        light: '#33c9dc',
        main: '#373737',
        dark: '#008394',
        constrastText: '#ffffff'
      },
      secondary: {
        light: '#ff6333',
        main: '#ff3d00',
        dark: '#b22a00',
        contrastText: '#ffffff'
      }
    },
    overrides: {
      MuiIconButton: {
        root: {
          padding: '8px 5px 5px 5px'
        }
      },
    },
    spread: {
      typography: {
        useNextVariants: true
      },
      form: {
        textAlign: 'center'
      },
      image: {
        margin: '20px auto 20px auto'
      },
      pageTitle: {
        margin: '10px auto 10px auto'
      },
      textField: {
        margin: '10px auto 10px auto'
      },
      button: {
        marginTop: 20,
        position: 'relative'
      },
      customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
      },
      progress: {
        position: 'absolute'
      },
      invisibleSeparator: {
        border: 'none',
        margin: 4
      },
      visibleSeparator: {
        width: '95%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20,
        marginTop: 30
      },
      paper: {
        padding: 20,
        minWidth: '220px',
        marginBottom: '10px',
      },
      profile: {
        "& .image-wrapper": {
          textAlign: "center",
          position: "relative",
          "& button": {
            position: "absolute",
            top: "80%",
            left: "70%",
          },
        },
        "& .profile-image": {
          width: 200,     
          objectFit: "cover",
          maxWidth: "100%",
          borderRadius: "9999px",
        },
        "& .profile-details": {
          textAlign: "center",
          "& span, svg": {
            verticalAlign: "middle",
          },
          "& a": {
            color: '#fcbb6d',
          },
        },
        "& hr": {
          border: "none",
          margin: "0 0 10px 0",
        },
        "& svg.button": {
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      buttons: {
        textAlign: "center",
        "& a": {
          margin: "20px 10px",
        },
      },
    }
};

