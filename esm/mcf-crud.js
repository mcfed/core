import { Component } from 'react';
import PropTypes from 'prop-types';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var Page =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Page, _Component);

  function Page() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Page.prototype;

  _proto.componentWillMount = function componentWillMount() {
    var _this$props = this.props,
        history = _this$props.history,
        match = _this$props.match; // console.log(history,match)
  };

  _proto.goBack = function goBack() {
    var history = this.props.history;
    history.goBack();
  };

  _proto.goAdd = function goAdd() {
    this.goRoutes("add");
  };

  _proto.goEdit = function goEdit(route) {
    this.goRoutes(route + "/edit");
  };

  _proto.goList = function goList(route) {
    this.goRoutes("" + route);
  };

  _proto.goDetail = function goDetail(route) {
    this.goRoutes("" + route);
  };

  _proto.goRoutes = function goRoutes(route) {
    var _this$props2 = this.props,
        history = _this$props2.history,
        match = _this$props2.match; // console.log(route,match.url)

    history.push(match.url + "/" + route);
  };

  _proto.render = function render() {
    return undefined;
  };

  return Page;
}(Component);

/**
 * 列表页的父类组件
 * @type {component}
 */

var ListPage =
/*#__PURE__*/
function (_Page) {
  _inheritsLoose(ListPage, _Page);

  function ListPage(props) {
    var _this;

    _this = _Page.call(this, props) || this;
    _this.state = {
      selectedRows: [],
      selectedRowKeys: []
    };
    return _this;
  } //缺失深度合并，只做一级合并


  var _proto = ListPage.prototype;

  _proto.mergeTableConfig = function mergeTableConfig(config) {
    return Object.assign({
      size: 'middle',
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        size: "middle" // showTotal:this.showTotal(this),

      },
      style: {
        width: '100%'
      }
    }, config, config.rowSelection === null ? {} : {
      rowSelection: _extends({
        onChange: this.onSelectChange.bind(this),
        selectedRowKeys: this.state.selectedRowKeys
      }, config.rowSelection)
    });
  };
  /**
   * 组件开始请求获取数据
   * @return {[type]} [description]
   */


  _proto.componentWillMount = function componentWillMount() {
    var actions = this.props.actions; //  actions.listAction();
  };
  /**
   * [onSelectChange ]
   * @param  {[type]} selectedRowKeys [description]
   * @param  {[type]} selectedRows    [description]
   * @return {[type]}                 [description]
   */


  _proto.onSelectChange = function onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    });
  };
  /*
  selectRowShow(reactNode){
    const {selectedRowKeys}=this.state
    return selectedRowKeys.length>0 ? (<div className="ant-table-title-toolbar" style={{textAlign:'left'}}><span>已选<span className="countNum">{selectedRowKeys.length}</span>条数据</span>{reactNode}</div>) :null
  }
  */

  /**
   * [isMultipleSelect 判断当前是否多选]
   * @return {[boolean]} [返回是否多选状态]
   */


  _proto.isSelectMultiple = function isSelectMultiple() {
    return this.getSelectLength() >= 1;
  };
  /**
   * [isSelectSingle 判断当前是否单选]
   * @return {[boolean]} [返回是否多选状态]
   */


  _proto.isSelectSingle = function isSelectSingle() {
    return this.getSelectLength() == 1;
  };
  /**
   * [selectMultiple 判断当前是否多选]
   * 方法反实现过时处理
   * 建议使用isSelectMultiple
   * @return {[boolean]} [返回是否多选状态]
   */


  _proto.selectMultiple = function selectMultiple() {
    return this.getSelectLength() <= 0;
  };
  /**
   * [selectSingle 判断当前是否单选]
   * 方法反实现过时处理
   * 建议使用isSelectSingle
   * @return {[type]} [返回当前是否单选状态]
   */


  _proto.selectSingle = function selectSingle() {
    return this.getSelectLength() != 1;
  };
  /**
   * [getSelectLength 获取当前列表选中记录数量]
   * @return {[number]} [返回选中记录数量]
   */


  _proto.getSelectLength = function getSelectLength() {
    return this.getSelectRows().length;
  };
  /**
   * [getSelectKeys 获取选中列表的RowKeys]
   * @return {[array[string]]} [返回数组 keys]
   */


  _proto.getSelectKeys = function getSelectKeys() {
    return this.state.selectedRowKeys;
  };
  /**
   * [getSelectRows 获取选中列表行数据]
   * @return {[array[object]]} [返回选中记录数据]
   */


  _proto.getSelectRows = function getSelectRows() {
    return this.state.selectedRows;
  };
  /**
   * [getSearchParams 获取路径参数对象]
   * @return {[URLSearchParams]} [URLSearchParams]
   */


  _proto.getSearchParams = function getSearchParams() {
    var search = this.props.location.search;
    return new URLSearchParams(search.substring(1));
  };
  /**
   * [clearSelectRows 清空已选列清数据记录]
   * @return null
   **/


  _proto.clearSelectRows = function clearSelectRows() {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    });
  };
  /**
   * 新增路由监听
   * @return {无}
   */


  _proto.handleAddRoute = function handleAddRoute() {
    this.goAdd();
  };
  /**
   * 编辑路由监听
   * @param  {key} id [description]
   * @return {[type]}    [description]
   */


  _proto.handleEditRoute = function handleEditRoute(id) {
    var key = id || this.getSelectKeys();
    this.goEdit(key);
  };
  /**
   * 编辑路由监听
   * @param  {key} id [description]
   * @return {[type]}    [description]
   */


  _proto.handleDetailRoute = function handleDetailRoute(id) {
    var key = id || this.getSelectKeys();
    this.goDetail(key);
  };
  /**
   * 取消或回退路由监听
   * @return {[null]}
   */


  _proto.handleBackRoute = function handleBackRoute() {
    this.goBack();
  };
  /**
   * [handleDeleteRoute 删除路由监听]
   * @param  {[rowskey]} id [description]
   * @return {[null]}    [description]
   */


  _proto.handleDeleteRoute = function handleDeleteRoute(id) {
    var actions = this.props.actions;
    var key = id || this.getSelectKeys();
    actions.deleteRoute(key);
  };
  /**
   * [handleFilter 监听过滤方法，即搜索提交]
   * @param  {[object]} value [过滤数据条件对象]
   * @return {[type]}       [无]
   */


  _proto.handleFilter = function handleFilter(value) {
    var actions = this.props.actions;
    this.clearSelectRows();
    actions.fetchPage(value);
  };
  /**
   * [onChange 表格分页排序发生变化]
   * @param  {[type]} pagination [description]
   * @param  {[type]} filters    [description]
   * @param  {[type]} sorter     [description]
   * @return {[type]}            [description]
   */


  _proto.onChange = function onChange(pagination, filters, sorter) {
    var reducer = this.props.reducer; // this.querys()

    var object = Object.assign({}, this.searchParams(), pagination, sorter);
    this.handleFilter(object);
  };
  /**
    *  获取查询条件参数
    *
    */


  _proto.searchParams = function searchParams() {
    var querys = this.props.querys; // console.info("override searchPrams method!")

    return {};
  };
  /**
   * 渲染搜索组件
   * @return {null} [description]
   */


  _proto.renderSearchBar = function renderSearchBar() {
    return null;
  };

  _proto.render = function render() {
    return null;
  };

  return ListPage;
}(Page);
ListPage.propTypes = {
  items: PropTypes.array.isRequired,
  actions: PropTypes.object,
  types: PropTypes.object,
  spins: PropTypes.func,
  querys: PropTypes.func
};

var FormPage =
/*#__PURE__*/
function (_Page) {
  _inheritsLoose(FormPage, _Page);

  function FormPage(props) {
    return _Page.call(this, props) || this;
  }

  var _proto = FormPage.prototype;

  _proto.saveFormRef = function saveFormRef(form) {
    this.form = form;
  };

  _proto.onSubmit = function onSubmit(actionType) {
    var _this = this;

    if (actionType === 'handleSubmit') {
      this.form.validateFieldsAndScroll({
        force: true
      }, function (err, values) {
        if (err) {
          return;
        }

        _this.handleSubmit(values);
      });
    } else {
      this[actionType].apply(this, [this.form.getFieldsValue()]);
    }
  };

  _proto.render = function render() {
    // Normally, just render children
    return this.props.children;
  };

  return FormPage;
}(Page);

export default ListPage;
export { ListPage, FormPage, Page as ViewPage };
