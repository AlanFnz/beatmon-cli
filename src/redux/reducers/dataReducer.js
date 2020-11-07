import {
  SET_SNIPPETS,
  SET_SNIPPETS_NAV,
  SET_SNIPPET,
  CLEAR_SNIPPETS,
  PLAY_SNIPPET,
  LIKE_SNIPPET,
  UNLIKE_SNIPPET,
  LOADING_DATA,
  DELETE_SNIPPET,
  POST_SNIPPET,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  snippets: [],
  snippet: {},
  loading: false,
  playSnippet: null,
  lastVisible: null,
  lastSnippet: null,
};

export default function (state = initialState, action) {
  let index;
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SNIPPETS:
      return {
        ...state,
        snippets: action.payload.snippets,
        lastVisible: action.payload.lastVisible,
        loading: false,
      };
    case SET_SNIPPETS_NAV:
      return {
        ...state,
        snippets: state.snippets.concat(action.payload.snippets),
        lastVisible: action.payload.lastVisible,
        lastSnippet: state.lastSnippet === null ?  action.payload.lastSnippet : state.lastSnippet,
        loading: false,
      };
    case SET_SNIPPET:
      return {
        ...state,
        snippet: action.payload,
      };
    case CLEAR_SNIPPETS:
      return {
        snippets: [],
        snippet: {},
        loading: false,
        playSnippet: null,
        lastVisible: null,
        lastSnippet: null,
      };
    case PLAY_SNIPPET:
      index = state.snippets.findIndex(
        (snippet) => snippet.snippetId === action.payload.snippetId
      );
      state.snippets[index] = action.payload;
      return {
        ...state,
        snippet: {
          ...state.snippet,
          playCount: action.payload.playCount,
        },
      };
    case LIKE_SNIPPET:
    case UNLIKE_SNIPPET:
      index = state.snippets.findIndex(
        (snippet) => snippet.snippetId === action.payload.snippetId
      );
      state.snippets[index] = action.payload;
      // if(state.snippet.snippetId === action.payload.snippetId) {
      //  state.snippet = action.payload;
      // };
      return {
        ...state,
        snippet: {
          ...state.snippet,
          likeCount: action.payload.likeCount,
        },
      };
    case DELETE_SNIPPET:
      index = state.snippets.findIndex(
        (snippet) => snippet.snippetId === action.payload
      );
      state.snippets.splice(index, 1);
      return {
        ...state,
      };
    case POST_SNIPPET:
      return {
        ...state,
        snippets: [action.payload, ...state.snippets],
      };
    case SUBMIT_COMMENT:
      index = state.snippets.findIndex(
        (snippet) => snippet.snippetId === action.payload.snippetId
      );
      const commentCount = state.snippet.commentCount + 1;
      state.snippets[index] = { ...state.snippets[index], commentCount };
      return {
        ...state,
        snippet: {
          ...state.snippet,
          commentCount,
          comments: [action.payload, ...state.snippet.comments],
        },
      };
    default:
      return state;
  }
}
