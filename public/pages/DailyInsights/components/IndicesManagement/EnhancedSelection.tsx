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
} from '@elastic/eui';
import React, { useState, useMemo } from 'react';
import ContentPanel from '../../../../components/ContentPanel/ContentPanel';

interface EnhancedSelectionProps {
  selectedIndices: string[];
  onSelectionChange: (indices: string[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function EnhancedSelection({
  selectedIndices,
  onSelectionChange,
  onCancel,
  onConfirm,
}: EnhancedSelectionProps) {
  const [searchText, setSearchText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // TODO: Replace with actual indices from redux
  const mockIndices = useMemo(() => {
    const indices = [];
    const prefixes = ['logs', 'metrics', 'traces', 'events', 'alerts'];
    const services = ['web', 'api', 'database', 'auth', 'payment', 'search', 'cache', 'queue', 'worker', 'admin'];
    const environments = ['prod', 'staging', 'dev', 'test'];
    
    // Generate 100 indices
    for (let i = 0; i < 100; i++) {
      const prefix = prefixes[i % prefixes.length];
      const service = services[Math.floor(i / prefixes.length) % services.length];
      const env = environments[Math.floor(i / (prefixes.length * services.length)) % environments.length];
      const suffix = Math.floor(i / (prefixes.length * services.length * environments.length)) + 1;
      
      indices.push(`${prefix}-${service}-${env}${suffix > 1 ? `-${suffix}` : ''}-*`);
    }
    
    return indices;
  }, []);

  const filteredIndices = useMemo(() => {
    return mockIndices.filter(index => 
      index.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [mockIndices, searchText]);

  const { pageOfItems, totalItemCount } = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      pageOfItems: filteredIndices.slice(startIndex, endIndex),
      totalItemCount: filteredIndices.length,
    };
  }, [filteredIndices, pageIndex, pageSize]);

  const onTableChange = ({ page = {} }) => {
    const { index: newPageIndex, size: newPageSize } = page;
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleToggleIndex = (index: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIndices, index]);
    } else {
      onSelectionChange(selectedIndices.filter(i => i !== index));
    }
  };

  return (
    <ContentPanel title="Select Indices - Enhanced Search View" titleSize="m">
      <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiText size="s">Search and select indices for anomaly detection</EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiSmallButton onClick={onCancel}>Cancel</EuiSmallButton>
        </EuiFlexItem>
      </EuiFlexGroup>
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
      
      {/* Search and Table */}
      <EuiFieldSearch 
        placeholder="Search indices..." 
        compressed 
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPageIndex(0); // Reset to first page on search
        }}
      />
      <EuiSpacer size="s" />
      
      <EuiBasicTable
        items={pageOfItems.map(index => ({ 
          index, 
          isSelected: selectedIndices.includes(index) 
        }))}
        columns={[
          {
            field: 'index',
            name: 'Index Pattern',
            render: (index: string, item: { index: string; isSelected: boolean }) => (
              <EuiCheckbox
                id={index}
                label={
                  <EuiFlexGroup alignItems="center" gutterSize="s">
                    <EuiFlexItem grow={false}>
                      <EuiIcon type="indexManagementApp" />
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiText size="s">{index}</EuiText>
                    </EuiFlexItem>
                    {item.isSelected && (
                      <EuiFlexItem grow={false}>
                        <EuiBadge color="success">Selected</EuiBadge>
                      </EuiFlexItem>
                    )}
                  </EuiFlexGroup>
                }
                checked={item.isSelected}
                onChange={(e) => handleToggleIndex(index, e.target.checked)}
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
        rowProps={(item) => ({
          style: {
            backgroundColor: item.isSelected ? '#F0F9FF' : 'transparent',
            borderLeft: item.isSelected ? '3px solid #0071C2' : '3px solid transparent',
          },
        })}
      />
      
      <EuiSpacer size="m" />
      <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiSmallButton onClick={onCancel}>Cancel</EuiSmallButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiSmallButton
            fill
            color="primary"
            disabled={selectedIndices.length === 0}
            onClick={onConfirm}
          >
            Confirm Selection ({selectedIndices.length})
          </EuiSmallButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </ContentPanel>
  );
}
