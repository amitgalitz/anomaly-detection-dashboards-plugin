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
  EuiSmallButton,
  EuiSelectable,
  EuiSelectableOption,
  EuiText,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiTextColor,
  EuiBadge,
  EuiCompressedComboBox,
  EuiFormRow,
} from '@elastic/eui';
import React, { useState, useEffect, useCallback, Fragment } from 'react';
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
} from '../../../utils/helpers';
import { getClusterOptionLabel } from '../../../DefineDetector/utils/helpers';

interface IndexOption extends EuiSelectableOption {
  key: string;
  description?: string;
  docCount?: number;
  size?: string;
}

export interface ClusterOption {
  label: string;
  cluster: string;
  localcluster: string;
}

interface IndicesSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (selectedIndices: string[]) => void;
  excludedIndices: string[];
  isLoading?: boolean;
}

const renderOption = (option: IndexOption) => {
  const label = (
    <EuiText className="eui-textTruncate" size="s">
      {option.label}
    </EuiText>
  );

  if (option.description || option.docCount !== undefined) {
    return (
      <EuiFlexGroup alignItems="center" style={{ overflow: 'hidden' }}>
        <EuiFlexItem style={{ overflow: 'hidden' }}>
          <EuiFlexGroup direction="column" gutterSize="xs">
            <EuiFlexItem>{label}</EuiFlexItem>
            {option.description && (
              <EuiFlexItem>
                <EuiTextColor color="subdued">
                  <EuiText className="eui-textTruncate" size="xs">
                    {option.description}
                  </EuiText>
                </EuiTextColor>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="column" gutterSize="xs" alignItems="flexEnd">
            {option.docCount !== undefined && (
              <EuiFlexItem>
                <EuiBadge color="hollow">
                  {option.docCount.toLocaleString()} docs
                </EuiBadge>
              </EuiFlexItem>
            )}
            {option.size && (
              <EuiFlexItem>
                <EuiTextColor color="subdued">
                  <EuiText size="xs">{option.size}</EuiText>
                </EuiTextColor>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  return label;
};

const convertIndicesToOptions = (
  indices: CatIndex[],
  aliases: IndexAlias[],
  excludedIndices: string[],
  selectedIndices: string[]
): IndexOption[] => {
  const indexOptions = indices
    .filter(index => !excludedIndices.includes(index.index))
    .map(index => ({
      label: index.index,
      key: index.index,
      docCount: parseInt(index['docs.count'] || '0'),
      size: index['store.size'] || '0b',
      checked: selectedIndices.includes(index.index) ? ('on' as const) : undefined,
      prepend: <EuiIcon type="indexManagementApp" color="success" />,
    }));

  const aliasOptions = aliases
    .filter(alias => !excludedIndices.includes(alias.alias))
    .map(alias => ({
      label: alias.alias,
      key: alias.alias,
      description: `Alias for: ${alias.index}`,
      checked: selectedIndices.includes(alias.alias) ? ('on' as const) : undefined,
      prepend: <EuiIcon type="alias" color="primary" />,
    }));

  return [...indexOptions, ...aliasOptions];
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

export const IndicesSelectionModal = ({
  isVisible,
  onClose,
  onConfirm,
  excludedIndices,
  isLoading = false,
}: IndicesSelectionModalProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const MDSQueryParams = getDataSourceFromURL(location);
  const dataSourceId = MDSQueryParams.dataSourceId;
  
  const opensearchState = useSelector((state: AppState) => state.opensearch);
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<ClusterOption[]>([]);
  const [options, setOptions] = useState<IndexOption[]>([]);
  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    if (isVisible) {
      dispatch(getClustersInfo(dataSourceId));
    }
  }, [isVisible, dataSourceId, dispatch]);

  useEffect(() => {
    if (opensearchState.clusters && opensearchState.clusters.length > 0) {
      const localCluster = getLocalCluster(opensearchState.clusters);
      setSelectedClusters(getVisibleClusterOptions(localCluster));
    }
  }, [opensearchState.clusters]);

  useEffect(() => {
    if (selectedClusters.length > 0) {
      const clustersString = getClustersStringForSearchQuery(selectedClusters);
      const localClusterExists = selectedClusters.some(
        (cluster) => cluster.localcluster === 'true'
      );
      dispatch(getIndicesAndAliases(queryText, dataSourceId, clustersString, localClusterExists));
    }
  }, [selectedClusters, queryText, dataSourceId, dispatch]);

  useEffect(() => {
    const visibleIndices = get(opensearchState, 'indices', []) as CatIndex[];
    const visibleAliases = get(opensearchState, 'aliases', []) as IndexAlias[];
    setOptions(convertIndicesToOptions(visibleIndices, visibleAliases, excludedIndices, selectedIndices));
  }, [opensearchState.indices, opensearchState.aliases, excludedIndices, selectedIndices]);

  const getClustersStringForSearchQuery = (clusters: ClusterOption[]) => {
    return clusters
      .filter((cluster) => cluster.localcluster === 'false')
      .map((cluster) => cluster.cluster)
      .join(',');
  };

  const handleSearchChange = debounce(async (searchValue: string) => {
    const sanitizedQuery = sanitizeSearchText(searchValue);
    setQueryText(sanitizedQuery);
    
    if (selectedClusters.length > 0) {
      const clustersString = getClustersStringForSearchQuery(selectedClusters);
      await dispatch(getPrioritizedIndices(sanitizedQuery, dataSourceId, clustersString));
    }
  }, 300);

  const handleSelectionChange = useCallback((newOptions: IndexOption[]) => {
    setSelectedIndices(
      newOptions.flatMap(({ checked, key }) => (checked === 'on' && key ? [key] : []))
    );
  }, []);

  const handleClusterChange = (clusters: ClusterOption[]) => {
    setSelectedClusters(clusters);
    setSelectedIndices([]);
  };

  const handleConfirm = () => {
    onConfirm(selectedIndices);
    setSelectedIndices([]);
  };

  const handleClose = () => {
    setSelectedIndices([]);
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  const visibleClusters = get(opensearchState, 'clusters', []) as ClusterInfo[];

  return (
    <EuiModal onClose={handleClose} style={{ width: 630 }}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          Select Indices for Auto Insights
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      
      <EuiModalBody>
        <EuiText size="s" color="subdued">
          <p>
            Choose indices where you want to automatically create anomaly detectors and generate daily insights.
          </p>
        </EuiText>
        <EuiSpacer size="m" />

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
        
        <EuiSelectable
          aria-label="Select indices for auto insights"
          searchable
          listProps={{ bordered: true, onFocusBadge: false }}
          searchProps={{
            placeholder: 'Search indices...',
            compressed: true,
            onSearch: handleSearchChange,
          }}
          options={options}
          onChange={handleSelectionChange}
          isLoading={opensearchState.requesting}
          renderOption={renderOption}
        >
          {(list, search) => (
            <Fragment>
              {search}
              {list}
            </Fragment>
          )}
        </EuiSelectable>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiSmallButton onClick={handleClose}>
          Cancel
        </EuiSmallButton>
        <EuiSmallButton
          onClick={handleConfirm}
          isDisabled={selectedIndices.length === 0}
          isLoading={isLoading}
          fill
        >
          Start Auto Insights ({selectedIndices.length} selected)
        </EuiSmallButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
