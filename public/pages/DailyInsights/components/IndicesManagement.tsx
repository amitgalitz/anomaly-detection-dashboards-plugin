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
  EuiLoadingSpinner,
} from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ContentPanel from '../../../components/ContentPanel/ContentPanel';
import { EnhancedSelectionModal } from './EnhancedSelectionModal';
import { getDataSourceFromURL, getAllDetectorsQueryParamsWithDataSourceId } from '../../utils/helpers';
import { getDetectorList } from '../../../redux/reducers/ad';
import { AppState } from '../../../redux/reducers';
import { CoreServicesConsumer } from '../../../components/CoreServices/CoreServices';
import { CoreStart } from '../../../../../../src/core/public';
import { getDataSourceEnabled } from '../../../services';
import { BREADCRUMBS, AD_NODE_API } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';

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
  return (
    <CoreServicesConsumer>
      {(core: CoreStart | null) => 
        core && <IndicesManagementContent core={core} />
      }
    </CoreServicesConsumer>
  );
}

function IndicesManagementContent({ core }: { core: CoreStart }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const MDSQueryParams = getDataSourceFromURL(location);
  const dataSourceId = MDSQueryParams.dataSourceId;
  const dataSourceEnabled = !!getDataSourceEnabled().enabled;
  
  const adState = useSelector((state: AppState) => state.ad);
  
  const [indicesData, setIndicesData] = useState<IndexInsightData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingInsights, setIsStartingInsights] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [insightsEnabled, setInsightsEnabled] = useState(false);
  
  const history = useHistory();

  // Set breadcrumbs
  useEffect(() => {
    core.chrome.setBreadcrumbs([BREADCRUMBS.DAILY_INSIGHTS]);
    core.chrome.docTitle.change('Daily Insights');
  }, [dataSourceId, dataSourceEnabled, core]);

  useEffect(() => {
    // Initial load
    loadDetectors();
    fetchInsightsStatus();
    
    // Set up 30-second refresh for async detector creation
    const interval = setInterval(loadDetectors, 30000);
    
    return () => clearInterval(interval);
  }, [dataSourceId]);

  const fetchInsightsStatus = async () => {
    try {
      const statusPath = dataSourceId
        ? `${AD_NODE_API.INSIGHTS_STATUS}/${dataSourceId}`
        : AD_NODE_API.INSIGHTS_STATUS;
      
      const statusResponse = await core?.http.get(statusPath);
      const enabled = statusResponse?.response?.enabled || false;
      
      setInsightsEnabled(enabled);
    } catch (error: any) {
      console.error('Error fetching insights status:', error);
      setInsightsEnabled(false);
    }
  };

  // Process detectors when they change
  useEffect(() => {
    if (adState.detectorList) {
      processDetectors();
    }
  }, [adState.detectorList]);

  const loadDetectors = async () => {
    try {
      await dispatch(getDetectorList(getAllDetectorsQueryParamsWithDataSourceId(dataSourceId)));
    } catch (error) {
      console.error('Error loading detectors:', error);
      setIndicesData([]);
      setIsLoading(false);
    }
  };

  const processDetectors = () => {
    setIsLoading(true);
    
    console.log('All detectors:', adState.detectorList);
    
    // Filter for auto-created detectors
    const detectors = Array.isArray(adState.detectorList) ? adState.detectorList : [];
    const autoCreatedDetectors = detectors.filter(detector => detector.auto_created === true);
    
    console.log('Auto-created detectors:', autoCreatedDetectors);
    
    // Group by index pattern
    const indexGroups = new Map<string, { detectors: string[], lastAnomaly: any }>();
    
    autoCreatedDetectors.forEach(detector => {
      detector.indices.forEach(indexPattern => {
        if (!indexGroups.has(indexPattern)) {
          indexGroups.set(indexPattern, {
            detectors: [],
            lastAnomaly: null, // TODO: Get from insights API
          });
        }
        indexGroups.get(indexPattern)!.detectors.push(detector.name);
      });
    });
    
    console.log('Index groups:', Array.from(indexGroups.entries()));
    
    // Convert to display format
    const indicesData: IndexInsightData[] = Array.from(indexGroups.entries()).map(([indexName, data]) => ({
      indexName,
      detectors: data.detectors,
      lastAnomaly: data.lastAnomaly,
    }));
    
    console.log('Final indices data:', indicesData);
    
    setIndicesData(indicesData);
    setIsLoading(false);
  };

  const [selectedModalIndices, setSelectedModalIndices] = useState<string[]>([]);

  const handleStartAutoInsights = async (selectedIndices: string[]) => {
    setIsStartingInsights(true);
    try {
      // 1. Execute agent to create detectors
      // TODO: Implement executeAutoCreateAgent redux action
      // await dispatch(executeAutoCreateAgent(selectedIndices, dataSourceId));
      
      // 2. Start insights job for the domain
      // TODO: Implement startInsightsJob redux action  
      // await dispatch(startInsightsJob(selectedIndices, dataSourceId));
      
      // 3. Refresh data
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

  const renderEmptyState = () => {
    // Scenario 1: Job inactive, no detectors - Show "Add Your First Index" button
    if (!insightsEnabled && indicesData.length === 0) {
      return (
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
              fill
              iconType="plus"
              onClick={() => history.push('/daily-insights/overview')}
            >
              Add Your First Index
            </EuiSmallButton>
          }
        />
      );
    }

    // Scenario 2: Job active, no detectors yet - Show "detectors being created" message
    if (insightsEnabled && indicesData.length === 0) {
      return (
        <EuiEmptyPrompt
          icon={<EuiLoadingSpinner size="xl" />}
          title={<h3>Job has started and detectors are being created</h3>}
          body={
            <p>
              Please wait while we create detectors for your indices. This process may take a few minutes.
              The page will automatically refresh to show your detectors once they're ready.
            </p>
          }
        />
      );
    }

    // Fallback (shouldn't reach here if indicesData.length > 0)
    return null;
  };

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
        actions={
          <EuiSmallButton
            iconType="refresh"
            onClick={loadDetectors}
            isLoading={isLoading}
          >
            Refresh
          </EuiSmallButton>
        }
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

      <EnhancedSelectionModal
        isVisible={isModalVisible}
        selectedIndices={selectedModalIndices}
        onSelectionChange={setSelectedModalIndices}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedModalIndices([]);
        }}
        onConfirm={() => {
          handleStartAutoInsights(selectedModalIndices);
        }}
        isLoading={isStartingInsights}
      />
    </React.Fragment>
  );
}
