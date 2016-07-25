var express = require('express');
//var router = express.Router();
//var logger = require('../lib/util/log4node').configlog4node.servLog4js();
var CommonUtil = require('./lib/util/CommonUtil');
var s = 'AQxbyfMYW1RArwUSyAOsnmtst%2fM%2bzikpBLHS8gt63s1bGczUnQO91XiNDV6Hv8LNjBlQye2CiEaN98A42poxLrSRZzqemK49PI7RwEtNnQSg%2bMIiIUmWkpkLNer0nszwMULBxj%2bhbDMViMpA3ta5MqqjL6kfnOuD8lZMaJ09bb7ijdEEf2ixNJMd0WF2aZz8UpVQD9UO5%2fy6H1kmiwr2oe8fne4pe8%2b%2fxmFgueg5WfPwvJ%2b%2f%2bczccteRFkj8hrKxr5GheDw5GCezB8CnjwQV0WSUjGhLliBxKq4jhvrWO9y6ckbj2r1Y6VNAq6GEr8FaCzAY4z6BjNKH4IvlFt98ml4C77HyRL50vCDtEZ020oKhQsppEAekdNj%2bRd4Si04TlNOc6Mvg12G0STtjqLtZPb1UsRvehw45csMN7pUgCZVIelt4FF7MUVdM2KySdVcj';
var desDecryptTY = CommonUtil.DesDecryptTY(s);
console.log(JSON.stringify(desDecryptTY));

