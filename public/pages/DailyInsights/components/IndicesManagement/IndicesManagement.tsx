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
  EuiBasicTable,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSmallButton,
  EuiSpacer,
  EuiText,
  EuiHealth,
  EuiBadge,
  EuiEmptyPrompt,
  EuiPanel,
  EuiTitle,
  EuiLink,
  EuiToolTip,
  EuiIcon,
} from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ContentPanel from '../../../../components/ContentPanel/ContentPanel';
import { IndicesSelectionModal } from './IndicesSelectionModal';
import { getDataSourceFromURL, getAllDetectorsQueryParamsWithDataSourceId } from '../../../utils/helpers';
import { getDetectorList } from '../../../../redux/reducers/ad';
import { AppState } from '../../../../redux/reducers';

interface IndexInsightData {
  indexName: string;
  detectors: string[];
  lastAnomaly: {
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
    count: number;
  } | null;
}

export function IndicesManagement() {
  const dispatch = useDispatch();
  const location = useLocation();
  const MDSQueryParams = getDataSourceFromURL(location);
  const dataSourceId = MDSQueryParams.dataSourceId;
  
  const adState = useSelector((state: AppState) => state.ad);
  
  const [indicesData, setIndicesData] = useState<IndexInsightData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingInsights, setIsStartingInsights] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadIndicesData();
  }, []);

  const loadIndicesData = async () => {
    setIsLoading(true);
    try {
      // Step 1: Fetch all detectors to filter for auto-created ones
      // TODO: Uncomment when ready to use real API
      // await dispatch(getDetectorList(getAllDetectorsQueryParamsWithDataSourceId(dataSourceId)));
      
      // Step 2: Filter detectors where auto_created === true
      // TODO: Uncomment when auto_created field is added to detector model
      // const autoCreatedDetectors = adState.detectorList.filter(detector => detector.auto_created === true);
      
      // Step 3: Group detectors by index pattern
      // Step 4: For each index pattern, check insights job status using insights API
      // TODO: Call insights status API for each unique index pattern
      
      // Mock data showing expected structure
      const mockData: IndexInsightData[] = [
        {
          indexName: 'logs-web-prod-*',
          detectors: ['web-logs-detector-1', 'web-logs-detector-2'],
          lastAnomaly: {
            timestamp: '2024-11-05T10:30:00Z',
            severity: 'high',
            count: 3,
          },
        },
        {
          indexName: 'metrics-app-*',
          detectors: ['app-metrics-detector'],
          lastAnomaly: null,
        },
        {
          indexName: 'logs-api-*',
          detectors: ['api-logs-detector'],
          lastAnomaly: null,
        },
      ];
      
      setIndicesData(mockData);
    } catch (error) {
      console.error('Error loading indices data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAutoInsights = async (selectedIndices: string[]) => {
    setIsStartingInsights(true);
    try {
      // TODO: Call execute agent API
      console.log('Starting auto insights for indices:', selectedIndices);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh data after successful creation
      loadIndicesData();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error starting auto insights:', error);
    } finally {
      setIsStartingInsights(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'subdued';
    }
  };

  const columns = [
    {
      field: 'indexName',
      name: 'Index Pattern',
      sortable: true,
      render: (indexName: string) => (
        <EuiFlexGroup alignItems="center" gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiIcon type="indexManagementApp" color="success" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="s">
              <strong>{indexName}</strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
    {
      field: 'detectors',
      name: 'Auto-Created Detectors',
      render: (detectors: string[]) => (
        <EuiFlexGroup direction="column" gutterSize="xs">
          {detectors.length > 0 ? (
            detectors.map((detector, index) => (
              <EuiFlexItem key={index}>
                <EuiLink size="s">{detector}</EuiLink>
              </EuiFlexItem>
            ))
          ) : (
            <EuiText size="s" color="subdued">
              No detectors created
            </EuiText>
          )}
        </EuiFlexGroup>
      ),
    },
    {
      field: 'lastAnomaly',
      name: 'Last Anomaly',
      render: (lastAnomaly: IndexInsightData['lastAnomaly']) => {
        if (!lastAnomaly) {
          return (
            <EuiText size="s" color="subdued">
              No anomalies detected
            </EuiText>
          );
        }

        return (
          <EuiFlexGroup direction="column" gutterSize="xs">
            <EuiFlexItem>
              <EuiBadge color={getSeverityColor(lastAnomaly.severity)}>
                {lastAnomaly.count} anomal{lastAnomaly.count === 1 ? 'y' : 'ies'}
              </EuiBadge>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs" color="subdued">
                {new Date(lastAnomaly.timestamp).toLocaleString()}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        );
      },
    },
    {
      name: 'Actions',
      render: (item: IndexInsightData) => (
        <EuiSmallButton size="s">
          View Details
        </EuiSmallButton>
      ),
    },
  ];

  const renderAddIndicesPanel = () => (
    <EuiPanel paddingSize="m">
      <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
        <EuiFlexItem>
          <EuiTitle size="xs">
            <h3>Add New Indices for Auto Insights</h3>
          </EuiTitle>
          <EuiSpacer size="s" />
          <EuiText size="s" color="subdued">
            Select indices where you want to automatically create anomaly detectors and generate daily insights.
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiSmallButton
            fill
            color="primary"
            iconType="plus"
            onClick={() => setIsModalVisible(true)}
          >
            Add Indices
          </EuiSmallButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );

  const renderEmptyState = () => (
    <EuiEmptyPrompt
      iconType="indexManagementApp"
      title={<h3>No indices configured for insights</h3>}
      body={
        <p>
          Start by selecting indices where you want to automatically create anomaly detectors
          and generate daily insights. The system will analyze your data patterns and create
          appropriate detectors for each index.
        </p>
      }
      actions={
        <EuiSmallButton
          color="primary"
          fill
          iconType="plus"
          onClick={() => setIsModalVisible(true)}
        >
          Add Your First Index
        </EuiSmallButton>
      }
    />
  );

  const getExcludedIndices = () => {
    return indicesData.map(item => item.indexName);
  };

  return (
    <React.Fragment>
      {renderAddIndicesPanel()}
      
      <EuiSpacer size="l" />

      <ContentPanel 
        title="Configured Indices" 
        titleSize="m"
        subTitle={`${indicesData.length} indices configured for daily insights`}
      >
        {indicesData.length > 0 ? (
          <EuiBasicTable
            items={indicesData}
            columns={columns}
            tableLayout="fixed"
            loading={isLoading}
          />
        ) : (
          renderEmptyState()
        )}
      </ContentPanel>

      <IndicesSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleStartAutoInsights}
        excludedIndices={getExcludedIndices()}
        isLoading={isStartingInsights}
      />
    </React.Fragment>
  );
}
