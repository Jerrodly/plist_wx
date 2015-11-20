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
	var List = __webpack_require__(2);
	var list = null;
	var Main = RichBase.extend({
		init : function(){
			list = new List();
		}
	})
	$(function(){ new Main()});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-11-9.
	 */
	var Queryor = __webpack_require__(3);
	var queryor = null;
	var Detail = __webpack_require__(7);
	var detail = null;
	var Topic = __webpack_require__(8);
	var topic = null;
	var Common = __webpack_require__(4);
	var common = new Common();
	var List = RichBase.extend({
		_scrollTop : null,
		_interval : null,
		init : function(){
			var that = this;
			var listFilter = this.listFilter = window.listFilter || null;
			this.ListContainer = new PFT.ListContainer({
				container : $(window),
				distanceToBottom : 0
			});
			this.ListContainer.on("scroll",function(data){
				if(!listFilter) return false;
				if($("#ptypeSelector").css("display")=="block") return false;
				var scrollTop = data.scrollTop;
				if(that._scrollTop==null) return that._scrollTop=scrollTop;
				if(scrollTop>that._scrollTop){
					listFilter.hide();
				}else{
					listFilter.show();
				}
				that._scrollTop = scrollTop;
			})
			this.ListContainer.on("scrollAtBottom",function(data){
				if($("#ptypeSelector").css("display")=="block") return false;
				if($("#listPage").css("display")=="block") queryor.getMore(that.getFilter());
			})
			$("#searchInp_list").on("input",function(e){
				that.onSearchInpChange(e);
			})
			this.initRouter();
			//查询模块
			queryor = new Queryor();
			//主题筛选
			topic = new Topic();
			topic.on("topic.change",function(data){
				if(!listFilter) return false;
				var val = data.val;
				var text = data.text;
				listFilter.setFilterItem("#switchTopicBtn",val,text);
				queryor.refresh(that.getFilter());
			})
			//城市筛选
			listFilter && listFilter.on("city.switch",function(data){
				queryor.refresh(that.getFilter());
			})
			//产品类型ptype筛选
			listFilter && listFilter.on("ptype.switch",function(data){
				queryor.refresh(that.getFilter());
			})
			//产品详情模块
			detail = new Detail();
			//初始化页面
	//		common.switchPage("#detailPage");
			//detail.show_relTopicList(38,"A","度假山庄");
	//		detail.show_taoTicket(38);
			queryor.refresh(this.getFilter());
		},
		initRouter : function(){
			var listFilter = this.listFilter || null;
			this.router = new PFT.Router({
				default : function(data){
					document.title = common.docTitle["home"];
					common.switchPage("#listPage");
					listFilter && listFilter.closePtypeSelector();
				},
				topic : function(data){
					topic.show({active:data.active || ""})
				},
				city : function(data){
					document.title = common.docTitle["city"];
					common.switchPage("#cityQueryPage");
				},
				ptype : function(data){
					listFilter && listFilter.showPtypeSelector(common.getPtype());
				},
				detail : function(data){
					document.title = common.docTitle["detail"];
					var lid = data.lid;
					var ptype = data.ptype;
					var topic = topic || "";
					if(!lid || !ptype) return false;
					detail.show(lid,ptype,topic);
				}
			})
		},
		onSearchInpChange : function(e){
			var that = this;
			clearTimeout(this._interval);
			this._interval = setTimeout(function(){
				queryor.refresh(that.getFilter());
			},200)
		},
		getFilter : function(){
			var listFilter = window.listFilter || null;
			if(!listFilter) return {};
			return listFilter.getFilterParams();
		}
	});
	module.exports = List;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-11-6.
	 */
	var Common = __webpack_require__(4);
	var common = new Common();
	var Api = __webpack_require__(5);
	var api = new Api();
	var UI = __webpack_require__(6);
	var ui = new UI();
	var Queryor = RichBase.extend({
		statics : {},
		cacheData : {},
		currentPage : 0,
		totalPage : 0,
		fetchData_loading : false,
		init : function(opt){
			this.filter = opt && opt.filter ? opt.filter : null;
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
		refresh : function(filterData){
			var that = this;
			var cacheData = this.cacheData;
			var params = filterData || {};
			var keyword = common.getKeyword();
			if(keyword) params["title"] = keyword;
			var paramsStr = this.serializeParams(params);
			var cache = cacheData[paramsStr];
			if(this.fetchData_loading) return false;
			if(cache){ //走缓存
				this.currentPage = cache.page;
				this.totalPage = cache.total;
				if(cache.list.length){
					ui.update(cache.list,"refresh.success");
				}else{
					ui.update([],"refresh.empty");
				}
			}else{ //请求数据
				var fetchParams = {
					page : 1,
					loading : function(){
						that.fetchData_loading = true;
						ui.update(null,"refresh.loading");
					},
					removeLoading : function(){
						that.fetchData_loading = false;
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
		getMore : function(filterData){
			var that = this;
			var cacheData = this.cacheData;
			var currentPage = this.currentPage;
			var totalPage = this.totalPage;
			if(this.fetchData_loading) return false;
			if((currentPage==totalPage) || (currentPage==0) || (totalPage==0) || (currentPage>=totalPage)) return false;
			var params = filterData || {};
			var keyword = common.getKeyword();
			if(keyword) params["title"] = keyword;
			var fetchParams = {
				page : currentPage+1,
				loading : function(){
					that.fetchData_loading = true;
					ui.update(null,"getMore.loading");
				},
				removeLoading : function(){
					that.fetchData_loading = false;
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
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator on 15-11-6.
	 */
	var Common = RichBase.extend({
		getKeyword : function(){
			return $("#searchInp_list").val();
		},
		getPtype : function(){
			return "A";
		},
		getPtype : function(){
			return{
				"A" : "门票",
				"C" : "酒店",
				"F" : "套票",
				"H" : "演出"
			};
		},
		//页面切换时，document title随之改变
		docTitle : {
			"home" : "产品列表",
			"city" : "选择城市",
			"detail" : "产品详情"
		},
		showPageLoading : function(){ $("#gmaskLayer").css({position:"fixed","display":"block","zIndex":10001})},
		closePageLoading : function(){ $("#gmaskLayer").css({"display":"none","zIndex":-1})},
		switchPage : function(pageId){
			if(typeof pageId==="undefined") return false;
			$(pageId).addClass("current").siblings().removeClass("current");
		}
	});
	module.exports = Common;

/***/ },
/* 5 */
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
				url : statics.api,
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
		},
		/**
		 * 根据产品lid 获取产品详情页所需要的对应详情信息
		 * @param lid
		 * @param opt
		 */
		fetchDetail : function(lid,opt){
			if(!lid) return false;
			opt = opt || {};
			var fn = new Function();
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			PFT.Ajax({
				url : PFT.Url.order_v3,
				type : "get",
				dataType : "json",
				data : {
					action : "get_product_detail",
					lid : lid
				},
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(res){ timeout(res)},
				serverError : function(res){ serverError(res)}
			},function(res){
				var status = res.status;
				if(status=="success"){
					success(res);
				}else{
					fail(res);
				}
			})
		},
		/**
		 * 根据产品lid 获取产品详情页的票列表
		 * @param lid
		 * @param opt
		 */
		fetch_ticketList : function(lid,opt){
			if(!lid) return false;
			opt = opt || {};
			var fn = new Function();
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			PFT.Ajax({
				url : PFT.Url.order_v3,
				type : "get",
				dataType : "json",
				data : {
					action : "ticket_list",
					lid : lid
				},
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(res){ timeout(res)},
				serverError : function(res){ serverError(res)}
			},function(res){
				var list = res.list;
				if(list){
					if(list.length){
						success(res);
					}else{
						empty(res);
					}
				}else{
					fail(res)
				}
			})
		},
		/**
		 * 根据产品lid 获取套票相关产品
		 * @param lid
		 * @param opt
		 */
		fetch_taoTicket : function(lid,opt){
			if(!lid) return false;
			opt = opt || {};
			var fn = new Function();
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			PFT.Ajax({
				url : PFT.Url.order_v3,
				type : "get",
				dataType : "json",
				data : {
					action : "package_list",
					lid : lid
				},
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(res){ timeout(res)},
				serverError : function(res){ serverError(res)}
			},function(res){
				var list = res.list;
				if(list){
					if(list.length){
						success(res);
					}else{
						empty(res);
					}
				}else{
					fail(res)
				}
			})
		},
		/**
		 * 根据产品lid ptype 获取相关主题推荐
		 * @param lid
		 * @param ptype
		 * @param opt
		 */
		fetch_relTopicList : function(lid,ptype,topic,opt){
			if(!lid || !ptype) return false;
			opt = opt || {};
			var fn = new Function();
			var loading = opt.loading || fn;
			var removeLoading = opt.removeLoading || fn;
			var success = opt.success || fn;
			var empty = opt.empty || fn;
			var fail = opt.fail || fn;
			var timeout = opt.timeout || fn;
			var serverError = opt.serverError || fn;
			PFT.Ajax({
				url : PFT.Url.order_v3,
				type : "get",
				dataType : "json",
				data : {
					action : "link_topic",
					lid : lid,
					ptype : ptype,
					topic : topic || ""
				},
				loading : function(){ loading()},
				removeLoading : function(){ removeLoading()},
				timeout : function(res){ timeout(res)},
				serverError : function(res){ serverError(res)}
			},function(res){
				var list = res.list;
				if(list){
					if(list.length){
						success(res);
					}else{
						empty(res);
					}
				}else{
					fail(res)
				}
			})
		}
	});
	module.exports = Api;

/***/ },
/* 6 */
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
			if(type.indexOf("refresh")>=0){
				listUl.html(html);
			}else{
				listUl.append(html);
			}
		}
	});
	module.exports = UI;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-11-11.
	 */
	var Api = __webpack_require__(5);
	var api = new Api();
	var Common = __webpack_require__(4);
	var common = new Common();
	var isInit = false;
	var ImgLoador = new PFT.ImageLoador();
	var Detail = RichBase.extend({
		EVENTS : {
			"tap" : {
				".msgBox .triggerBtn" : "onMsgBoxTriggerTap"
			}
		},
		last_lid : "",
		cacheData : {},
		init : function(){},
		bootstrap : function(){
			var that = this;
			this.container = $("#detailPage");
			this.on("detail.complete",function(data){
				var lid = data.lid;
				var ptype = data.ptype;
				var topic = data.topic;
				if(!lid || !ptype) return false;
				that.show_ticketList(lid);
				that.show_taoTicket(lid);
				that.show_relTopicList(lid,ptype,topic || "");
			})
			this.router = new PFT.Router({
				"detailmsg" : function(data){
					var lid = data.lid;
					if(!lid) return false;
					common.switchPage("#detailMsgPage");
					$("#detailMsgConText").html(that.cacheData[lid]["mainDetail"]["details"]["bhjq"]);
				}
			})
		},
		onMsgBoxTriggerTap : function(that,e){
			var tarBtn = $(e.currentTarget);
			tarBtn.toggleClass("on");
			var wrap = tarBtn.parents(".topTit").next();
			if(tarBtn.hasClass("on")){
				wrap.css("height",wrap.children().first().height())
			}else{
				wrap.css("height",0)
			}
		},
		show : function(lid,ptype,topic){
			if(!isInit){
				isInit = true;
				this.bootstrap(); //初始化详情模块
			}
			if(!lid || !ptype) return false;
			common.switchPage("#detailPage");
			if(lid==this.last_lid) return;
			this.show_mainDetail(lid,ptype,topic);
			this.last_lid = lid;
		},
		//基本信息
		show_mainDetail : function(lid,ptype,topic){
			var that = this;
			var cacheData = this.cacheData[lid] || (this.cacheData[lid]={});
			var cache = cacheData["mainDetail"];
			if(cache){ //走缓存
	//			this.render_mainDetail("cache",{lid:lid,ptype:ptype,topic:topic});
				this.render_mainDetail("cache",cache);
				that.fire("detail.complete",{lid:lid,ptype:ptype,topic:topic});
			}else{ //请求新数据
				api.fetchDetail(lid,{
					loading : function(){
						common.showPageLoading();
					},
					removeLoading : function(){
						common.closePageLoading();
					},
					success : function(res){
						that.cacheData[lid]["mainDetail"] = res; //存入缓存，避免二次请求
						that.render_mainDetail("success",res);
						that.fire("detail.complete",{lid:lid,ptype:ptype,topic:topic})
					},
					fail : function(res){
						that.cacheData[lid]["mainDetail"] = res;
						that.render_mainDetail("fail",res);
						that.fire("detail.complete",{lid:lid,ptype:ptype,topic:topic});
						window.history.back();
					},
					timeout : function(res){
						window.history.back();
						alert("请求产品详情超时，请稍后重试");
					},
					serverError : function(res){
						window.history.back();
						alert("请求产品详情出错，请稍后重试");
					}
				})
			}
		},
		//票列表
		show_ticketList : function(lid){
			var that = this;
			var cacheData = this.cacheData[lid] || (this.cacheData[lid]={});
			var cache = cacheData["ticketList"];
			if(cache){ //走缓存
				this.render_ticketList("cache",cache);
			}else{ //请求新数据
				api.fetch_ticketList(lid,{
					loading : function(){
						that.render_ticketList("loading");
					},
					removeLoading : function(){
						that.render_ticketList("removeLoading");
					},
					success : function(res){
						that.cacheData[lid]["ticketList"] = res;
						that.render_ticketList("success",res);
					},
					empty : function(res){
						that.cacheData[lid]["ticketList"] = res;
						that.render_ticketList("empty",res);
					},
					fail : function(res){
						that.render_ticketList("fail",res);
					},
					timeout : function(res){
						that.render_ticketList("timeout",res);
					},
					serverError : function(res){
						that.render_ticketList("serverError",res);
					}
				})
			}
		},
		//套票相关
		show_taoTicket : function(lid){
			var that = this;
			var cacheData = this.cacheData[lid] || (this.cacheData[lid]={});
			var cache = cacheData["taoTicket"];
			if(cache){ //走缓存
				this.render_taoTicket("cache",cache);
			}else{ //请求新数据
				api.fetch_taoTicket(lid,{
					loading : function(){
						that.render_taoTicket("loading");
					},
					removeLoading : function(){
						that.render_taoTicket("removeLoading");
					},
					success : function(res){
						that.cacheData[lid]["taoTicket"] = res;
						that.render_taoTicket("success",res);
					},
					empty : function(res){
						that.cacheData[lid]["taoTicket"] = res;
						that.render_taoTicket("empty",res);
					},
					fail : function(res){
						that.render_taoTicket("fail",res);
					},
					timeout : function(res){
						that.render_taoTicket("timeout",res);
					},
					serverError : function(res){
						that.render_taoTicket("serverError",res);
					}
				})
			}
		},
		//相关主题推荐
		show_relTopicList : function(lid,ptype,topic){
			var that = this;
			var cacheData = this.cacheData[lid] || (this.cacheData[lid]={});
			var cache = cacheData["relTopicList"];
			if(cache){ //走缓存
				this.render_relTopicList("cache",cache);
			}else{ //请求新数据
				api.fetch_relTopicList(lid,ptype,topic,{
					loading : function(){
						that.render_relTopicList("loading");
					},
					removeLoading : function(){
						that.render_relTopicList("removeLoading");
					},
					success : function(res){
						that.cacheData[lid]["relTopicList"] = res;
						that.render_relTopicList("success",res);
					},
					empty : function(res){
						that.cacheData[lid]["relTopicList"] = res;
						that.render_relTopicList("empty",res);
					},
					fail : function(res){
						that.render_taoTicket("fail",res);
					},
					timeout : function(res){
						that.render_relTopicList("timeout",res);
					},
					serverError : function(res){
						that.render_relTopicList("serverError",res);
					}
				})
			}
		},
		//基本信息
		render_mainDetail : function(type,data){
			var html = "";
			console.log(data)
			if(type=="cache" && data.status=="fail") type="fail";
			if(type=="success" || type=="cache"){
				var details = data.details;
				var openJQInfoBtn = $("#openJQInfoBtn");
				var href = openJQInfoBtn.attr("href").split("?")[0];
				var photoContainer = $("#bannerWrap");
				openJQInfoBtn.attr("href",href+"?lid="+data.lid);
				$("#detailTitleTxt").text(data.details.title);
				$("#jqtsTextBox").html(data.details.jqts);
				$("#jtznTextBox").html(data.details.jtzn);
				ImgLoador.load(details.imgpath,{
					loading : function(){
						photoContainer.children("img").remove();
						photoContainer.append('<img id="photoLoadingImg" src="http://www.12301.cc/images/icons/gloading.gif"/>');
					},
					removeLoading : function(){
						$("#photoLoadingImg").remove();
					},
					success : function(src,img){
						photoContainer.append(img);
					},
					error : function(src,img){
						photoContainer.append('<img src="http://www.12301.cc/images/defaultThum.jpg"/>')
					}
				})
			}else if(type=="loading"){
				html = this.getAjaxStatusTxt("loading","加载门票列表...");
			}else if(type=="removeLoading"){
				html = "";
			}else if(type=="fail"){
				html = this.getAjaxStatusTxt("fail","请求票类列表出错，请稍后重试...");
			}else if(type=="timeout"){
				html = this.getAjaxStatusTxt("timeout","请求超时，请稍后重试...");
			}else if(type=="serverError"){
				html = this.getAjaxStatusTxt("serverError","请求出错，请稍后重试...");
			}
		},
		//票列表
		render_ticketList : function(type,data){
			var html = "";
			var listUl = $("#pd_ticketListUl");
			var tpl = $("#ticketList-item-tpl").html();
			if(type=="cache" && data.list.length==0) type="empty";
			if(type=="success" || type=="cache"){
				var template = _.template(tpl);
				html = template({data:data.list});
			}else if(type=="loading"){
				html = this.getAjaxStatusTxt("loading","加载门票列表...");
			}else if(type=="removeLoading"){
				html = "";
			}else if(type=="empty"){
				html = this.getAjaxStatusTxt("empty","该景点暂无可出售的门票");
			}else if(type=="fail"){
				html = this.getAjaxStatusTxt("fail","请求票类列表出错，请稍后重试...");
			}else if(type=="timeout"){
				html = this.getAjaxStatusTxt("timeout","请求超时，请稍后重试...");
			}else if(type=="serverError"){
				html = this.getAjaxStatusTxt("serverError","请求出错，请稍后重试...");
			}
			listUl.html(html);
		},
		//相关套票
		render_taoTicket : function(type,data){
			var html = "";
			var listUl = $("#taoTicketListUl");
			var tpl = $("#taoTicketList-item-tpl").html();
			if(type=="cache" && data.list.length==0) type="empty";
			if(type=="success" || type=="cache"){
				var template = _.template(tpl);
				html = template({data:data.list});
			}else if(type=="loading"){
				html = this.getAjaxStatusTxt("loading","加载相关套票...");
			}else if(type=="removeLoading"){
				html = "";
			}else if(type=="empty"){
				html = this.getAjaxStatusTxt("empty","暂无相关套票...");
			}else if(type=="fail"){
				html = this.getAjaxStatusTxt("fail","请求相关套票出错，请稍后重试...");
			}else if(type=="timeout"){
				html = this.getAjaxStatusTxt("timeout","请求相关套票超时，请稍后重试...");
			}else if(type=="serverError"){
				html = this.getAjaxStatusTxt("serverError","请求相关套票出错，请稍后重试...");
			}
			listUl.html(html);
		},
		//相关主题推荐
		render_relTopicList : function(type,data){
			var html = "";
			var listUl = $("#pd_relTopicList");
			var tpl = $("#relTopicList-item-tpl").html();
			if(type=="cache" && data.list.length==0) type="empty";
			if(type=="success" || type=="cache"){
				var template = _.template(tpl);
				html = template({data:data.list});
			}else if(type=="loading"){
				html = this.getAjaxStatusTxt("loading","加载相关主题推荐...","div");
			}else if(type=="removeLoading"){
				html = "";
			}else if(type=="empty"){
				html = this.getAjaxStatusTxt("empty","暂无相关主题推荐","div");
			}else if(type=="fail"){
				html = this.getAjaxStatusTxt("fail","请求相关主题推荐出错，请稍后重试...","div");
			}else if(type=="timeout"){
				html = this.getAjaxStatusTxt("timeout","请求相关主题推荐超时，请稍后重试...","div");
			}else if(type=="serverError"){
				html = this.getAjaxStatusTxt("serverError","请求相关主题推荐出错，请稍后重试...","div");
			}
			listUl.html(html);
		},
		getAjaxStatusTxt : function(type,text,tag){
			tag = tag || "li";
			if(type=="loading"){
				text = text || "正在加载数据..."
				return '<'+tag+' class="sta '+type+'"><i class="iconfont loading icon">&#xe644;</i><span class="t">'+text+'</span></'+tag+'>'
			}else{
				text = text || "请求完成";
				return '<'+tag+' class="sta '+type+'"><i class="iconfont icon">&#xe669;</i><span class="">'+text+'</span></'+tag+'>';
			}
		}
	});
	module.exports = Detail;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 15-11-9.
	 */
	var Common = __webpack_require__(4);
	var common = new Common();
	var Topic = RichBase.extend({
		isInit : false,
		init : function(){
			var that = this;
			this.container = $("#topicPage");
			this.listUl = $("#topicListUl");
			this.container.on("tap",".topicItem",function(e){
				var target = $(e.currentTarget);
				target.addClass("active").siblings().removeClass("active");
			})
			$("#certainTopicBtn").on("tap",function(e){
				var tarBtn = $(this);
				var topic_orign = tarBtn.attr("data-topic");
				var topic_new = that.listUl.children(".active");
				var topic_new_val = topic_new.attr("data-val");
				var topic_new_text = topic_new.attr("data-text");
				window.history.back();
				if(topic_orign!==topic_new_val){
					tarBtn.attr("data-topic",topic_new_val);
					that.fire("topic.change",{val:topic_new_val,text:topic_new_text})
				}
			})
		},
		show : function(opt){
			common.switchPage("#topicPage");
			var active = opt.active;
			if(!this.isInit){
				this.buildList();
				this.isInit = true;
			}
			if(!active) return false;
			setTimeout(function(){
				$("#topicListUl").children().each(function(){
					var item = $(this);
					var val = item.attr("data-val");
					if(val==active) item.addClass("active").siblings().removeClass("active");
				})
			},100)
		},
		buildList : function(){
			var listUl = this.listUl;
			PFT.Topic.get({
				loading : function(){
					listUl.html('<li class="sta refresh loading"><i class="iconfont loading">&#xe644;</i><span class="t">数据加载中...</span></li>')
				},
				removeLoading : function(){ listUl.html("")},
				success : function(topics){
					var html = '<li class="topicItem all" data-val="" data-text="不限"><span class="t">不限</span><i class="iconfont">&#xe6b6;</i></li>';
					for(var i in topics){
						var topic = topics[i];
						html += '<li class="topicItem" data-val="'+topic+'" data-text="'+topic+'"><span class="t">'+topic+'</span><i class="iconfont">&#xe6b6;</i></li>';
					}
					listUl.html(html);
				},
				empty : function(res){
					listUl.html('<li class="sta refresh empty"><i class="iconfont">&#xe669;</i><span class="t">暂无主题分类...</span></li>')
				},
				fail : function(res){
					listUl.html('<li class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">请求主题出错...</span></li>')
				},
				timeout : function(res){
					listUl.html('<li class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">请求主题超时，请稍后重试...</span></li>')
				},
				serverError : function(res){
					listUl.html('<li class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">请求主题出错，请稍后重试...</span></li>')
				}
			})
		}
	});
	module.exports = Topic;

/***/ }
/******/ ]);