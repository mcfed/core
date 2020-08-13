// import {injectIntl, defineMessages} from 'react-intl';
import {bindActionCreators as bindActions, AnyAction, Dispatch} from 'redux';
// import {connect} from 'react-redux';
import * as Selector from '../selector';
import {cancelTask} from '../middleware/redux-module';
import {Factory} from '../InjectFactory';

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

// export function connectContainer(
//   mapStateToProps: any,
//   mapDispatchToProps: any = defaultMapDispatchToProps,
//   mergeProps: any = defaultMergeProps,
//   options?: any
// ) {
//   let args = arguments;
//   return (component: any) => {
//     return injectIntl(
//       connect(
//         mapStateToProps,
//         mapDispatchToProps,
//         mergeProps,
//         options
//       )(component)
//     );
//   };
// }

// export function containerFactory(
//   mapStateToProps: any,
//   mapDispatchToProps: any = defaultMapDispatchToProps,
//   mergeProps: any = defaultMergeProps,
//   options?: any
// ) {
//   return (component: any) => {
//     return injectIntl(
//       connect(
//         mapStateToProps,
//         mapDispatchToProps,
//         mergeProps,
//         options
//       )(component)
//     );
//   };
// }

export const defaultMergeProps = (
  state: any,
  //@ts-ignore
  {dispatch, actions},
  ownProps: any
) => {
  let {sagaActions, Action, ...otherState} = state;
  if (sagaActions) {
    actions = {
      ...bindActionCreators(sagaActions, dispatch),
      cancelAction: function(action: AnyAction) {
        dispatch(cancelTask(action.toString()));
      }
    };
  } else if (state.actions) {
    actions = state.actions;
  }
  return Object.assign(
    {},
    ownProps,
    otherState,
    {dispatch, actions},
    {
      spins: function(type: Function) {
        return Selector.spins(state, type.toString());
      },
      querys: function(type: Function) {
        return Selector.querys(state, type.toString());
      },
      dicts: function(type: string, value: any) {
        return Selector.dicts(state, type, value);
      },
      locale: function(type: string, vars: any) {
        if (ownProps.intl) {
          if (otherState.messages[type]) {
            return ownProps.intl.formatMessage(otherState.messages[type], vars);
          } else {
            return ownProps.intl.formatMessage({id: type}, vars);
          }
        } else if (ownProps.i18n) {
          return ownProps.i18n.t(type, vars);
        }
        return '';
      }
    }
  );
};

// export {connect};
