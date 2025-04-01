let _store: any;
let _toastStore: any;
const setStore = (store: any) => {
  _store = store;
};

const dispatch = (event: any) => {
  _store.dispatch(event);
};

const setToastStore = (store: any) => {
  _toastStore = store;
};

const dispatchToast = (event: any) => {
  _toastStore.dispatch(event);
};

export const storeSvc = { setStore, dispatch, setToastStore, dispatchToast };
