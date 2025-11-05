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

import {
  EuiSpacer,
  EuiPageHeader,
  EuiText,
  EuiSmallButton,
} from '@elastic/eui';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { InsightsOverview } from '../components/InsightsOverview/InsightsOverview';

interface DailyInsightsProps extends RouteComponentProps {
  setActionMenu?: (menuMount: any) => void;
}

export function DailyInsights(props: DailyInsightsProps) {
  return (
    <React.Fragment>
      <EuiPageHeader
        pageTitle={
          <EuiText size="s">
            <h1>Daily Insights</h1>
          </EuiText>
        }
        description="Automated anomaly detection insights and summaries"
        rightSideItems={[
          <EuiSmallButton
            fill
            iconType="plus"
            onClick={() => {
              // TODO: Navigate to indices management or trigger setup
            }}
          >
            Start Auto Insights
          </EuiSmallButton>,
        ]}
      />
      <EuiSpacer size="l" />

      <InsightsOverview />
    </React.Fragment>
  );
}

