﻿import { getBackendSrv } from 'app/core/services/backend_srv';
import { ThunkResult } from 'app/types';

import { apiKeysLoaded, includeExpiredToggled, isFetching } from './reducers';

export function loadApiKeys(): ThunkResult<void> {
  return async (dispatch) => {
    dispatch(isFetching());
    const [keys, keysIncludingExpired] = await Promise.all([
      getBackendSrv().get('/api/auth/keys?includeExpired=false&accesscontrol=true'),
      getBackendSrv().get('/api/auth/keys?includeExpired=true&accesscontrol=true'),
    ]);
    dispatch(apiKeysLoaded({ keys, keysIncludingExpired }));
  };
}

export function deleteApiKey(id: number): ThunkResult<void> {
  return async (dispatch) => {
    getBackendSrv()
      .delete(`/api/auth/keys/${id}`)
      .then(() => dispatch(loadApiKeys()));
  };
}

export function migrateApiKey(id: number): ThunkResult<void> {
  return async (dispatch) => {
    try {
      await getBackendSrv().post(`/api/serviceaccounts/migrate/${id}`);
    } finally {
      dispatch(loadApiKeys());
    }
  };
}

export function migrateAll(): ThunkResult<void> {
  return async (dispatch) => {
    try {
      await getBackendSrv().post('/api/serviceaccounts/migrate');
    } finally {
      dispatch(loadApiKeys());
    }
  };
}

export function hideApiKeys(): ThunkResult<void> {
  return async (dispatch) => {
    await getBackendSrv().post('/api/serviceaccounts/hideApiKeys');
  };
}

export function toggleIncludeExpired(): ThunkResult<void> {
  return (dispatch) => {
    dispatch(includeExpiredToggled());
  };
}
