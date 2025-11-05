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

import { CoreStart, AppMountParameters } from '../../../src/core/public';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { DailyInsights } from './pages/DailyInsights';
import { InsightsOverview } from './pages/DailyInsights/components/InsightsOverview';
import { IndicesManagement } from './pages/DailyInsights/components/IndicesManagement';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import { CoreServicesContext } from './components/CoreServices/CoreServices';
import { APP_PATH } from './utils/constants';

export function renderApp(coreStart: CoreStart, params: AppMountParameters, redirectPath?: string) {
  const http = coreStart.http;
  const store = configureStore(http);

  // Load Chart's dark mode CSS (if applicable)
  const isDarkMode = coreStart.uiSettings.get('theme:darkMode') || false;
  if (isDarkMode) {
    require('@elastic/charts/dist/theme_only_dark.css');
  } else {
    require('@elastic/charts/dist/theme_only_light.css');
  }

  const renderContent = () => {
    if (redirectPath) {
      // Direct navigation to specific sub-page
      switch (redirectPath) {
        case APP_PATH.DAILY_INSIGHTS_OVERVIEW:
          return <InsightsOverview />;
        case APP_PATH.DAILY_INSIGHTS_INDICES:
          return <IndicesManagement />;
        default:
          return <DailyInsights setActionMenu={params.setHeaderActionMenu} />;
      }
    }

    // Default tabbed interface
    return (
      <Switch>
        <Route
          path={APP_PATH.DAILY_INSIGHTS_OVERVIEW}
          render={() => <InsightsOverview />}
        />
        <Route
          path={APP_PATH.DAILY_INSIGHTS_INDICES}
          render={() => <IndicesManagement />}
        />
        <Route
          path={APP_PATH.DAILY_INSIGHTS}
          render={(props) => (
            <DailyInsights
              setActionMenu={params.setHeaderActionMenu}
              {...props}
            />
          )}
        />
      </Switch>
    );
  };

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <CoreServicesContext.Provider value={coreStart}>
          {renderContent()}
        </CoreServicesContext.Provider>
      </Router>
    </Provider>,
    params.element
  );
  return () => ReactDOM.unmountComponentAtNode(params.element);
}

