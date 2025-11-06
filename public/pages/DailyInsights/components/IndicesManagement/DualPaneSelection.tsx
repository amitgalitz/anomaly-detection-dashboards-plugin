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
  EuiTitle,
  EuiSpacer,
  EuiFieldSearch,
  EuiCheckbox,
  EuiText,
  EuiSmallButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
} from '@elastic/eui';
import React, { useState } from 'react';
import ContentPanel from '../../../../components/ContentPanel/ContentPanel';

interface DualPaneSelectionProps {
  selectedIndices: string[];
  onSelectionChange: (indices: string[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DualPaneSelection({
  selectedIndices,
  onSelectionChange,
  onCancel,
  onConfirm,
}: DualPaneSelectionProps) {
  const [searchText, setSearchText] = useState('');

  // TODO: Replace with actual indices from redux
  const mockIndices = ['logs-database-*', 'metrics-system-*', 'logs-nginx-*', 'traces-frontend-*'];

  const handleToggleIndex = (index: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIndices, index]);
    } else {
      onSelectionChange(selectedIndices.filter(i => i !== index));
    }
  };

  const handleRemoveIndex = (index: string) => {
    onSelectionChange(selectedIndices.filter(i => i !== index));
  };

  return (
    <ContentPanel title="Select Indices - Dual Pane View" titleSize="m">
      <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiText size="s">Choose indices for anomaly detection</EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiSmallButton onClick={onCancel}>Cancel</EuiSmallButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="m" />
      
      <EuiFlexGroup gutterSize="m">
        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiTitle size="xs"><h4>Available Indices</h4></EuiTitle>
            <EuiSpacer size="s" />
            <EuiFieldSearch 
              placeholder="Search indices..." 
              compressed 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <EuiSpacer size="s" />
            <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #D3DAE6', padding: '8px' }}>
              {mockIndices
                .filter(index => index.toLowerCase().includes(searchText.toLowerCase()))
                .map(index => (
                <div key={index} style={{ padding: '4px 0' }}>
                  <EuiCheckbox
                    id={index}
                    label={index}
                    checked={selectedIndices.includes(index)}
                    onChange={(e) => handleToggleIndex(index, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          </EuiPanel>
        </EuiFlexItem>
        
        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiTitle size="xs"><h4>Selected Indices ({selectedIndices.length})</h4></EuiTitle>
            <EuiSpacer size="s" />
            <EuiFlexGroup gutterSize="xs">
              <EuiFlexItem grow={false}>
                <EuiSmallButton size="s" onClick={() => onSelectionChange([])}>
                  Clear All
                </EuiSmallButton>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="s" />
            <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #D3DAE6', padding: '8px' }}>
              {selectedIndices.length === 0 ? (
                <EuiText size="s" color="subdued">No indices selected</EuiText>
              ) : (
                selectedIndices.map(index => (
                  <div key={index} style={{ 
                    padding: '4px 0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <EuiText size="s">{index}</EuiText>
                    <EuiButtonIcon
                      iconType="cross"
                      size="s"
                      onClick={() => handleRemoveIndex(index)}
                    />
                  </div>
                ))
              )}
            </div>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
      
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
