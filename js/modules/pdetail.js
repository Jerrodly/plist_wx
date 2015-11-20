/**
 * Created by Administrator on 15-11-11.
 */
var Api = require("./api.js");
var api = new Api();
var Common = require("./common.js");
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