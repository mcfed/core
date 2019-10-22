import createSagaMiddleware from 'redux-saga';
import * as is from '@redux-saga/is';
import {SAGA_ACTION} from '@redux-saga/symbols';
import * as asEffect from 'redux-saga/effects';
import {createStore, combineReducers} from 'redux';

export const EFFECT_TRIGGERED = 'EFFECT_TRIGGERED';
export const EFFECT_RESOLVED = 'EFFECT_RESOLVED';
export const EFFECT_REJECTED = 'EFFECT_REJECTED';
export const EFFECT_CANCELLED = 'EFFECT_CANCELLED';
export const ACTION_DISPATCHED = 'ACTION_DISPATCHED';
export const SET_SHARED_REF = 'SET_SHARED_REF';
export const STATUS_PENDING = 'STATUS_PENDING';
export const STATUS_RESOLVED = 'STATUS_RESOLVED';
export const STATUS_REJECTED = 'STATUS_REJECTED';
export const STATUS_CANCELLED = 'STATUS_CANCELLED';

const CHILDREN = Symbol('CHILDREN');

function getPathToEffect(effect, effectsById) {
  let effectId = effect.effectId;
  const path = [effectId];
  effectId = effect ? effect.parentEffectId : effectId;
  if (effectId) {
    path.push(effectId);
    effect = effectsById[effectId];
  }
  return path.reverse();
}

export function rootEffectIds(state = [], action) {
  if (action.type === EFFECT_TRIGGERED && action.effect.root) {
    return [...state, action.effect.effectId];
  }
  return state;
}

export function effectIds(state = [], action) {
  switch (action.type) {
    case EFFECT_TRIGGERED:
      return state.concat(action.effect.effectId);
    default:
      return state;
  }
}

export function effectsById(state = {}, action) {
  let effectId, effect, newState;
  switch (action.type) {
    case EFFECT_TRIGGERED:
      effect = action.effect;
      effectId = effect.effectId;
      newState = {
        ...state,
        [effectId]: {
          ...effect,
          status: STATUS_PENDING,
          start: action.time,
          path: effect.parentEffectId
            ? getPathToEffect(effect, state)
            : [effectId],
          [CHILDREN]: []
        }
      };
      /**
        ugly  hack. store children along with the effects
        this shouldn't be accessed by any other outside UI
        it's only there so the maybeSetRaceWinner could access race's children
      **/
      const parent = state[effect.parentEffectId];
      if (parent && asEffect.race(parent.effect)) {
        parent[CHILDREN].push(effect);
      }
      return newState;

    case EFFECT_RESOLVED:
      effectId = action.effectId;
      effect = state[effectId];
      newState = {
        ...state,
        [effectId]: settleEffect(effect, action)
      };
      // console.log(effect,action.result,newState)
      return maybeSetRaceWinner(effect, action.result || {}, newState);
    case EFFECT_REJECTED:
      effectId = action.effectId;
      return {
        ...state,
        [effectId]: settleEffect(state[effectId], action, true)
      };
    case EFFECT_CANCELLED:
      effectId = action.effectId;
      return {
        ...state,
        [effectId]: cancelEffect(state[effectId], action)
      };
    default:
      return state;
  }
}

function settleEffect(effect, action, isError) {
  return {
    ...effect,
    result: action.result,
    error: action.error,
    status: isError ? STATUS_REJECTED : STATUS_RESOLVED,
    end: action.time,
    time: action.time - effect.start
  };
}

function cancelEffect(effect, action) {
  return {
    ...effect,
    status: STATUS_CANCELLED,
    end: action.time,
    time: action.time - effect.start
  };
}

export function effectsByParentId(state = {}, action) {
  if (action.type === EFFECT_TRIGGERED) {
    const effect = action.effect;
    const parentId = effect.parentEffectId;
    if (parentId) {
      const siblings = state[parentId];
      return {
        ...state,
        [parentId]: !siblings
          ? [effect.effectId]
          : [...siblings, effect.effectId]
      };
    }
  }
  return state;
}

function maybeSetRaceWinner(effect, result, state) {
  if (asEffect.race(effect.effect)) {
    const label = Object.keys(result)[0];
    const children = effect[CHILDREN];
    for (var i = 0; i < children.length; i++) {
      const ch = children[i];
      if (ch.label === label) {
        // we mutate the state, b/c we know it's already a new generated state from effectsById
        state[ch.effectId] = {
          ...state[ch.effectId],
          winner: true
        };
        return state;
      }
    }
  }
  return state;
}

export function dispatchedActions(state = [], monitorAction) {
  if (monitorAction.type === ACTION_DISPATCHED) {
    const {id, action, time, isSagaAction} = monitorAction;
    return state.concat({id, action, time, isSagaAction});
  }
  return state;
}

export function sharedRef(state = {}, action) {
  if (action.type === SET_SHARED_REF) {
    return {
      ...state,
      [action.key]: action.sharedRef
    };
  }
  return state;
}

const reducers = combineReducers({
  rootEffectIds,
  effectIds,
  effectsById,
  effectsByParentId,
  dispatchedActions,
  sharedRef
});

function getTime() {
  if (typeof performance !== 'undefined' && performance.now)
    return performance.now();
  else return Date.now();
}

export function createSagaMonitor({
  rootReducer,
  storeDispatch,
  time = getTime,
  dispatch: customDispatch
} = {}) {
  let store;
  let dispatch;

  store = createStore(reducers);
  dispatch = store.dispatch;

  function effectTriggered(effect) {
    // console.log(arguments)
    dispatch({
      type: EFFECT_TRIGGERED,
      effect,
      time: time()
    });
    // console.log(effect)
  }

  function effectResolved(effectId, result) {
    // console.log(effectId, result)
    if (is.task(result)) {
      // console.log(store.getState().effectsById,effectId)
      result.toPromise().then(
        taskResult => {
          if (result.isCancelled()) effectCancelled(effectId);
          else effectResolved(effectId, taskResult);
          storeDispatch({
            type: '@@MIDDLEWARE/FETCH_RES',
            payload: store.getState().effectsById[effectId].effect.payload
              .args[0],
            [SAGA_ACTION]: true
          });
        },
        taskError => {
          // console.log(effectId,taskError)
          effectRejected(effectId, taskError);
          if (!taskError) {
            storeDispatch({
              type: '@@MIDDLEWARE/FETCH_RES',
              payload: store.getState().effectsById[effectId].effect.payload
                .args[0],
              [SAGA_ACTION]: true
            });
          } else {
            storeDispatch({
              type: '@@MIDDLEWARE/FETCH_RES',
              payload: store.getState().effectsById[effectId].effect.payload
                .args[0],
              [SAGA_ACTION]: true
            });
            console.error(taskError);
          }
        }
      );
    } else {
      const action = {
        type: EFFECT_RESOLVED,
        effectId,
        result,
        time: time()
      };
      dispatch(action);
    }
  }

  function effectRejected(effectId, error) {
    const action = {
      type: EFFECT_REJECTED,
      effectId,
      error,
      time: time()
    };
    dispatch(action);
  }

  function effectCancelled(effectId) {
    const action = {
      type: EFFECT_CANCELLED,
      effectId,
      time: time()
    };
    // console.log("effectCancelled action",action)
    dispatch(action);
  }

  function actionDispatched(action) {
    const isSagaAction = action[SAGA_ACTION];
    const now = time();

    dispatch({
      type: ACTION_DISPATCHED,
      id: now,
      action,
      isSagaAction,
      time: now
    });
    // console.log(action,!isSagaAction , action.meta && action.meta['sagaAction'] ,storeDispatch)
    if (
      !isSagaAction &&
      action.meta &&
      action.meta['sagaAction'] &&
      storeDispatch
    ) {
      storeDispatch({
        type: '@@MIDDLEWARE/FETCH_PARAMS',
        payload: action,
        [SAGA_ACTION]: true
      });
      storeDispatch({
        type: '@@MIDDLEWARE/FETCH_REQ',
        payload: action,
        [SAGA_ACTION]: true
      });
    }
    // console.log("actionDispatched action",ACTION_DISPATCHED,now,isSagaAction,action,now)
  }

  return {
    get store() {
      return store;
    },
    effectTriggered,
    effectResolved,
    effectRejected,
    effectCancelled,
    actionDispatched
  };
}

export default function sagaMonitorMiddleware({getState, dispatch}) {
  return createSagaMiddleware({
    sagaMonitor: createSagaMonitor({
      rootReducer: reducers,
      storeDispatch: dispatch
    })
  });
}
