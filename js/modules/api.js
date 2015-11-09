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
	}
});
module.exports = Api;