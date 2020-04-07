'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
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
Object.defineProperty(exports, '__esModule', {value: true});
var redux_orm_1 = require('redux-orm');
var Attr_1 = require('./Attr');
function normalizeEntity(entity) {
  if (
    entity !== null &&
    typeof entity !== 'undefined' &&
    typeof entity.getId === 'function'
  ) {
    return entity.getId();
  }
  return entity;
}
var BaseModel = /** @class */ (function(_super) {
  __extends(BaseModel, _super);
  function BaseModel(props) {
    var _this_1 = _super.call(this, props) || this;
    _this_1._fields = {};
    _this_1._initFields(props);
    return _this_1;
    // if(props){
    //   this.init(props)
    // }
  }
  BaseModel.prototype._initFields = function(props) {
    var _this = this;
    this._fields = Object.assign({}, props);
    var _loop_1 = function() {
      var fieldName = p;
      if (
        !(fieldName in _this) === false &&
        !(fieldName in this_1.getClass().fields) === false
      ) {
      } else {
        Object.defineProperty(_this, fieldName, {
          get: function get() {
            return (
              'please register the property before using\uFF1A' +
              fieldName +
              ' -->' +
              this.getClass().modelName
            );
          },
          set: function set(value) {
            console.info(
              'please register the property before using\uFF1A' +
                fieldName +
                ' -->' +
                this.getClass().modelName
            );
            // return _this.set(fieldName, value);
            return null;
          },
          configurable: true,
          enumerable: true
        });
      }
    };
    var this_1 = this;
    for (var p in props) {
      _loop_1();
    }
    // });
  };
  BaseModel.parse = function(userProps) {
    var _this_1 = this;
    // if (typeof this._session === 'undefined') {
    //   throw new Error(
    //     [
    //       `Tried to create a ${this.modelName} model instance without a session. `,
    //       'Create a session using `session = orm.session()` and call ',
    //       `\`session["${this.modelName}"].create\` instead.`
    //     ].join('')
    //   );
    // }
    var props = __assign({}, userProps);
    var m2mRelations = {};
    var declaredFieldNames = Object.keys(this.fields);
    var declaredVirtualFieldNames = Object.keys(this.virtualFields);
    declaredFieldNames.forEach(function(key) {
      var field = _this_1.fields[key];
      var valuePassed = userProps.hasOwnProperty(key);
      if (!(field instanceof redux_orm_1.ManyToMany)) {
        if (valuePassed) {
          var value = userProps[key];
          props[key] = normalizeEntity(value);
          //@ts-ignore
        } else if (field.getDefault) {
          //@ts-ignore
          props[key] = field.getDefault();
        }
      } else if (valuePassed) {
        // If a value is supplied for a ManyToMany field,
        // discard them from props and save for later processing.
        m2mRelations[key] = userProps[key];
        delete props[key];
      }
    });
    // add backward many-many if required
    declaredVirtualFieldNames.forEach(function(key) {
      if (!m2mRelations.hasOwnProperty(key)) {
        var field = _this_1.virtualFields[key];
        if (
          userProps.hasOwnProperty(key) &&
          field instanceof redux_orm_1.ManyToMany
        ) {
          // If a value is supplied for a ManyToMany field,
          // discard them from props and save for later processing.
          m2mRelations[key] = userProps[key];
          delete props[key];
        }
      }
    });
    // const newEntry = this.session.applyUpdate({
    //   action: CREATE,
    //   table: this.modelName,
    //   payload: props
    // });
    var ThisModel = this;
    var instance = new ThisModel(props);
    // instance._refreshMany2Many(m2mRelations); // eslint-disable-line no-underscore-dangle
    // this.instance =instance
    return instance;
  };
  /*
    save(){
      const newEntry = this.session.applyUpdate({
        action: CREATE,
        table: this.modelName,
        payload: props
      });
      this._refreshMany2Many(this);
    }
    */
  BaseModel.prototype.toData = function() {
    return this._fields;
  };
  return BaseModel;
})(redux_orm_1.Model);
exports.default = BaseModel;
BaseModel.reducer = function(action, modelClass, session) {
  var modelName = modelClass.modelName;
  switch (action.type) {
    case modelName + '/newItem':
      modelClass.create(action.payload);
      break;
    case modelName + '/savePage':
      modelClass
        .all()
        .toModelArray()
        .forEach(function(model) {
          return model.delete();
        });
      action.payload.items.map(function(m) {
        return modelClass.create(m);
      });
      break;
    case modelName + '/saveList':
      action.payload.items.map(function(m) {
        return modelClass.create(m);
      });
      break;
    case modelName + '/updateItem':
      //modelClass.withId(action.payload.id).update(action.payload);
      modelClass.upsert(action.payload);
      break;
    case modelName + '/saveItem':
      modelClass.upsert(action.payload);
      break;
    case modelName + '/deleteItem':
      //@ts-ignore
      var model = modelClass.withId(action.payload);
      model.delete();
      break;
    default:
    //  console.log(modelClass,action.type)
  }
  return session.state;
};
BaseModel.modelName = 'BaseModel';
BaseModel.fields = {
  id: Attr_1.attr({fieldName: 'id'})
};
