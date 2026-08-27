export type SceneTransitionPhase = "idle" | "prepared" | "crossfading";

export type SceneTransitionState = {
  currentAsset: string;
  outgoingAsset: string | null;
  phase: SceneTransitionPhase;
};

type SceneRequest = {
  asset: string;
  desiredAsset: string;
  ready: boolean;
  reducedMotion: boolean;
};

export function resolveSceneRequest(
  state: SceneTransitionState,
  request: SceneRequest,
): SceneTransitionState {
  if (
    !request.ready ||
    request.asset !== request.desiredAsset ||
    request.asset === state.currentAsset
  )
    return state;

  if (request.reducedMotion) {
    return { currentAsset: request.asset, outgoingAsset: null, phase: "idle" };
  }

  return {
    currentAsset: request.asset,
    outgoingAsset: state.currentAsset,
    phase: "prepared",
  };
}

export function startSceneCrossfade(
  state: SceneTransitionState,
): SceneTransitionState {
  return state.phase === "prepared"
    ? { ...state, phase: "crossfading" }
    : state;
}

export function finishSceneCrossfade(
  state: SceneTransitionState,
): SceneTransitionState {
  return state.phase === "crossfading"
    ? { ...state, outgoingAsset: null, phase: "idle" }
    : state;
}