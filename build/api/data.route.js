'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _Data = require('./Data.controller');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

// associate put, delete, and get(id)
router.route('/').get(_Data2.default.apiGetData);
// router.route('/AAPL').get(DataCtrl.apiInsertData);
router.route('/AAPL').get(_Data2.default.apiGetStockData);

exports.default = router;
//# sourceMappingURL=data.route.js.map