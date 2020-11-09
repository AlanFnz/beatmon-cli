import {
  SET_SNIPPETS,
  SET_SNIPPETS_USER,
  SET_SNIPPETS_NAV,
  LOADING_DATA,
  LIKE_SNIPPET,
  UNLIKE_SNIPPET,
  DELETE_SNIPPET,
  POST_SNIPPET,
  SET_ERRORS,
  CLEAR_ERRORS,
  CLEAR_SNIPPETS,
  LOADING_UI,
  SET_SNIPPET,
  PLAY_SNIPPET,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
import axios from "../../axios";

// Get all snippets
export const getSnippets = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/snippets")
    .then((res) => {
      dispatch({
        type: SET_SNIPPETS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_SNIPPETS_NAV,
        payload: [],
      });
    });
};

// Get snippets with pagination
export const getSnippetsNav = (lastVisible) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  const url = lastVisible ? 'next' : 'first' ;
  axios
    .post(`/snippets/${url}`, lastVisible)
    .then((res) => {
      dispatch({
        type: SET_SNIPPETS_NAV,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: SET_SNIPPETS,
        payload: [],
      });
    });
};

// Get snippets by genre with pagination
export const getSnippetsByGenre = (lastVisible, genre) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  const url = lastVisible ? 'next' : 'first' ;
  axios
    .post(`/${genre}/${url}`, lastVisible)
    .then((res) => {
      dispatch({
        type: SET_SNIPPETS_NAV,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: SET_SNIPPETS,
        payload: [],
      });
    });
};

// Get user data and snippets
export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_SNIPPETS_USER,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SNIPPETS,
        payload: null,
      });
    });
};

// Get more user snippets with pagination
export const getMoreUserSnippetsNav = (lastVisible, handle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .post(`/user/${handle}/next`, lastVisible)
    .then((res) => {
      dispatch({
        type: SET_SNIPPETS_USER,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: SET_SNIPPETS,
        payload: [],
      });
    });
};

// Get a single snippet
export const getSnippet = (snippetId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/snippet/${snippetId}`)
    .then((res) => {
      dispatch({
        type: SET_SNIPPET,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

// Play a snippet, logged user
export const playSnippetLogged = (snippetId) => (dispatch) => {
  axios
    .get(`/snippet/${snippetId}/play`)
    .then((res) => {
      dispatch({
        type: PLAY_SNIPPET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Play a snippet, not logged user
export const playSnippetNotLogged = (snippetId) => (dispatch) => {
  axios
    .get(`/snippet/${snippetId}/playNotLogged`)
    .then((res) => {
      dispatch({
        type: PLAY_SNIPPET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Post a snippet
export const postSnippet = (newSnippet) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/snippet", newSnippet)
    .then((res) => {
      dispatch({
        type: POST_SNIPPET,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Like a snippet
export const likeSnippet = (snippetId) => (dispatch) => {
  axios
    .get(`/snippet/${snippetId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_SNIPPET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Unlike a snippet
export const unlikeSnippet = (snippetId) => (dispatch) => {
  axios
    .get(`/snippet/${snippetId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_SNIPPET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// Submit a comment
export const submitComment = (snippetId, commentData) => (dispatch) => {
  axios
    .post(`/snippet/${snippetId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err,
      });
    });
};

// Delete a snippet
export const deleteSnippet = (snippetId) => (dispatch) => {
  axios
    .delete(`/snippet/${snippetId}`)
    .then(() => {
      dispatch({
        type: DELETE_SNIPPET,
        payload: snippetId,
      });
    })
    .catch((err) => console.log(err));
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const clearSnippets = () => (dispatch) => {
  dispatch({ type: CLEAR_SNIPPETS });
};

export const setError = (error) => (dispatch) => {
  dispatch({ type: SET_ERRORS, payload: error});
};
