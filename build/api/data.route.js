"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _Data = _interopRequireDefault(require("./Data.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router(); // associate put, delete, and get(id)

router.route('/').get(_Data.default.apiGetData); // router.route('/AAPL').get(DataCtrl.apiInsertData);

router.route('/AAPL').get(_Data.default.apiGetStockData);
var _default = router;
exports.default = _default;
//# sourceMappingURL=data.route.js.map