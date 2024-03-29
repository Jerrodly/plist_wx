/**
 * Created by Administrator on 15-11-9.
 */
var Queryor = require("./list.query.js");
var queryor = null;
var Detail = require("./pdetail.js");
var detail = null;
var Topic = require("./topic.js");
var topic = null;
var Common = require("./common.js");
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