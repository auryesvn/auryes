export const initialIdentityState = Object.freeze({
  rolesOpen: false,
  selectedIdentity: null,
  whyOpen: false,
});

export function reduceIdentityState(state, action) {
  switch (action.type) {
    case "toggle-roles":
      return state.rolesOpen
        ? { ...initialIdentityState }
        : { rolesOpen: true, selectedIdentity: null, whyOpen: false };
    case "toggle-identity":
      return {
        rolesOpen: true,
        selectedIdentity:
          state.selectedIdentity === action.identityId
            ? null
            : action.identityId,
        whyOpen: false,
      };
    case "open-why":
      return { rolesOpen: true, selectedIdentity: null, whyOpen: true };
    case "close-detail":
      return { ...state, selectedIdentity: null };
    case "close-why":
      return { ...state, whyOpen: false };
    default:
      return state;
  }
}
