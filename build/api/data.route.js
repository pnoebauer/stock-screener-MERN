"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Data = _interopRequireDefault(require("./Data.controller"));

var router = new _express.Router(); // associate put, delete, and get(id)

router.route('/').get(_Data["default"].apiGetData); // router.route('/AAPL').get(DataCtrl.apiInsertData);

router.route('/AAPL').get(_Data["default"].apiGetStockData); // const router = {};

var _default = router;
exports["default"] = _default;
//# sourceMappingURL=data.route.js.map