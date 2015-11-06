/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-11-5.
	 */
	var Queryor = __webpack_require__(2);
	var queryor = null;
	var Main = RichBase.extend({
		init : function(){
			this.ListContainer = new PFT.ListContainer({
				container : $(window),
				distanceToBottom : 0
			});
			this.ListContainer.on("scrollAtBottom",function(data){
				queryor.getMore();
			})
			if(filter){
				queryor = new Queryor({filter:filter});
			}else{
				queryor = new Queryor();
			}
			queryor.refresh();
		}
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-11-6.
	 */
	var Common = __webpack_require__(3);
	var common = new Common();
	var Api = __webpack_require__(4);
	var api = new Api();
	var UI = __webpack_require__(5);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-11-6.
	 */
	var Common = RichBase.extend({
		getKeyword : function(){
			return "";
		},
		getPtype : function(){
			return "A";
		}
	});
	module.exports = Common;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-11-6.
	 */
	var fn = new Function;
	var Api = RichBase.extend({
		statics : {
			defaults : {
				api : "api/v0.0.3/order.php",
				type : "A",
				timeout : 10 * 1000,
				pageSize : 10
			}
		},
		init : function(){},
		fetchData : function(opt){
			var statics = this.statics.defaults;
			var opt = opt || {};
			var ajaxParam = {};
			var defaults = {
				action : "product_list",
				page : 1,
				url : statics.url,
				size : statics.pageSize,
				type : statics.type,
				ttimeout : statics.ttimeout,
				loading : fn,
				removeLoading : fn,
				success : fn,
				empty : fn,
				fail : fn,
				timeout : fn,
				serverError : fn
			};
			for(var i in defaults){
				if(typeof opt[i]==="undefined") opt[i] = defaults[i];
			}
			for(var i in opt){
				var val = opt[i];
				if((typeof val!=="function") && (i!="url") && (i!="ttimeout")) ajaxParam[i] = val;
			}
			if(!ajaxParam["type"]) ajaxParam["type"] = statics.type;
			PFT.Ajax({
				url : opt.url,
				type : "get",
				dataType : "json",
				data : ajaxParam,
				ttimeout : opt.ttimeout,
				loading : function(){ opt.loading()},
				removeLoading : function(){ opt.removeLoading()},
				timeout : function(res){ opt.timeout(res)},
				serverError : function(res){ opt.serverError(res)}
			},function(res){
				var list = res.list;
				if(list && ({}.toString.call(list)=="[object Array]")){
					if(list.length){
						opt.success(res);
					}else{
						opt.empty(res);
					}
				}else{
					opt.fail(res);
				}
			})
		}
	});
	module.exports = Api;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-11-6.
	 */
	var UI = RichBase.extend({
		renderHtml : function(data){
			var that = this;
			var tpl = $("#list-item-tpl").html();
			var html = "";
			for(var i in data){
				html += that.parseTemplate(tpl,data[i]);
			}
			return html;
		},
		update : function(data,type){
			var that = this;
			var listUl = $("#listUl");
			var html = "";
			if(!type) return false;
			switch(type){
				case "refresh.loading":
					html = '<li id="ajax_status_li" class="sta refresh loading"><i class="iconfont loading">&#xe644;</i><span class="t">数据加载中...</span></li>';
					break;
				case "refresh.removeLoading":
					html = "";
					break;
				case "refresh.success":
					html = that.renderHtml(data);
					break;
				case "refresh.empty":
					html = '<li id="ajax_status_li" class="sta refresh empty"><i class="iconfont">&#xe669;</i><span class="t">查无匹配产品...</span></li>';
					break;
				case "refresh.fail":
					html = '<li id="ajax_status_li" class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">服务器出错...</span></li>';
					break;
				case "refresh.timeout":
					html = '<li id="ajax_status_li" class="sta refresh timeout"><i class="iconfont">&#xe669;</i><span class="t">请求超时,请稍后重试</span></li>';
					break;
				case "refresh.serverError":
					html = '<li id="ajax_status_li" class="sta refresh timeout"><i class="iconfont">&#xe669;</i><span class="t">请求出错,请稍后重试</span></li>';
					break;
				case "getMore.loading":
					html = '<li id="ajax_status_li" class="sta getMore loading"><i class="iconfont loading">&#xe644;</i><span class="t">数据加载中...</span></li>';
					break;
				case "getMore.removeLoading":
					html = "";
					$("#ajax_status_li").remove();
					break;
				case "getMore.success":
					html = that.renderHtml(data);
					break;
				case "getMore.empty":
					html = "";
					break;
				case "getMore.fail":
					html = '<li id="ajax_status_li" class="sta getMore fail"><i class="iconfont">&#xe669;</i><span class="t">服务器出错...</span></li>';
					break;
				case "getMore.timeout":
					html = '<li id="ajax_status_li" class="sta getMore timeout"><i class="iconfont">&#xe669;</i><span class="t">请求超时,请稍后重试</span></li>';
					break;
				case "getMore.serverError":
					html = '<li id="ajax_status_li" class="sta refresh serverError"><i class="iconfont">&#xe669;</i><span class="t">请求出错,请稍后重试</span></li>';
					break;
			}
			if(type.indexOf("refresh")){
				list.html(html);
			}else{
				list.append(html);
			}
		}
	});
	module.exports = UI;

/***/ }
/******/ ]);