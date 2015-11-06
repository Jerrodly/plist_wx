/**
 * Created by Administrator on 15-11-6.
 */
var Common = require("./common.js");
var common = new Common();
var Api = require("./api.js");
var api = new Api();
var UI = require("./ui.update.js");
var ui = new UI();
var Queryor = RichBase.extend({
	statics : {},
	cacheData : null,
	currentPage : 0,
	totalPage : 0,
	init : function(opt){
		this.filter = opt && opt.filter ? opt.filter : null;
	},
	getFilterParams : function(){
		var params = (this.filter && this.filter.getFilterParams) ? this.filter.getFilterParams() : {};
		var keyword = common.getKeyword();
		if(keyword) params["title"] = keyword;
		return params;
	},
	serializeParams : function(paramsObj){
		var filterParams = paramsObj;
		var params = "";
		for(var i in filterParams){
			params += ("&"+i+"="+filterParams[i])
		}
		if(params) params = params.substring(1);
		return params;
	},
	refresh : function(){
		var that = this;
		var cacheData = this.cacheData;
		var params = this.getFilterParams();
		var paramsStr = this.serializeParams(params);
		var cache = cacheData[paramsStr];
		if(cache){ //走缓存
			this.currentPage = cache.page;
			this.totalPage = cache.total;
			ui.update(cache.list,"refresh.success");
		}else{ //请求数据
			var fetchParams = {
				page : 1,
				type : common.getPtype(),
				loading : function(){
					ui.update(null,"refresh.loading");
				},
				removeLoading : function(){
					ui.update(null,"refresh.removeLoading");
					that.currentPage = 0;
					that.totalPage = 0;
				},
				success : function(res){
					var list = res.list;
					var page = res.page;
					var total = res.total;
					that.currentPage = page;
					that.totalPage = total;
					cacheData[paramsStr] = res;
					ui.update(list,"refresh.success");
				},
				empty : function(res){
					var page = res.page;
					var total = res.total;
					that.currentPage = page;
					that.totalPage = total;
					cacheData[paramsStr] = res;
					ui.update(res,"refresh.empty");
				},
				fail : function(res){
					ui.update(res,"refresh.fail");
				},
				timeout : function(res){
					ui.update(res,"refresh.timeout");
				},
				serverError : function(res){
					ui.update(res,"refresh.serverError");
				}
			};
			for(var i in params) fetchParams[i] = params[i];
			api.fetchData(fetchParams);
		}
	},
	getMore : function(){
		var that = this;
		var cacheData = this.cacheData;
		var currentPage = this.currentPage;
		var totalPage = this.totalPage;
		if((currentPage==totalPage==0) || (currentPage>=totalPage)) return false;
		var params = this.getFilterParams();
		var fetchParams = {
			page : currentPage+1,
			type : common.getPtype(),
			loading : function(){
				ui.update(null,"getMore.loading");
			},
			removeLoading : function(){
				ui.update(null,"getMore.removeLoading");
				that.currentPage = 0;
				that.totalPage = 0;
			},
			success : function(res){
				var list = res.list;
				var page = res.page;
				var total = res.total;
				var paramsStr = that.serializeParams(params);
				that.currentPage = page;
				that.totalPage = total;
				cacheData[paramsStr]["page"] = page;
				cacheData[paramsStr]["total"] = total;
				for(var i in list){
					cacheData[paramsStr]["list"].push(list[i]);
				}
				ui.update(list,"getMore.success");
			},
			empty : function(res){
				that.currentPage = page;
				that.totalPage = total;
				var paramsStr = that.serializeParams(params);
				cacheData[paramsStr]["page"] = page;
				cacheData[paramsStr]["total"] = total;
				ui.update(list,"getMore.success");
			},
			fail : function(res){
				ui.update(null,"getMore.fail");
			},
			timeout : function(res){
				ui.update(null,"getMore.timeout");
			},
			serverError : function(res){
				ui.update(null,"getMore.serverError");
			}
		};
		for(var i in params) fetchParams[i] = params[i];
		api.fetchData(fetchParams);
	}
});
module.exports = Queryor;