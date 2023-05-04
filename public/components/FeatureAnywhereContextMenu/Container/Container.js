import React, { useState } from 'react';
import './styles.scss';
import AddAnomalyDetector from '../CreateAnomalyDetector';
import AssociatedDetectors from '../AssociatedDetectors/containers/AssociatedDetectors';
import AssociateExisting from '../CreateAnomalyDetector/AssociateExisting/containers/AssociateExisting';
import { DetectorListItem } from '../../../models/interfaces';

const Container = ({ startingFlyout, ...props }) => {
  const { embeddable } = props;
  console.log({ embeddable });
  const index = [{ label: embeddable?.vis?.data?.indexPattern?.title }];
  const [mode, setMode] = useState(startingFlyout);
  const [selectedDetectorId, setSelectedDetectorId] = useState();
  // const [allAssociatedDetectors, setAllAssociatedDetectors] = useState([])
  //const allAssociatedDetectors = getAllAssociatedDetectors(embeddable)

  const Flyout = {
    create: AddAnomalyDetector,
    associated: AssociatedDetectors,
    existing: AddAnomalyDetector,
  }[mode];

  return (
    <Flyout
      {...{
        ...props,
        setMode,
        selectedDetectorId,
        setSelectedDetectorId,
        mode,
        index,
        //   allAssociatedDetectors,
        //  setAllAssociatedDetectors
      }}
    />
  );
};

export default Container;
