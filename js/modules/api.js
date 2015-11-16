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