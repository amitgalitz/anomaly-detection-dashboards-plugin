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
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiStat,
  EuiCard,
  EuiText,
  EuiEmptyPrompt,
  EuiSmallButton,
  EuiBadge,
  EuiHealth,
  EuiIcon,
  EuiTitle,
  EuiPanel,
  EuiHorizontalRule,
  EuiLink,
  EuiToolTip,
  EuiCallOut,
} from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import ContentPanel from '../../../../components/ContentPanel/ContentPanel';
import { EnhancedSelectionModal } from '../IndicesManagement/EnhancedSelectionModal';

interface InsightCard {
  id: string;
  title: string;
  indexPattern: string;
  detectorName: string;
  severity: 'low' | 'medium' | 'high';
  anomalyCount: number;
  timestamp: string;
  description: string;
  confidence: number;
}

interface InsightsOverviewProps {
  onNavigateToIndicesManagement?: () => void;
}

export function InsightsOverview({ onNavigateToIndicesManagement }: InsightsOverviewProps) {
  const [stats, setStats] = useState({
    totalInsights: 0,
    activeJobs: 0,
    totalIndices: 0,
    totalDetectors: 0,
  });

  const [recentInsights, setRecentInsights] = useState<InsightCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveInsightsJob, setHasActiveInsightsJob] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStartingInsights, setIsStartingInsights] = useState(false);
  const [selectedIndicesForSetup, setSelectedIndicesForSetup] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Check insights job status for this domain
      // const insightsStatus = await dispatch(getInsightsStatus(dataSourceId));
      // setHasActiveInsightsJob(insightsStatus.status === 'active');
      
      // TODO: If active, fetch insights data and stats
      // if (insightsStatus.status === 'active') {
      //   const insights = await dispatch(getInsightsResults(dataSourceId));
      //   setRecentInsights(insights.data);
      //   setStats({
      //     totalInsights: insights.total,
      //     activeJobs: 1,
      //     totalIndices: insights.indices.length,
      //     totalDetectors: insights.detectors.length,
      //   });
      // }
      
      // Mock: Set to false to show setup experience
      setHasActiveInsightsJob(false);
      
      setStats({
        totalInsights: 0,
        activeJobs: 0,
        totalIndices: 0,
        totalDetectors: 0,
      });

      setRecentInsights([]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmIndicesSelection = (selectedIndices: string[]) => {
    setSelectedIndicesForSetup(selectedIndices);
    setIsModalVisible(false);
  };

  const handleExecuteAutoInsights = async () => {
    setIsStartingInsights(true);
    try {
      // 1. Execute agent to create detectors
      // TODO: Implement executeAutoCreateAgent redux action
      // await dispatch(executeAutoCreateAgent(selectedIndicesForSetup, dataSourceId));
      
      // 2. Start insights job for the domain
      // TODO: Implement startInsightsJob redux action
      // await dispatch(startInsightsJob(selectedIndicesForSetup, dataSourceId));
      
      // 3. Refresh data
      loadDashboardData();
      setSelectedIndicesForSetup([]);
    } catch (error) {
      console.error('Error starting auto insights:', error);
    } finally {
      setIsStartingInsights(false);
    }
  };

  const renderSelectedIndices = () => {
    if (selectedIndicesForSetup.length === 0) return null;

    return (
      <EuiPanel paddingSize="m" color="success" hasBorder>
        <EuiTitle size="xs">
          <h4>Selected Indices for Auto Insights</h4>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiFlexGroup wrap gutterSize="s">
          {selectedIndicesForSetup.map((index, i) => (
            <EuiFlexItem grow={false} key={i}>
              <EuiBadge color="success" iconType="indexManagementApp">
                {index}
              </EuiBadge>
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>
        <EuiSpacer size="m" />
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
          <EuiFlexItem>
            <EuiText size="s" color="subdued">
              Ready to create detectors and start insights for {selectedIndicesForSetup.length} indices
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiSmallButton
                  onClick={() => setIsModalVisible(true)}
                >
                  Edit Selection
                </EuiSmallButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiSmallButton
                  color="danger"
                  onClick={() => setSelectedIndicesForSetup([])}
                >
                  Clear Selection
                </EuiSmallButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    );
  };

  const renderSetupExperience = () => (
    <>
      <ContentPanel title="Get Started with Daily Insights" titleSize="m">
        <EuiText size="s">
          <p>
            Daily Insights automatically analyzes your data patterns and provides summaries of anomalies detected across your indices. 
            Get started by selecting indices to monitor and we'll create optimized detectors for you.
          </p>
        </EuiText>
        <EuiSpacer size="l" />
        
        {selectedIndicesForSetup.length === 0 ? (
          <EuiEmptyPrompt
            iconType="visLine"
            title={<h3>Set up your first insights job</h3>}
            body={
              <p>
                Select indices to monitor and we'll automatically create anomaly detectors 
                and start generating daily insights for your data.
              </p>
            }
            actions={
              <EuiSmallButton
                color="primary"
                fill
                iconType="plus"
                onClick={() => setIsModalVisible(true)}
              >
                Select Indices to Monitor
              </EuiSmallButton>
            }
          />
        ) : (
          <div>
            {renderSelectedIndices()}
            <EuiSpacer size="l" />
            <EuiFlexGroup justifyContent="center">
              <EuiFlexItem grow={false}>
                <EuiSmallButton
                  color="primary"
                  fill
                  size="m"
                  iconType="play"
                  onClick={handleExecuteAutoInsights}
                  isLoading={isStartingInsights}
                >
                  Start Auto Insights for {selectedIndicesForSetup.length} Indices
                </EuiSmallButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        )}
      </ContentPanel>
    </>
  );

  const renderActiveInsightsDashboard = () => (
    <>
      <ContentPanel title="Daily Insights Dashboard" titleSize="m">
        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
          <EuiFlexItem>
            <EuiText size="s" color="subdued">
              <p>Overview of anomaly detection insights from the last 24 hours</p>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiCallOut size="s" color="primary">
              <EuiText size="xs">
                Want to monitor more indices? Go to{' '}
                <EuiLink onClick={onNavigateToIndicesManagement}>
                  Indices Management
                </EuiLink>
              </EuiText>
            </EuiCallOut>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="l" />
        {renderStatsCards()}
      </ContentPanel>

      <EuiSpacer size="l" />

      <ContentPanel 
        title="Recent Insights" 
        titleSize="m"
        subTitle={`${recentInsights.length} insights from the last 24 hours`}
      >
        {renderRecentInsights()}
      </ContentPanel>
    </>
  );

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'alert';
      case 'medium':
        return 'warning';
      case 'low':
        return 'iInCircle';
      default:
        return 'questionInCircle';
    }
  };

  const renderStatsCards = () => (
    <EuiFlexGroup gutterSize="l">
      <EuiFlexItem>
        <EuiStat
          title={stats.totalInsights.toString()}
          description="Total Insights (24h)"
          titleColor="primary"
          isLoading={isLoading}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiStat
          title={stats.activeJobs.toString()}
          description="Active Insights Jobs"
          titleColor="success"
          isLoading={isLoading}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiStat
          title={stats.totalIndices.toString()}
          description="Monitored Indices"
          titleColor="accent"
          isLoading={isLoading}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiStat
          title={stats.totalDetectors.toString()}
          description="Auto-Created Detectors"
          titleColor="warning"
          isLoading={isLoading}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const renderInsightCard = (insight: InsightCard) => (
    <EuiFlexItem key={insight.id}>
      <EuiPanel paddingSize="m" hasShadow={false} hasBorder>
        <EuiFlexGroup alignItems="flexStart" justifyContent="spaceBetween">
          <EuiFlexItem>
            <EuiFlexGroup alignItems="center" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiIcon
                  type={getSeverityIcon(insight.severity)}
                  color={getSeverityColor(insight.severity)}
                  size="m"
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiTitle size="xs">
                  <h4>{insight.title}</h4>
                </EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiBadge color={getSeverityColor(insight.severity)}>
              {insight.severity.toUpperCase()}
            </EuiBadge>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="s" />

        <EuiText size="s" color="subdued">
          <p>{insight.description}</p>
        </EuiText>

        <EuiSpacer size="s" />

        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
          <EuiFlexItem>
            <EuiText size="xs">
              <strong>Index:</strong> <EuiLink>{insight.indexPattern}</EuiLink>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="xs">
              <strong>Detector:</strong> <EuiLink>{insight.detectorName}</EuiLink>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="xs" />

        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
          <EuiFlexItem>
            <EuiText size="xs" color="subdued">
              {insight.anomalyCount} anomal{insight.anomalyCount === 1 ? 'y' : 'ies'} detected
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="xs" color="subdued">
              Confidence: {Math.round(insight.confidence * 100)}%
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiHorizontalRule margin="s" />

        <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
          <EuiFlexItem>
            <EuiText size="xs" color="subdued">
              {new Date(insight.timestamp).toLocaleString()}
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiSmallButton size="s">
              Investigate
            </EuiSmallButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    </EuiFlexItem>
  );

  const renderRecentInsights = () => {
    if (recentInsights.length === 0) {
      return (
        <EuiEmptyPrompt
          iconType="visLine"
          title={<h3>No recent insights</h3>}
          body={
            <p>
              Daily insights will appear here once your monitoring jobs have collected enough data.
              Check back in 24 hours to see your first insights.
            </p>
          }
        />
      );
    }

    return (
      <EuiFlexGroup direction="column" gutterSize="m">
        {recentInsights.map(renderInsightCard)}
      </EuiFlexGroup>
    );
  };

  return (
    <React.Fragment>
      {hasActiveInsightsJob ? renderActiveInsightsDashboard() : renderSetupExperience()}
      
      <EnhancedSelectionModal
        isVisible={isModalVisible}
        selectedIndices={selectedIndicesForSetup}
        onSelectionChange={setSelectedIndicesForSetup}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={() => setIsModalVisible(false)}
        isLoading={isStartingInsights}
      />
    </React.Fragment>
  );
}
