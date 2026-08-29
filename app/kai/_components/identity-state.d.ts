import type { IdentityId } from "../_data/identities";

export type IdentityState = {
  rolesOpen: boolean;
  selectedIdentity: IdentityId | null;
  whyOpen: boolean;
};

export type IdentityAction =
  | { type: "toggle-roles" }
  | { type: "toggle-identity"; identityId: IdentityId }
  | { type: "open-why" }
  | { type: "close-detail" }
  | { type: "close-why" };

export const initialIdentityState: Readonly<IdentityState>;
export function reduceIdentityState(
  state: IdentityState,
  action: IdentityAction,
): IdentityState;
