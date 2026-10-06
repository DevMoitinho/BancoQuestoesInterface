// Simple bridge to allow Services (outside React tree)
// to update the LoadingContext state.
let setLoadingFn = null;

export const setLoadingBridge = (fn) => {
  setLoadingFn = fn;
};

export const startLoading = () => {
  if (setLoadingFn) setLoadingFn(true);
};

export const stopLoading = () => {
  if (setLoadingFn) setLoadingFn(false);
};
