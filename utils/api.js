'use strict';
var HOST_URI = 'https://wxapp.fshd.com';

// 获取任务列表
var GET_TASK_LIST = 'task_list.json';

function _obj2uri(obj){
	return Object.keys(obj).map(function(k) {
		return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
	}).join('&');
}


function _getTaskList(){
	return HOST_URI+GET_TASK_LIST;
}


module.exports = {
  getTaskList: _getTaskList,
};