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