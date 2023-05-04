//   /*
// * Copyright OpenSearch Contributors
// * SPDX-License-Identifier: Apache-2.0
// */

// import { useState, useEffect } from 'react';
// import _ from 'lodash';
// import { getSavedFeatureAnywhereLoader } from '../../../services';
// import { SavedObjectLoader } from '../../../../../../src/plugins/saved_objects/public';
// import { ISavedAugmentVis } from '../../../../../../src/plugins/vis_augmenter/public';

// import { get, isEmpty } from 'lodash';

// export const getAllAssociatedDetectors = (embeddable) => {
//     const savedObjectLoader: SavedObjectLoader = getSavedFeatureAnywhereLoader();
//     savedObjectLoader.findAll().then((resp: any) => {
//         if (resp != undefined) {
//           const savedAugmentObjectsArr: ISavedAugmentVis[] = get(
//             resp,
//             'hits',
//             []
//           );
//           const currentAssociatedDetectors = getAssociatedDetectors(
//             Object.values(allDetectors),
//             savedAugmentObjectsArr
//           );
//           console.log("currentAssociatedDetectors: " + currentAssociatedDetectors)
//           const curDetectorsToDisplayOnList = getExistingDetectorsAvalableToAssociate(currentAssociatedDetectors)
//           setExistingDetectorsAvailableToAssociate(curDetectorsToDisplayOnList);
//           setIsLoadingFinalDetectors(false);
//         }
//       });
// }

//   // Handle all changes in the assoicated detectors such as unlinking or new detectors associated
//   useEffect(() => {
//     // Gets all augmented saved objects

//   }, [allDetectors]);

//   const getExistingDetectorsAvalableToAssociate = (currentAssociatedDetectors: DetectorListItem[]) => {
//     console.log("current associated detectors: " + JSON.stringify(currentAssociatedDetectors))
//     return currentAssociatedDetectors

//   }

//   // cross checks all the detectors that exist with all the savedAugment Objects to only display ones
//   // that are associated to the current visualization
//   const getAssociatedDetectors = (
//     detectors: DetectorListItem[],
//     savedAugmentObjects: ISavedAugmentVis[]
//   ) => {
//     // Filter all savedAugmentObjects that aren't linked to the specific visualization
//     console.log("vizID: " + JSON.stringify(embeddableVisId));
//     const savedAugmentForThisVisualization: ISavedAugmentVis[] =
//       savedAugmentObjects.filter(
//         (savedObj) => get(savedObj, 'visId', '') === embeddableVisId
//       );

//       console.log("savedAugmentForThisVisualization: " + JSON.stringify(savedAugmentForThisVisualization))

//     // Map all detector IDs for all the found augmented vis objects
//     const savedAugmentDetectorsSet = new Set(
//       savedAugmentForThisVisualization.map((savedObject) =>
//         get(savedObject, 'pluginResourceId', '')
//       )
//     );
//     console.log("savedAugmentDetectorsSet: " + JSON.stringify(savedAugmentDetectorsSet))

//     // filter out any detectors that aren't on the set of detectors IDs from the augmented vis objects.
//     const detectorsToDisplay = detectors.filter((detector) =>
//       savedAugmentDetectorsSet.has(detector.id)
//     );
//     return detectorsToDisplay;
//   };
