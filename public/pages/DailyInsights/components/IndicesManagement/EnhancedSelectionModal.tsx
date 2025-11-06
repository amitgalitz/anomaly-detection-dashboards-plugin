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
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiPanel,
  EuiSpacer,
  EuiFieldSearch,
  EuiCheckbox,
  EuiText,
  EuiSmallButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBadge,
  EuiIcon,
  EuiBasicTable,
  EuiCompressedComboBox,
  EuiFormRow,
} from '@elastic/eui';
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { debounce, get } from 'lodash';
import { AppState } from '../../../../redux/reducers';
import {
  getClustersInfo,
  getIndicesAndAliases,
  getPrioritizedIndices,
} from '../../../../redux/reducers/opensearch';
import {
  CatIndex,
  ClusterInfo,
  IndexAlias,
} from '../../../../../server/models/types';
import {
  getDataSourceFromURL,
  getLocalCluster,
  sanitizeSearchText,
  getVisibleOptions,
} from '../../../utils/helpers';
import { getClusterOptionLabel } from '../../../DefineDetector/utils/helpers';

export interface ClusterOption {
  label: string;
  cluster: string;
  localcluster: string;
}

interface EnhancedSelectionModalProps {
  isVisible: boolean;
  selectedIndices: string[];
  onSelectionChange: (indices: string[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function EnhancedSelectionModal({
  isVisible,
  selectedIndices,
  onSelectionChange,
  onCancel,
  onConfirm,
  isLoading = false,
}: EnhancedSelectionModalProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const MDSQueryParams = getDataSourceFromURL(location);
  const dataSourceId = MDSQueryParams.dataSourceId;
  
  const opensearchState = useSelector((state: AppState) => state.opensearch);
  
  const [searchText, setSearchText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedClusters, setSelectedClusters] = useState<ClusterOption[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Load clusters when modal opens
      dispatch(getClustersInfo(dataSourceId));
    }
  }, [isVisible, dataSourceId, dispatch]);

  useEffect(() => {
    // Set default cluster selection (local cluster)
    if (opensearchState.clusters && opensearchState.clusters.length > 0) {
      const localCluster = getLocalCluster(opensearchState.clusters);
      setSelectedClusters(getVisibleClusterOptions(localCluster));
    }
  }, [opensearchState.clusters]);

  useEffect(() => {
    // Load indices when clusters change
    if (selectedClusters.length > 0) {
      const clustersString = getClustersStringForSearchQuery(selectedClusters);
      const localClusterExists = selectedClusters.some(
        (cluster) => cluster.localcluster === 'true'
      );
      dispatch(getIndicesAndAliases(searchText, dataSourceId, clustersString, localClusterExists));
    }
  }, [selectedClusters, searchText, dataSourceId, dispatch]);

  const getClustersStringForSearchQuery = (clusters: ClusterOption[]) => {
    return clusters
      .filter((cluster) => cluster.localcluster === 'false')
      .map((cluster) => cluster.cluster)
      .join(',');
  };

  const getVisibleClusterOptions = (clusters: ClusterInfo[]): ClusterOption[] => {
    if (clusters.length > 0) {
      const visibleClusters = clusters.map((value) => ({
        label: getClusterOptionLabel(value),
        cluster: value.name,
        localcluster: value.localCluster.toString(),
      }));
      return visibleClusters.sort((a, b) => {
        if (a.localcluster === 'true' && b.localcluster === 'false') return -1;
        if (a.localcluster === 'false' && b.localcluster === 'true') return 1;
        return a.label.localeCompare(b.label);
      });
    }
    return [];
  };

  // Get real indices and aliases from redux state
  const visibleIndices = get(opensearchState, 'indices', []) as CatIndex[];
  const visibleAliases = get(opensearchState, 'aliases', []) as IndexAlias[];
  const localClusterName = selectedClusters.find(c => c.localcluster === 'true')?.cluster || '';

  // Use same ordering as DataSource.tsx
  const groupedOptions = useMemo(() => {
    return getVisibleOptions(visibleIndices, visibleAliases, localClusterName);
  }, [visibleIndices, visibleAliases, localClusterName]);

  // Flatten grouped options with cluster prefixes and alias indicators
  const allIndices = useMemo(() => {
    const flattenedItems: Array<{name: string, displayName: string, type: 'index' | 'alias', group: string, docCount?: number, size?: string}> = [];
    
    groupedOptions.forEach(group => {
      // Determine cluster prefix from group label
      const isLocal = group.label.toLowerCase().includes('local');
      const clusterPrefix = isLocal ? '[Local]' : '[Remote]';
      
      group.options.forEach((option: any) => {
        // Determine if it's an index or alias based on the group label
        const isAlias = group.label.toLowerCase().includes('alias');
        const isIndex = group.label.toLowerCase().includes('indice');
        
        let type: 'index' | 'alias' = 'index';
        let docCount = 0;
        let size = '';
        let displayName = '';
        
        if (isAlias) {
          type = 'alias';
          displayName = `${clusterPrefix} ${option.label} (alias)`;
          // Find the corresponding alias to get target index
          const aliasInfo = visibleAliases.find(a => a.alias === option.label);
          size = aliasInfo ? `Alias for: ${aliasInfo.index}` : 'Alias';
        } else if (isIndex) {
          type = 'index';
          displayName = `${clusterPrefix} ${option.label}`;
          // Find the corresponding index to get doc count and size
          const indexInfo = visibleIndices.find(i => i.index === option.label);
          if (indexInfo) {
            docCount = parseInt(indexInfo['docs.count'] || '0');
            size = indexInfo['store.size'] || '0b';
          }
        }
        
        flattenedItems.push({
          name: option.label, // Keep original name for selection logic
          displayName, // Display name with cluster prefix and alias indicator
          type,
          group: group.label,
          docCount,
          size,
        });
      });
    });
    
    return flattenedItems;
  }, [groupedOptions, visibleIndices, visibleAliases]);

  const filteredIndices = useMemo(() => {
    return allIndices.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allIndices, searchText]);

  const { pageOfItems, totalItemCount } = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      pageOfItems: filteredIndices.slice(startIndex, endIndex),
      totalItemCount: filteredIndices.length,
    };
  }, [filteredIndices, pageIndex, pageSize]);

  const handleSearchChange = debounce(async (searchValue: string) => {
    const sanitizedQuery = sanitizeSearchText(searchValue);
    setSearchText(sanitizedQuery);
    setPageIndex(0); // Reset to first page on search
    
    if (selectedClusters.length > 0) {
      const clustersString = getClustersStringForSearchQuery(selectedClusters);
      await dispatch(getPrioritizedIndices(sanitizedQuery, dataSourceId, clustersString));
    }
  }, 300);

  const onTableChange = ({ page = {} }) => {
    const { index: newPageIndex, size: newPageSize } = page;
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleToggleIndex = (indexName: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIndices, indexName]);
    } else {
      onSelectionChange(selectedIndices.filter(i => i !== indexName));
    }
  };

  const handleClusterChange = (clusters: ClusterOption[]) => {
    setSelectedClusters(clusters);
    setPageIndex(0);
  };

  const handleClose = () => {
    setSearchText('');
    setPageIndex(0);
    onCancel();
  };

  if (!isVisible) {
    return null;
  }

  const visibleClusters = get(opensearchState, 'clusters', []) as ClusterInfo[];

  return (
    <EuiModal onClose={handleClose} style={{ width: 800 }}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          Select Indices for Auto Insights
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      
      <EuiModalBody>
        <EuiText size="s" color="subdued">
          <p>Choose indices where you want to automatically create anomaly detectors and generate daily insights.</p>
        </EuiText>
        <EuiSpacer size="m" />

        {/* Cluster Selection */}
        <EuiFormRow
          label="Clusters"
          helpText="Select clusters to search for indices"
        >
          <EuiCompressedComboBox
            placeholder="Select clusters"
            options={getVisibleClusterOptions(visibleClusters)}
            selectedOptions={selectedClusters}
            onChange={handleClusterChange}
            isLoading={opensearchState.requesting}
            isClearable={false}
          />
        </EuiFormRow>

        <EuiSpacer size="m" />
        
        {/* Selection Summary */}
        {selectedIndices.length > 0 && (
          <>
            <EuiPanel color="success" paddingSize="s">
              <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiText size="s"><strong>Selected: {selectedIndices.length} indices</strong></EuiText>
                  <EuiSpacer size="xs" />
                  <EuiFlexGroup wrap gutterSize="xs">
                    {selectedIndices.slice(0, 5).map(index => (
                      <EuiFlexItem grow={false} key={index}>
                        <EuiBadge color="success">{index}</EuiBadge>
                      </EuiFlexItem>
                    ))}
                    {selectedIndices.length > 5 && (
                      <EuiFlexItem grow={false}>
                        <EuiBadge color="hollow">+{selectedIndices.length - 5} more</EuiBadge>
                      </EuiFlexItem>
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSmallButton size="s" onClick={() => onSelectionChange([])}>
                    Clear All
                  </EuiSmallButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
            <EuiSpacer size="m" />
          </>
        )}
        
        {/* Search */}
        <EuiFieldSearch 
          placeholder="Search indices..." 
          compressed 
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPageIndex(0);
            handleSearchChange(e.target.value);
          }}
        />
        <EuiSpacer size="s" />
        
        {/* Simple Paginated Table */}
        <EuiBasicTable
          items={pageOfItems.map(item => ({ 
            ...item,
            isSelected: selectedIndices.includes(item.name) 
          }))}
          columns={[
            {
              field: 'name',
              name: `Index Pattern (${totalItemCount} total, ${selectedIndices.length} selected)`,
              render: (name: string, item: any) => (
                <EuiCheckbox
                  id={name}
                  label={
                    <EuiFlexGroup alignItems="center" gutterSize="s">
                      <EuiFlexItem grow={false}>
                        <EuiIcon type={item.type === 'alias' ? 'alias' : 'indexManagementApp'} />
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiText size="s">{item.displayName || name}</EuiText>
                        {item.type === 'alias' && (
                          <EuiText size="xs" color="subdued">{item.size}</EuiText>
                        )}
                      </EuiFlexItem>
                      {item.type === 'index' && item.docCount > 0 && (
                        <EuiFlexItem grow={false}>
                          <EuiBadge color="hollow">{item.docCount.toLocaleString()} docs</EuiBadge>
                        </EuiFlexItem>
                      )}
                      {item.isSelected && (
                        <EuiFlexItem grow={false}>
                          <EuiBadge color="success">Selected</EuiBadge>
                        </EuiFlexItem>
                      )}
                    </EuiFlexGroup>
                  }
                  checked={item.isSelected}
                  onChange={(e) => handleToggleIndex(name, e.target.checked)}
                />
              ),
            },
          ]}
          pagination={{
            pageIndex,
            pageSize,
            totalItemCount,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          onChange={onTableChange}
          loading={opensearchState.requesting}
          rowProps={(item) => ({
            style: {
              backgroundColor: item.isSelected ? '#F0F9FF' : 'transparent',
              borderLeft: item.isSelected ? '3px solid #0071C2' : '3px solid transparent',
            },
          })}
        />
      </EuiModalBody>

      <EuiModalFooter>
        <EuiSmallButton onClick={handleClose}>
          Cancel
        </EuiSmallButton>
        <EuiSmallButton
          fill
          color="primary"
          disabled={selectedIndices.length === 0}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Confirm Selection ({selectedIndices.length})
        </EuiSmallButton>
      </EuiModalFooter>
    </EuiModal>
  );
}
