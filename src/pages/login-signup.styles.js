export const styles = {
    form: {
        textAlign: 'center'
    },

    hidden: {
        visibility: 'hidden'
    },

    image: {
        padding: 15,
        width: 60,
        margin: '10px auto 0 auto'
    },

    pageTitle: {
        marginBottom: 5,
        fontWeight: 100
    },

    textField: {
        margin: '20px auto'
    },

    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 15
    },

    progress: {
        width: 20
    },

    customButton: {
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
        margin: 20,
        borderRadius: 0,
        borderBottom: '1px solid #fcbb6d',
        '&:visited': {
            fontSize: '1.6rem',
            color: '#fcbb6d',
            display: 'inline-block',
            textDecoration: 'none',
            borderBottom: '1px solid #fcbb6d',
            padding: 3,
            transition: 'all .2s'
        },
        '&:hover': {
            backgroundColor: '#fcbb6d',
            color: '#fff',
            boxShadow: '0 .8rem 1.5rem rgba(#000, .1)',
            transform: 'translateY(-2px)'
        },
        '&:active': {
            boxShadow: '0 .5rem 1rem rgba(#000, .15)',
            transform: 'translateY(0)'
        }
    }
};