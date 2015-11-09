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