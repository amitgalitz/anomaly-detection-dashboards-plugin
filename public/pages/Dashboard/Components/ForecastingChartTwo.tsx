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

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DetectorListItem } from '../../../models/interfaces';
import {
  AD_DOC_FIELDS,
  DAY_IN_MILLI_SECS,
  MIN_IN_MILLI_SECS,
} from '../../../../server/utils/constants';
import {
  EuiBadge,
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingChart,
  EuiSelectable,
  //@ts-ignore
  EuiStat,
  EuiSuperSelect,
  EuiSuperSelectOption,
} from '@elastic/eui';
import { get, isEmpty } from 'lodash';
import moment, { Moment } from 'moment';
import ContentPanel from '../../../components/ContentPanel/ContentPanel';
import {
  Chart,
  Axis,
  Settings,
  Position,
  LineSeries,
  niceTimeFormatter,
  ScaleType,
  LineAnnotation,
  AnnotationDomainType,
  LineAnnotationDatum,
  CurveType,
  AreaSeries,
} from '@elastic/charts';
import { EuiText, EuiTitle } from '@elastic/eui';
import React from 'react';
import { TIME_NOW_LINE_STYLE } from '../utils/constants';
import { SHOW_DECIMAL_NUMBER_THRESHOLD } from '../../../../server/utils/helpers';
import {
  visualizeAnomalyResultForXYChart,
  getFloorPlotTime,
  getLatestAnomalyResultsForDetectorsByTimeRange,
  getLatestAnomalyResultsByTimeRange,
} from '../utils/utils';
import { MAX_ANOMALIES, SPACE_STR } from '../../../utils/constants';
import { ALL_CUSTOM_AD_RESULT_INDICES } from '../../utils/constants';
import { searchResults } from '../../../redux/reducers/anomalyResults';

import {
  ForecastingData,
  ForecastingDataFuture,
  ForecastDataTwo,
  featureData,
} from './utils/ForecastConstants';
import { FEATURE_CHART_THEME } from '../../AnomalyCharts/utils/constants';
import { integer } from '@opensearch-project/opensearch/api/types';

export interface AnomaliesLiveChartProps {
  selectedDetectors: DetectorListItem[];
}

interface LiveTimeRangeState {
  startDateTime: Moment;
  endDateTime: Moment;
}

const MAX_LIVE_DETECTORS = 10;

export const ForecastingChartTwo = (props: AnomaliesLiveChartProps) => {
  const dispatch = useDispatch();

  const [liveTimeRange, setLiveTimeRange] = useState<LiveTimeRangeState>({
    startDateTime: moment().subtract(31, 'minutes'),
    endDateTime: moment(),
  });

  const [lastAnomalyResult, setLastAnomalyResult] = useState<object>();

  const [liveAnomalyData, setLiveAnomalyData] = useState([] as object[]);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(true);

  const [hasLatestAnomalyResult, setHasLatestAnomalyResult] = useState(true);

  const [latestAnomalousDetectorsCount, setLatestLiveAnomalousDetectorsCount] =
    useState(0);

  const getLiveAnomalyResults = async () => {
    setIsLoadingAnomalies(true);
    // check if there is any anomaly result in last 30mins
    // need to initially check if there is an error when accessing anomaly results index
    // in the case that it doesn't exist upon cluster initialization
    let latestSingleLiveAnomalyResult = [] as any[];
    try {
      latestSingleLiveAnomalyResult = await getLatestAnomalyResultsByTimeRange(
        searchResults,
        '30m',
        dispatch,
        -1,
        1,
        true,
        ALL_CUSTOM_AD_RESULT_INDICES,
        false
      );
    } catch (err) {
      console.log(
        'Error getting latest anomaly results - index may not exist yet',
        err
      );
      setIsLoadingAnomalies(false);
    }

    setHasLatestAnomalyResult(!isEmpty(latestSingleLiveAnomalyResult));

    // get anomalies(anomaly_grade>0) in last 30mins
    const latestLiveAnomalyResult =
      await getLatestAnomalyResultsForDetectorsByTimeRange(
        searchResults,
        props.selectedDetectors,
        '30m',
        dispatch,
        0,
        MAX_ANOMALIES,
        MAX_LIVE_DETECTORS,
        false,
        ALL_CUSTOM_AD_RESULT_INDICES,
        false
      );
    setLiveAnomalyData(latestLiveAnomalyResult);

    setLatestLiveAnomalousDetectorsCount(
      new Set(
        latestLiveAnomalyResult.map((anomalyData) =>
          get(anomalyData, AD_DOC_FIELDS.DETECTOR_ID, '')
        )
      ).size
    );

    if (!isEmpty(latestLiveAnomalyResult)) {
      setLastAnomalyResult(latestLiveAnomalyResult[0]);
    } else {
      setLastAnomalyResult(undefined);
    }

    setLiveTimeRange({
      startDateTime: moment().subtract(100, 'minutes'),
      endDateTime: moment(),
    });
    setIsLoadingAnomalies(false);
  };

  useEffect(() => {
    getLiveAnomalyResults();
    const id = setInterval(getLiveAnomalyResults, DAY_IN_MILLI_SECS);
    return () => {
      clearInterval(id);
    };
  }, [props.selectedDetectors]);

  const timeFormatter = niceTimeFormatter([
    liveTimeRange.startDateTime.valueOf(),
    liveTimeRange.endDateTime.valueOf(),
  ]);

  const visualizedAnomalies = liveAnomalyData.flatMap((anomalyResult) =>
    visualizeAnomalyResultForXYChart(anomalyResult)
  );

  //   const getLineStyles = ({ stroke, strokeWidth, dash }: Partial<LineProps> = {}, group?: string): LineProps => ({
  //     stroke: color('Stroke', stroke ?? '#ccc', group),
  //     strokeWidth: number('Stroke width', strokeWidth ?? 2, { min: 1, max: 6, range: true, step: 1 }, group),
  //     dash: (
  //       array(
  //         'Dash',
  //         (dash ?? []).map((n) => `${n}`),
  //         ',',
  //         group,
  //       ) ?? []
  //     ).map((s) => parseInt(s, 10)),
  //   });

  //   const theme: PartialTheme = {
  //     crosshair: {
  //       line: getLineStyles({ stroke: 'red' }, 'Crosshair line'),
  //       crossLine: getLineStyles({ stroke: 'red', dash: [4, 4] }, 'Crosshair cross line'),
  //     },
  //   };

  const prepareVisualizedAnomalies = (
    liveVisualizedAnomalies: object[]
  ): object[] => {
    // add data point placeholder at every minute,
    // to ensure chart evenly distrubted
    const existingPlotTimes = liveVisualizedAnomalies.map((anomaly) =>
      getFloorPlotTime(get(anomaly, AD_DOC_FIELDS.PLOT_TIME, 0))
    );
    const result = [...liveVisualizedAnomalies];

    for (
      let currentTime = getFloorPlotTime(liveTimeRange.startDateTime.valueOf());
      currentTime <= liveTimeRange.endDateTime.valueOf();
      currentTime += MIN_IN_MILLI_SECS
    ) {
      if (existingPlotTimes.includes(currentTime)) {
        continue;
      }
      result.push({
        [AD_DOC_FIELDS.DETECTOR_NAME]: !isEmpty(liveAnomalyData)
          ? ''
          : SPACE_STR,
        [AD_DOC_FIELDS.PLOT_TIME]: currentTime,
        [AD_DOC_FIELDS.ANOMALY_GRADE]: null,
      });
    }
    return result;
  };

  //    const Options = ["1","2","3"];
  //     const [options, setOptions] = useState(Options);

  const timeNowAnnotation = {
    dataValue: getFloorPlotTime(liveTimeRange.endDateTime.valueOf()),
    header: 'Now',
    details: liveTimeRange.endDateTime.format('MM/DD/YY h:mm A'),
  } as LineAnnotationDatum;

  const annotations = [timeNowAnnotation];

  const fullScreenButton = () => (
    <EuiButton
      onClick={() => setIsFullScreen((isFullScreen) => !isFullScreen)}
      iconType={isFullScreen ? 'exit' : 'fullScreen'}
      aria-label="View full screen"
      data-test-subj="dashboardFullScreenButton"
    >
      {isFullScreen ? 'Exit full screen' : 'View full screen'}
    </EuiButton>
  );

  const getFutureData = (startTime: integer) => {
    let forecastedValues = ForecastingData[startTime].forecast;

    console.log('forecastedData: ' + JSON.stringify(forecastedValues));
    return forecastedValues;
  };

  const dropDownOptions: EuiSuperSelectOption<T>[] = ForecastingData.map(
    (x) => ({
      value: x.data_start_time,
      inputDisplay: x.data_start_time,
    })
  );
  const [value, setValue] = useState(dropDownOptions[1].value);

  const onChange = (value) => {
    setValue(value);
  };

  const findNearestCorrectValue = (xValue) => {
    if (ForecastingData[xValue].forecast.length > 1) {
      console.log('inside check for nearest value 1');

      setValue(xValue);
    } else {
      console.log('inside check for nearest value 2');
      let leftIndex = xValue - 1;
      let rightIndex = xValue + 1;

      while (leftIndex >= 0 || rightIndex < ForecastingData.length) {
        if (leftIndex >= 0 && ForecastingData[leftIndex].forecast.length > 1) {
          // If dataCool array of the object to the left is non-empty, return that object
          console.log(
            'forecasting data: ' + JSON.stringify(ForecastingData[leftIndex])
          );
          setValue(leftIndex);
          return;
        }

        if (
          rightIndex < ForecastingData.length &&
          ForecastingData[rightIndex].forecast.length > 1
        ) {
          // If dataCool array of the object to the right is non-empty, return that object
          console.log(
            'forecasting data: ' + JSON.stringify(ForecastingData[rightIndex])
          );
          setValue(rightIndex);
          return;
        }

        // Move indices to the left and right
        leftIndex--;
        rightIndex++;
      }
    }
  };

  const handleOnClick = (event) => {
    console.log('click: ' + JSON.stringify(event));
    const specId = event?.[0]?.[1]?.specId;
    if (specId === 'current') {
      console.log('spec is current');

      const forecast = event?.[0]?.[0]?.datum?.forecast;
      if (Array.isArray(forecast)) {
        console.log('forecast is an array');
        console.log('forecast length: ' + forecast.length);
        if (forecast.length === 1) {
          if (Object.keys(forecast[0].length === 0)) {
            console.log('no forecast data');
            const xValue = event?.[0]?.[0]?.x;
            console.log('xValue: ' + xValue);
            findNearestCorrectValue(xValue);
            return;
          }
        }

        const xValue = event?.[0]?.[0]?.x;

        setValue(xValue);
      } else {
        console.log("forecast isn't an array");
      }
    }
  };
  const OnElementOver = () => {
    console.log('value: ' + event);
  };
  const onElementOut = () => {
    console.log('value: ' + event);
  };

  const getXDomainMax = () => {
    const horizon = 10;
  };

  // const onElementListeners = {
  //   onElementClick: onClick('onElementClick'),
  // };

  // const onElementListeners = {
  //   onElementClick: onClick('onElementClick'),
  //   onElementOver: OnElementOver('onElementOver'),
  //   onElementOut: onElementOut('onElementOut'),
  // };

  const FORECAST_LINE_THEME = {
    line: {
      strokeWidth: 2,
      visible: true,
      opacity: 1,
      color: 'violet',
    },
    point: {
      visible: false,
    },
  };
  const BOUNDS_LINE_THEME = {
    line: {
      strokeWidth: 0,
      visible: false,
      opacity: 1,
      color: 'violet',
    },
  };
  return (
    <ContentPanel
      style={{ padding: '40px' }}
      title={
        <EuiTitle size="s" data-test-subj="dashboardLiveAnomaliesHeader">
          <h3>
            Forecasting Chart{' '}
            <EuiBadge color={hasLatestAnomalyResult ? '#DB1374' : '#DDD'}>
              Live
            </EuiBadge>
          </h3>
        </EuiTitle>
      }
      //   subTitle={`Live anomaly results across detectors for the last 30 minutes.
      //             'The results refresh every 1 minute.
      //             'For each detector, if an anomaly occurrence is detected at the end of the detector interval,
      //             'you will see a bar representing its anomaly grade.`}
      actions={[fullScreenButton()]}
      contentPanelClassName={isFullScreen ? 'full-screen' : undefined}
    >
      {isLoadingAnomalies ? (
        <EuiFlexGroup
          justifyContent="center"
          style={{ height: '353px', paddingTop: '175px' }}
        >
          <EuiFlexItem grow={false}>
            <EuiLoadingChart size="xl" />
          </EuiFlexItem>
        </EuiFlexGroup>
      ) : !hasLatestAnomalyResult ? (
        <EuiText
          style={{
            color: '#666666',
            paddingTop: '12px',
            paddingBottom: '4px',
          }}
        >
          <p>
            All matching detectors are under initialization or stopped for the
            last 30 minutes. Please adjust filters or come back later.
          </p>
        </EuiText>
      ) : (
        // show below content as long as there exists anomaly data,
        // regardless of whether anomaly grade is 0 or larger.
        [
          <div
            className="test-div"
            style={{
              paddingBottom: '30px',
              overflowX: 'scroll',
            }}
          >
            {[
              <div
                style={{
                  height: isFullScreen ? '400px' : '200px',
                  width: '300%',
                  opacity: 1,
                }}
              >
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiFlexItem style={{ minWidth: 150 }}>
                      <EuiSuperSelect
                        options={dropDownOptions}
                        valueOfSelected={value}
                        onChange={(value) => onChange(value)}
                      />
                    </EuiFlexItem>
                  </EuiFlexItem>
                </EuiFlexGroup>

                <Chart>
                  <Settings
                    // hide legend if there only exists anomalies with 0 anomaly grade
                    showLegend={true}
                    legendPosition={Position.Top}
                    onElementClick={handleOnClick}
                    //TODO: research more why only set this old property will work.
                    showLegendExtra={false}
                    //theme={FEATURE_CHART_THEME}
                    showLegendDisplayValue={false}
                    xDomain={{
                      min: 0,
                      max: 20,
                    }}
                  />
                  <LineAnnotation
                    id={'lineAnnotation'}
                    domainType={AnnotationDomainType.XDomain}
                    dataValues={annotations}
                    style={TIME_NOW_LINE_STYLE}
                    marker={'Now'}
                  />
                  <Axis
                    id="current_value"
                    title="value"
                    position={Position.Left}
                    showGridLines
                  />
                  <Axis
                    id="data_start_time"
                    title="time"
                    position={Position.Bottom}
                    showGridLines
                  />
                  <LineSeries
                    id={'current'}
                    xScaleType={ScaleType.Time}
                    timeZone="local"
                    yScaleType="linear"
                    xAccessor={'data_start_time'}
                    yAccessors={['current_value']}
                    //splitSeriesAccessors={[AD_DOC_FIELDS.DETECTOR_NAME]}
                    data={ForecastingData}
                  />
                  {/* <LineSeries
                    id={'feature'}
                    xScaleType={ScaleType.Time}
                    timeZone="local"
                    yScaleType="linear"
                    xAccessor={"data_start_time"}
                    yAccessors={["feature_datas"]}
                    //splitSeriesAccessors={[AD_DOC_FIELDS.DETECTOR_NAME]}
                    data={featureData}
                  /> */}
                  <LineSeries
                    lineSeriesStyle={FORECAST_LINE_THEME}
                    id={'Future'}
                    xScaleType={ScaleType.Time}
                    timeZone="local"
                    yScaleType="linear"
                    xAccessor={'data_start_time'}
                    yAccessors={['value']}
                    //splitSeriesAccessors={[AD_DOC_FIELDS.DETECTOR_NAME]}
                    data={getFutureData(value)}
                  />
                  <AreaSeries
                    id="bounds"
                    xScaleType={ScaleType.Time}
                    yScaleType={ScaleType.Linear}
                    xAccessor="data_start_time"
                    yAccessors={['upper']}
                    y0Accessors={['lower']}
                    // y1AccessorFormat={y1AccessorFormat || undefined}
                    // y0AccessorFormat={y0AccessorFormat || undefined}
                    data={getFutureData(value)}
                    curve={CurveType.CURVE_MONOTONE_X}
                    areaSeriesStyle={BOUNDS_LINE_THEME}
                  />

                  {/* <LineSeries
                    id={'Forecasted Values'}
                    xScaleType={ScaleType.Time}
                    timeZone="local"
                    yScaleType="linear"
                    xAccessor={"current_time"}
                    yAccessors={["current_value"]}
                    
                    //splitSeriesAccessors={[AD_DOC_FIELDS.DETECTOR_NAME]}
                    data={ForecastingDataFuture}
                  /> */}
                </Chart>
              </div>,
            ]}
          </div>,
        ]
      )}
    </ContentPanel>
  );
};
