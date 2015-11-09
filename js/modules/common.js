/**
 * Created by Administrator on 15-11-6.
 */
var Common = RichBase.extend({
	getKeyword : function(){
		return $("#searchInp").val();
	},
	getPtype : function(){
		return "A";
	},
	switchPage : function(pageId){
		if(typeof pageId==="undefined") return false;
		$(pageId).addClass("current").siblings().removeClass("current");
	}
});
module.exports = Common;