/**
 * Created by Administrator on 15-11-11.
 */
var Api = require("./api.js");
var api = new Api();
var Common = require("./common.js");
var common = new Common();
var isInit = false;
var Detail = RichBase.extend({
	last_lid : "",
	cacheData : {},
	bootstrap : function(){

	},
	show : function(lid,ptype){
		if(!isInit){
			isInit = true;
			this.bootstrap(); //初始化详情模块
		}
		if(!lid || !ptype) return false;
		common.switchPage("#detailPage");
		return false;
		if(lid==this.last_lid) return;
		this.show_mainDetail(lid);
		this.show_ticketList(lid);
		this.show_taoTicket(lid);
		this.show_relTopicList(lid,ptype);
		this.last_lid = lid;
	},
	//基本信息
	show_mainDetail : function(lid){
		var that = this;
		var cacheData = this.cacheData[lid] || {};
		var cache = cacheData["mainDetail"];
		if(cache){ //走缓存
			this.render_mainDetail("cache",cache);
		}else{ //请求新数据
			api.fetchDetail(lid,{
				loading : function(){
					that.render_mainDetail("loading");
				},
				removeLoading : function(){
					that.render_mainDetail("removeLoading");
				},
				success : function(res){
					that.cacheData[lid]["mainDetail"] = res; //存入缓存，避免二次请求
					that.render_mainDetail("success",res);
				},
				fail : function(res){
					that.render_mainDetail("fail",res);
				},
				timeout : function(res){
					that.render_mainDetail("timeout",res);
				},
				serverError : function(res){
					that.render_mainDetail("serverError",res);
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
		var cacheData = this.cacheData[lid] || {};
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
	show_relTopicList : function(lid,ptype){
		var that = this;
		var cacheData = this.cacheData[lid] || {};
		var cache = cacheData["relTopicList"];
		if(cache){ //走缓存
			this.render_taoTicket("cache",cache);
		}else{ //请求新数据
			api.fetch_taoTicket(lid,ptype,{
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

	},
	//票列表
	render_ticketList : function(type,data){
		var html = "";
		var listUl = $("#pd_ticketListUl");
		var tpl = $("#ticketList-item-tpl").html();
		if(type=="success"){
			var template = _.template(tpl);
			html = template({data:data.list});
		}else if(type=="cache"){

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
	render_taoTicket : function(type,data){},
	//相关主题推荐
	render_relTopicList : function(type,data){},
	getAjaxStatusTxt : function(type,text){
		if(type=="loading"){
			text = text || "正在加载数据..."
			return '<li class="sta '+type+'"><i class="iconfont loading icon">&#xe644;</i><span class="t">'+text+'</span></li>'
		}else{
			text = text || "请求完成";
			return '<li class="sta '+type+'"><i class="iconfont icon">&#xe669;</i><span class="">'+text+'</span></li>';
		}
	}
});
module.exports = Detail;