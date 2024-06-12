/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const featureData = [
  { data_start_time: 0, current_value: 8, forecast: [{}] },
  {
    data_start_time: 1,
    current_value: 10,
    feature_data: {
      feature_id: 'cpu_avg',
      feature_name: 'cpu_avg',
      data: 10,
    },
    forecast: [
      { data_start_time: 1, value: 10, lower: 10, upper: 10 },
      { data_start_time: 2, value: 14, lower: 13, upper: 16 },
      { data_start_time: 3, value: 16, lower: 14, upper: 19 },
      { data_start_time: 4, value: 20, lower: 17, upper: 24 },
      { data_start_time: 5, value: 22, lower: 18, upper: 27 },
      { data_start_time: 6, value: 26, lower: 21, upper: 32 },
      { data_start_time: 7, value: 30, lower: 24, upper: 38 },
    ],
  },
  {
    data_start_time: 2,
    current_value: 15,
    feature_data: {
      feature_id: 'cpu_avg',
      feature_name: 'cpu_avg',
      data: 10,
    },
    feature_datas: 10,
    forecast: [
      { data_start_time: 2, value: 15, lower: 15, upper: 15 },
      { data_start_time: 3, value: 24, lower: 20, upper: 25 },
      { data_start_time: 4, value: 26, lower: 25, upper: 37 },
      { data_start_time: 5, value: 41, lower: 36, upper: 52 },
      { data_start_time: 6, value: 46, lower: 37, upper: 54 },
      { data_start_time: 7, value: 57, lower: 40, upper: 58 },
      { data_start_time: 8, value: 60, lower: 41, upper: 68 },
      { data_start_time: 9, value: 55, lower: 40, upper: 70 },
    ],
  },
];

export type ForecastingDataInterface = {
  data_start_time: number;
  current_value: number;
  forecast: {
    data_start_time: number;
    value: number;
    lower: number;
    upper: number;
  }[];
};

export const ForecastingData: ForecastingDataInterface[] = [
  { data_start_time: 0, current_value: 8, forecast: [{}] },
  {
    data_start_time: 1,
    current_value: 10,
    forecast: [
      { data_start_time: 1, value: 10, lower: 10, upper: 10 },
      { data_start_time: 2, value: 14, lower: 13, upper: 16 },
      { data_start_time: 3, value: 16, lower: 14, upper: 19 },
      { data_start_time: 4, value: 20, lower: 17, upper: 24 },
      { data_start_time: 5, value: 22, lower: 18, upper: 27 },
      { data_start_time: 6, value: 26, lower: 21, upper: 32 },
      { data_start_time: 7, value: 30, lower: 24, upper: 38 },
    ],
  },
  {
    data_start_time: 2,
    current_value: 15,
    forecast: [
      { data_start_time: 2, value: 15, lower: 15, upper: 15 },
      { data_start_time: 3, value: 24, lower: 20, upper: 25 },
      { data_start_time: 4, value: 26, lower: 25, upper: 37 },
      { data_start_time: 5, value: 41, lower: 36, upper: 52 },
      { data_start_time: 6, value: 46, lower: 37, upper: 54 },
      { data_start_time: 7, value: 57, lower: 40, upper: 58 },
      { data_start_time: 8, value: 60, lower: 41, upper: 68 },
      { data_start_time: 9, value: 55, lower: 40, upper: 70 },
    ],
  },
  {
    data_start_time: 3,
    current_value: 23,
    forecast: [
      { data_start_time: 3, value: 23, lower: 23, upper: 23 },

      { data_start_time: 4, value: 25, lower: 20, upper: 27 },
      { data_start_time: 5, value: 30, lower: 25, upper: 37 },
      { data_start_time: 6, value: 45, lower: 36, upper: 52 },
      { data_start_time: 7, value: 46, lower: 37, upper: 54 },
      { data_start_time: 8, value: 49, lower: 40, upper: 58 },
      { data_start_time: 9, value: 58, lower: 41, upper: 68 },
      { data_start_time: 10, value: 55, lower: 40, upper: 70 },
    ],
  },
  {
    data_start_time: 4,
    current_value: 25,
    forecast: [
      { data_start_time: 4, value: 25, lower: 25, upper: 25 },
      { data_start_time: 5, value: 25, lower: 25, upper: 25 },
      { data_start_time: 6, value: 30, lower: 25, upper: 37 },
      { data_start_time: 7, value: 45, lower: 36, upper: 52 },
      { data_start_time: 8, value: 46, lower: 37, upper: 54 },
      { data_start_time: 9, value: 49, lower: 40, upper: 58 },
      { data_start_time: 10, value: 58, lower: 41, upper: 68 },
      { data_start_time: 11, value: 55, lower: 40, upper: 70 },
    ],
  },
  { data_start_time: 5, current_value: 20, forecast: [{}] },
  { data_start_time: 6, current_value: 35, forecast: [{}] },
  {
    data_start_time: 7,
    current_value: 42,
    forecast: [
      { data_start_time: 7, value: 42, lower: 42, upper: 42 },
      { data_start_time: 8, value: 40, lower: 39, upper: 42 },
      { data_start_time: 9, value: 39, lower: 37, upper: 42 },
      { data_start_time: 10, value: 41, lower: 36, upper: 44 },
      { data_start_time: 11, value: 43, lower: 38, upper: 47 },
      { data_start_time: 12, value: 44, lower: 38, upper: 48 },
      { data_start_time: 13, value: 46, lower: 39, upper: 51 },
      { data_start_time: 14, value: 49, lower: 40, upper: 56 },
    ],
  },
  {
    data_start_time: 8,
    current_value: 50,
    forecast: [{}],
  },
  {
    data_start_time: 9,
    current_value: 57,
    forecast: [
      { data_start_time: 9, value: 57, lower: 57, upper: 57 },
      { data_start_time: 10, value: 62, lower: 58, upper: 71 },
      { data_start_time: 11, value: 61, lower: 60, upper: 80 },
      { data_start_time: 12, value: 66, lower: 61, upper: 70 },
      { data_start_time: 13, value: 70, lower: 62, upper: 74 },
      { data_start_time: 14, value: 73, lower: 64, upper: 78 },
      { data_start_time: 15, value: 76, lower: 65, upper: 80 },
      { data_start_time: 16, value: 82, lower: 72, upper: 84 },
    ],
  },
];

export const ForecastingDataThree: ForecastingDataInterface[] = [
  { data_start_time: 0, current_value: 8, forecast: [{}] },
  {
    data_start_time: 1,
    current_value: 10,
    forecast: [
      { data_start_time: 1, value: 10, lower: 10, upper: 10 },
      { data_start_time: 2, value: 14, lower: 13, upper: 16 },
      { data_start_time: 3, value: 16, lower: 14, upper: 19 },
      { data_start_time: 4, value: 20, lower: 17, upper: 24 },
      { data_start_time: 5, value: 22, lower: 18, upper: 27 },
      { data_start_time: 6, value: 26, lower: 21, upper: 32 },
      { data_start_time: 7, value: 30, lower: 24, upper: 38 },
    ],
  },
  {
    data_start_time: 2,
    current_value: 15,
    forecast: [
      { data_start_time: 2, value: 15, lower: 15, upper: 15 },
      { data_start_time: 3, value: 24, lower: 20, upper: 25 },
      { data_start_time: 4, value: 26, lower: 25, upper: 37 },
      { data_start_time: 5, value: 41, lower: 36, upper: 52 },
      { data_start_time: 6, value: 46, lower: 37, upper: 54 },
      { data_start_time: 7, value: 57, lower: 40, upper: 58 },
      { data_start_time: 8, value: 60, lower: 41, upper: 68 },
      { data_start_time: 9, value: 55, lower: 40, upper: 70 },
    ],
  },
  {
    data_start_time: 3,
    current_value: 23,
    forecast: [
      { data_start_time: 3, value: 23, lower: 23, upper: 23 },

      { data_start_time: 4, value: 25, lower: 20, upper: 27 },
      { data_start_time: 5, value: 30, lower: 25, upper: 37 },
      { data_start_time: 6, value: 45, lower: 36, upper: 52 },
      { data_start_time: 7, value: 46, lower: 37, upper: 54 },
      { data_start_time: 8, value: 49, lower: 40, upper: 58 },
      { data_start_time: 9, value: 58, lower: 41, upper: 68 },
      { data_start_time: 10, value: 55, lower: 40, upper: 70 },
    ],
  },
  {
    data_start_time: 4,
    current_value: 25,
    forecast: [
      { data_start_time: 4, value: 25, lower: 25, upper: 25 },
      { data_start_time: 5, value: 25, lower: 25, upper: 25 },
      { data_start_time: 6, value: 30, lower: 25, upper: 37 },
      { data_start_time: 7, value: 45, lower: 36, upper: 52 },
      { data_start_time: 8, value: 46, lower: 37, upper: 54 },
      { data_start_time: 9, value: 49, lower: 40, upper: 58 },
      { data_start_time: 10, value: 58, lower: 41, upper: 68 },
      { data_start_time: 11, value: 55, lower: 40, upper: 70 },
    ],
  },
  { data_start_time: 5, current_value: 20, forecast: [{}] },
  { data_start_time: 6, current_value: 35, forecast: [{}] },
  {
    data_start_time: 7,
    current_value: 42,
    forecast: [
      { data_start_time: 7, value: 42, lower: 42, upper: 42 },
      { data_start_time: 8, value: 40, lower: 39, upper: 42 },
      { data_start_time: 9, value: 39, lower: 37, upper: 42 },
      { data_start_time: 10, value: 41, lower: 36, upper: 44 },
      { data_start_time: 11, value: 43, lower: 38, upper: 47 },
      { data_start_time: 12, value: 44, lower: 38, upper: 48 },
      { data_start_time: 13, value: 46, lower: 39, upper: 51 },
      { data_start_time: 14, value: 49, lower: 40, upper: 56 },
    ],
  },
  {
    data_start_time: 8,
    current_value: 50,
    forecast: [{}],
  },
  {
    data_start_time: 9,
    current_value: 57,
    forecast: [
      { data_start_time: 9, value: 57, lower: 57, upper: 57 },
      { data_start_time: 10, value: 62, lower: 58, upper: 71 },
      { data_start_time: 11, value: 61, lower: 60, upper: 80 },
      { data_start_time: 12, value: 66, lower: 61, upper: 70 },
      { data_start_time: 13, value: 70, lower: 62, upper: 74 },
      { data_start_time: 14, value: 73, lower: 64, upper: 78 },
      { data_start_time: 15, value: 76, lower: 65, upper: 80 },
      { data_start_time: 16, value: 82, lower: 72, upper: 84 },
    ],
  },
  {
    data_start_time: 10,
    current_value: 60,
    forecast: [
      { data_start_time: 10, value: 57, lower: 57, upper: 57 },
      { data_start_time: 11, value: 62, lower: 58, upper: 71 },
      { data_start_time: 12, value: 61, lower: 60, upper: 80 },
      { data_start_time: 13, value: 66, lower: 61, upper: 70 },
      { data_start_time: 14, value: 70, lower: 62, upper: 74 },
      { data_start_time: 15, value: 73, lower: 64, upper: 78 },
      { data_start_time: 16, value: 76, lower: 65, upper: 80 },
      { data_start_time: 17, value: 82, lower: 72, upper: 84 },
    ],
  },
  {
    data_start_time: 11,
    current_value: 50,
    forecast: [
      { data_start_time: 12, value: 57, lower: 57, upper: 57 },
      { data_start_time: 13, value: 62, lower: 58, upper: 71 },
      { data_start_time: 14, value: 61, lower: 60, upper: 80 },
      { data_start_time: 15, value: 66, lower: 61, upper: 70 },
      { data_start_time: 16, value: 70, lower: 62, upper: 74 },
      { data_start_time: 17, value: 73, lower: 64, upper: 78 },
      { data_start_time: 18, value: 76, lower: 65, upper: 80 },
      { data_start_time: 19, value: 82, lower: 72, upper: 84 },
    ],
  },
  {
    data_start_time: 12,
    current_value: 40,
    forecast: [
      { data_start_time: 12, value: 57, lower: 57, upper: 57 },
      { data_start_time: 13, value: 62, lower: 58, upper: 71 },
      { data_start_time: 14, value: 61, lower: 60, upper: 80 },
      { data_start_time: 15, value: 66, lower: 61, upper: 70 },
      { data_start_time: 16, value: 70, lower: 62, upper: 74 },
      { data_start_time: 17, value: 73, lower: 64, upper: 78 },
      { data_start_time: 18, value: 76, lower: 65, upper: 80 },
      { data_start_time: 19, value: 82, lower: 72, upper: 84 },
    ],
  },
  {
    data_start_time: 13,
    current_value: 70,
    forecast: [
      { data_start_time: 12, value: 57, lower: 57, upper: 57 },
      { data_start_time: 13, value: 62, lower: 58, upper: 71 },
      { data_start_time: 14, value: 61, lower: 60, upper: 80 },
      { data_start_time: 15, value: 66, lower: 61, upper: 70 },
      { data_start_time: 16, value: 70, lower: 62, upper: 74 },
      { data_start_time: 17, value: 73, lower: 64, upper: 78 },
      { data_start_time: 18, value: 76, lower: 65, upper: 80 },
      { data_start_time: 19, value: 82, lower: 72, upper: 84 },
    ],
  },
];

export const ForecastingDataFuture = [
  { data_start_time: 4, current_value: 25, lower: 25, upper: 25 },
  { data_start_time: 5, current_value: 30, lower: 25, upper: 37 },
  { data_start_time: 6, current_value: 45, lower: 36, upper: 52 },
  { data_start_time: 7, current_value: 46, lower: 37, upper: 54 },
  { data_start_time: 8, current_value: 49, lower: 40, upper: 58 },
  { data_start_time: 9, current_value: 58, lower: 41, upper: 68 },
  { data_start_time: 10, current_value: 55, lower: 40, upper: 70 },
];

export const ForecastDataTwo = [
  {
    data_start_time: 1,
    current_value: 15,
  },
  { data_start_time: 2, current_value: 30, forecast: [{}] },
  { data_start_time: 3, current_value: 40, forecast: [{}] },
];
