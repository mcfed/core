import {FetchUtils} from 'mcf-utils';
import * as fragment from './fragment';

export function fetchList(params) {
  // const query = FetchUtils.processGraphqlParams(params);
  return FetchUtils.fetchGraphqlList(`${API_PREFIX}/graphql`, {
    body: {
      operationName: 'user',
      query: fragment.getFragmentList,
      variables: params
    }
  });
}

export function fetchItem(params) {
  return FetchUtils.fetchGet(`${API_PREFIX}/userManage/user/info/${params.id}`);
}

export function fetchSave(params) {
  params.roles = [params.roles];
  return FetchUtils.fetchPost(`${API_PREFIX}/userManage/user/add`, {
    body: params
  });
}

export function fetchUpdate(params) {
  params.roles = [params.roles];
  return FetchUtils.fetchPost(`${API_PREFIX}/userManage/user/update`, {
    body: params
  });
}

export function fetchDelete(params) {
  return FetchUtils.fetchPost(
    `${API_PREFIX}/userManage/user/opr/${params.ids[0]}/delete`,
    {
      body: {}
    }
  );
}

export function fetchEnable(params) {
  return FetchUtils.fetchPost(
    `${API_PREFIX}/userManage/user/opr/${params.id}/enable`,
    {
      body: {}
    }
  );
}

export function fetchDisable(params) {
  return FetchUtils.fetchPost(
    `${API_PREFIX}/userManage/user/opr/${params.id}/disable`,
    {
      body: {}
    }
  );
}
export function fetchReset(params) {
  return FetchUtils.fetchPost(
    `${API_PREFIX}/userManage/user/password/reset/${params}`,
    {
      body: {}
    }
  );
}
