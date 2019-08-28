import {injectIntl} from 'react-intl';
import {sagaActions} from './saga';
import {namespace} from './model';
import {ModuleContainer, ModuleModel} from 'mcf-module';

const {connect, bindActionCreators, defaultMergeProps} = ModuleContainer;
const {reducerItemSelector, reducerListSelector} = ModuleModel;

// const mapStateToProps = (state, props) => {
//   return {
//     intl: props.intl,
//     appReducer: state.appReducer,
//     fetchingReducer: state.fetchingReducer,
//     reducer: state[namespace],
//     items: reducerListSelector(state.ORMReducer, namespace),
//     item: reducerItemSelector(
//       state.ORMReducer,
//       namespace,
//       props.match.params.id
//     )
//   };
// };
//
// const mapDispatchToProps = (dispatch, props) => {
//   // console.log(bindActionCreators(sagaActions, dispatch))
//   return {
//     actions: bindActionCreators(sagaActions, dispatch),
//     dispatch
//   };
// };
//
// export const FormContainer = injectIntl(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//     defaultMergeProps
//   )(() => 'Form')
// );
// export const DetailContainer = injectIntl(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//     defaultMergeProps
//   )(() => 'Edit')
// );
// export const ListContainer = injectIntl(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps,
//     defaultMergeProps
//   )(() => 'List')
// );
