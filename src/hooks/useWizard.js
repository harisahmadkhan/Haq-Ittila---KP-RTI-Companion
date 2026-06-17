import { useReducer } from 'react';
import { KP_PARTIES } from '../data/parties.js';

const initialState = {
  step: 1,
  query: '',
  manifestoChunks: [],
  researchSummary: '',
  sources: [],
  isDemo: false,
  department: null,
  routingReason: '',
  draftEn: '',
  draftUr: '',
  subjectEn: '',
  subjectUr: '',
  informationRequested: [],
  escalationNote: '',
  filedDate: null,
  selectedParties: KP_PARTIES,
};

function reducer(state, action) {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, step: action.payload };
    case 'UPDATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function useWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    goToStep: (n) => dispatch({ type: 'GO_TO_STEP', payload: n }),
    updateState: (partial) => dispatch({ type: 'UPDATE', payload: partial }),
    resetWizard: () => dispatch({ type: 'RESET' }),
  };
}
