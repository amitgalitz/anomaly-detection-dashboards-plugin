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

import { getColumns } from '../../utils/tableUtils';
import { render } from '@testing-library/react';

describe('tableUtils spec', () => {
  describe('should render the column titles', () => {
    test('detector name column', () => {
      const result = getColumns('');
      const { getByText } = render(result[0].name);
      getByText('Detector');
    });
    test('indices column', () => {
      const result = getColumns('');
      const { getByText } = render(result[1].name);
      getByText('Indices');
    });
    test('detector state column', () => {
      const result = getColumns('');
      const { getByText } = render(result[2].name);
      getByText('Real-time state');
    });
    test('historical analysis column', () => {
      const result = getColumns('');
      const { getByText } = render(result[3].name);
      getByText('Historical analysis');
    });
    test('anomalies last 24 hrs column', () => {
      const result = getColumns('');
      const { getByText } = render(result[4].name);
      getByText('Anomalies last 24 hours');
    });
    test('last RT occurrence column', () => {
      const result = getColumns('');
      const { getByText } = render(result[5].name);
      getByText('Last real-time occurrence');
    });
    test('last started time column', () => {
      const result = getColumns('');
      const { getByText } = render(result[6].name);
      getByText('Last started');
    });
  });
});
