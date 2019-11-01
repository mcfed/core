import {injectIntl} from 'react-intl';
import {bindActionCreators as bindActions, AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import * as Selector from '../selector';
import {cancelTask} from '../middleware/redux-module';

export function bindActionCreators(actions: AnyAction, dispatch: Dispatch) {
  let newActions = bindActions(actions, dispatch);
  for (var a in actions) {
    newActions[a].toString = actions[a].toString;
  }
  return newActions;
}

export const defaultMapDispatchToProps = (
  dispatch: Dispatch,
  props: object
) => {
  return {
    dispatch
  };
};

export function connectContainer(
  mapStateToProps: any,
  mapDispatchToProps: any = defaultMapDispatchToProps,
  mergeProps: any = defaultMergeProps,
  options: any
) {
  let args = arguments;
  return (component: any) => {
    return injectIntl(
      connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        options
      )(component)
    );
  };
}

//@ts-ignore
export const defaultMergeProps = (
  state: any,
  {dispatch, actions},
  ownProps: any
) => {
  // console.log(ownProps)
  actions &&
    Object.assign(actions, {
      cancelAction: function(action: AnyAction) {
        dispatch(cancelTask(action.toString()));
      }
    });
  return Object.assign(
    {},
    ownProps,
    state,
    {dispatch, actions},
    {
      spins: function(type: string) {
        return Selector.spins(state, type);
      },
      querys: function(type: string) {
        return Selector.querys(state, type);
      },
      dicts: function(type: string, value: any) {
        return Selector.dicts(state, type, value);
      },
      locale: function(type: string, vars: any) {
        if (state.intl) {
          if (state.messages[type]) {
            return state.intl.formatMessage(state.messages[type], vars);
          } else {
            return state.intl.formatMessage({id: type}, vars);
          }
        }
        return '';
      }
    }
  );
};

export {connect};
