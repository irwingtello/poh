import React, { createContext, useReducer } from 'react';

export const MyContext = createContext();

const initialState = { value: '' };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

function MyContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
}

export default MyContextProvider;
