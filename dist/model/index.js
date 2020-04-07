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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
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
var redux_orm_1 = require('redux-orm');
var BaseModel_1 = __importDefault(require('./BaseModel'));
exports.BaseModel = BaseModel_1.default;
var Attr_1 = __importStar(require('./Attr'));
exports.Attr = Attr_1.default;
exports.attr = Attr_1.attr;
var Model_1 = require('./Model');
exports.Model = Model_1.Model;
exports.fieldSetAttr = Model_1.fieldSetAttr;
exports.fieldSetPk = Model_1.fieldSetPk;
exports.fieldSetFk = Model_1.fieldSetFk;
//@ts-ignore
var ModelORM = /** @class */ (function(_super) {
  __extends(ModelORM, _super);
  function ModelORM(props) {
    var _this = _super.call(this, props) || this;
    //@ts-ignore
    var emptyDBState = _this.getEmptyState();
    //@ts-ignore
    _this.session(emptyDBState);
    return _this;
  }
  ModelORM.prototype.getDatabase = function() {
    //@ts-ignore
    this.db = this.createDatabase(this.generateSchemaSpec());
    //@ts-ignore
    return this.db;
  };
  return ModelORM;
})(redux_orm_1.ORM);
exports.ModelORM = ModelORM;
//@ts-ignore
var orm = new ModelORM();
exports.orm = orm;
