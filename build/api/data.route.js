"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _data = _interopRequireDefault(require("./data.controller"));

var router = new _express.Router();
router.route('/').get(_data["default"].apiGetStockData); // router.route('/AAPL').get(DataCtrl.apiInsertData);

router.route('/AAPL').get(_data["default"].apiGetStockData);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=data.route.js.map