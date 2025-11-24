/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { APIAction, APIResponseAction, HttpSetup } from '../middleware/types';
import handleActions from '../utils/handleActions';

const EXECUTE_ML_AGENT = 'ml/EXECUTE_ML_AGENT';

export interface MLState {
  requesting: boolean;
  errorMessage: string;
}

export const initialMLState: MLState = {
  requesting: false,
  errorMessage: '',
};

const reducer = handleActions(
  {
    [EXECUTE_ML_AGENT]: {
      REQUEST: (state: MLState): MLState => ({
        ...state,
        requesting: true,
        errorMessage: '',
      }),
      SUCCESS: (state: MLState): MLState => ({
        ...state,
        requesting: false,
      }),
      FAILURE: (state: MLState, action: APIResponseAction): MLState => ({
        ...state,
        requesting: false,
        errorMessage: action.error,
      }),
    },
  },
  initialMLState
);

export default reducer;

export const executeAutoCreateAgent = (indices: string[]) => (
  dispatch: any,
  getState: any
) => {
  const dataSourceId = getState().opensearch.dataSourceId;
  dispatch({
    type: EXECUTE_ML_AGENT,
    request: (client: HttpSetup) =>
      client.post(`../api/ml/agents/execute`, {
        body: JSON.stringify({ indices }),
        query: dataSourceId ? { dataSourceId } : {},
      }),
  });
};
