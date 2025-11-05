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
  EuiFlexGroup,
  EuiFlexItem,
  EuiSmallButton,
  EuiTabs,
  EuiTab,
  EuiTabContent,
} from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ContentPanel from '../../../components/ContentPanel/ContentPanel';
import { InsightsOverview } from '../components/InsightsOverview/InsightsOverview';
import { IndicesManagement } from '../components/IndicesManagement/IndicesManagement';

interface DailyInsightsProps extends RouteComponentProps {
  setActionMenu?: (menuMount: any) => void;
}

const tabs = [
  {
    id: 'overview',
    name: 'Insights Overview',
    disabled: false,
  },
  {
    id: 'indices',
    name: 'Indices Management',
    disabled: false,
  },
];

export function DailyInsights(props: DailyInsightsProps) {
  const [selectedTabId, setSelectedTabId] = useState('overview');

  const onSelectedTabChanged = (id: string) => {
    setSelectedTabId(id);
  };

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <EuiTab
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}
        disabled={tab.disabled}
        key={index}
      >
        {tab.name}
      </EuiTab>
    ));
  };

  const renderTabContent = () => {
    switch (selectedTabId) {
      case 'overview':
        return <InsightsOverview onNavigateToIndicesManagement={() => setSelectedTabId('indices')} />;
      case 'indices':
        return <IndicesManagement />;
      default:
        return <InsightsOverview onNavigateToIndicesManagement={() => setSelectedTabId('indices')} />;
    }
  };

  return (
    <React.Fragment>
      <EuiPageHeader
        pageTitle={
          <EuiText size="s">
            <h1>Daily Insights Management</h1>
          </EuiText>
        }
        description="Manage daily anomaly detection insights, indices, and detectors"
        rightSideItems={[
          <EuiSmallButton
            fill
            iconType="plus"
            onClick={() => {
              // TODO: Navigate to create insights job
            }}
          >
            Start Auto Insights
          </EuiSmallButton>,
        ]}
      />
      <EuiSpacer size="l" />

      <EuiTabs>{renderTabs()}</EuiTabs>
      <EuiSpacer size="m" />

      {renderTabContent()}
    </React.Fragment>
  );
}

