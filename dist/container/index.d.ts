import {AnyAction, Dispatch} from 'redux';
export declare function bindActionCreators(
  actions: AnyAction,
  dispatch: Dispatch
): AnyAction;
export declare const defaultMapDispatchToProps: (
  dispatch: Dispatch<AnyAction>,
  props: object
) => {
  dispatch: Dispatch<AnyAction>;
};
export declare const defaultMergeProps: (
  state: any,
  {
    dispatch,
    actions
  }: {
    dispatch: any;
    actions: any;
  },
  ownProps: any
) => any;
