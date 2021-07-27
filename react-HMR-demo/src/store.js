export const initialState = {
  formData: {},
  data: [],
  dialogVisible: false,
};

export const Action = {
  UPDATE_DATA: 'updateData',
};

export function createReducer(state = initialState, action) {
  switch (action.type) {
    case Action.UPDATE_DATA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
