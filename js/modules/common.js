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
	switchPage : function(pageId){
		if(typeof pageId==="undefined") return false;
		$(pageId).addClass("current").siblings().removeClass("current");
	}
});
module.exports = Common;