import {
  SET_SNIPPETS,
  LOADING_DATA,
  LIKE_SNIPPET,
  UNLIKE_SNIPPET,
  DELETE_SNIPPET,
  POST_SNIPPET, 
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI, 
  SET_SNIPPET,
  PLAY_SNIPPET,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from "../types";
import axios from '../../axios';

// Get all snippets
export const getSnippets = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/snippets')
        .then(res => {
            dispatch({
                type: SET_SNIPPETS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SET_SNIPPETS,
                payload: []
            })
        })
};

// Get a single snippet
export const getSnippet = snippetId => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/snippet/${snippetId}`)
        .then(res => {
            dispatch({ 
                type: SET_SNIPPET,
                payload: res.data 
            });
            dispatch ({ type: STOP_LOADING_UI });
        })
        .catch(err => console.log(err))
};

// Play a snippet
export const playSnippet = snippetId => dispatch => {
    dispatch({ 
        type: PLAY_SNIPPET,
        payload: snippetId
    });
};

// Post a snippet
export const postSnippet = newSnippet => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post('/snippet', newSnippet)
        .then(res => {
            dispatch ({ 
                type: POST_SNIPPET,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch ({
                type: SET_ERRORS,
                payload: err
            })
        })
};

// Like a snippet
export const likeSnippet = snippetId => dispatch => {
    axios.get(`/snippet/${snippetId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_SNIPPET,
                payload: res.data
            })
        })
        .catch(err => console.log (err))
};

// Unlike a snippet
export const unlikeSnippet = snippetId => dispatch => {
    axios.get(`/snippet/${snippetId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_SNIPPET,
                payload: res.data
            })
        })
        .catch(err => console.log (err));
};

// Submit a comment
export const submitComment = (snippetId, commentData) => dispatch => {
    axios.post(`/snippet/${snippetId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: SET_ERRORS,
                payload: err
            });
        })
}

// Delete a snippet
export const deleteSnippet = snippetId => dispatch => {
    axios.delete(`/snippet/${snippetId}`)
        .then(() => {
            dispatch({ 
                type: DELETE_SNIPPET,
                payload: snippetId
            });
        })
        .catch(err => console.log(err));
};

export const getUserData = userHandle => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_SNIPPETS,
                payload: res.data.snippets
            });
        })
        .catch(() => {
            dispatch({ 
                type: SET_SNIPPETS,
                payload: null
            });
        });
};

export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS});
};
