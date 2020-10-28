import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SNIPPET,
  UNLIKE_SNIPPET, 
  MARK_NOTIFICATIONS_READ
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case LIKE_SNIPPET:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            snippetId: action.payload.snippetId
          }
        ]
      };
    case UNLIKE_SNIPPET:
        return {
          ...state,
          likes: state.likes.filter(like => like.snippetId !== action.payload.snippetId)
        };
    case MARK_NOTIFICATIONS_READ:
        state.notifications.forEach(notification => notification.read = true);
        return {
          ...state
        };
    default:
      return state;
  }
}
