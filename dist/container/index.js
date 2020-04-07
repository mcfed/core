'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', {value: true});
// import {injectIntl, defineMessages} from 'react-intl';
var redux_1 = require('redux');
// import {connect} from 'react-redux';
var Selector = __importStar(require('../selector'));
var redux_module_1 = require('../middleware/redux-module');
var InjectFactory_1 = require('../InjectFactory');
function bindActionCreators(actions, dispatch) {
  var newActions = redux_1.bindActionCreators(actions, dispatch);
  for (var a in actions) {
    newActions[a].toString = actions[a].toString;
  }
  return newActions;
}
exports.bindActionCreators = bindActionCreators;
exports.defaultMapDispatchToProps = function(dispatch, props) {
  return {
    dispatch: dispatch
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
exports.defaultMergeProps = function(
  state,
  //@ts-ignore
  _a,
  ownProps
) {
  var dispatch = _a.dispatch,
    actions = _a.actions;
  var sagaActions = state.sagaActions,
    Action = state.Action,
    otherState = __rest(state, ['sagaActions', 'Action']);
  if (sagaActions) {
    actions = __assign(
      __assign({}, bindActionCreators(sagaActions, dispatch)),
      {
        cancelAction: function(action) {
          dispatch(redux_module_1.cancelTask(action.toString()));
        }
      }
    );
  } else if (Action) {
    actions = InjectFactory_1.Factory(Action);
  }
  // const messages = defineMessages(state.messages);
  return Object.assign(
    {},
    ownProps,
    otherState,
    {dispatch: dispatch, actions: actions},
    {
      spins: function(type) {
        return Selector.spins(state, type.toString());
      },
      querys: function(type) {
        return Selector.querys(state, type.toString());
      },
      dicts: function(type, value) {
        return Selector.dicts(state, type, value);
      },
      locale: function(type, vars) {
        if (ownProps.intl) {
          // if (messages[type]) {
          //   return ownProps.intl.formatMessage(messages[type], vars);
          // } else {
          //   return ownProps.intl.formatMessage({id: type}, vars);
          // }
        }
        return '';
      }
    }
  );
};
// export {connect};
