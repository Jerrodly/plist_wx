/**
 * Created by Administrator on 15-11-9.
 */
var Queryor = require("./list.query.js");
var queryor = null;
var Topic = require("./topic.js");
var topic = null;
var Common = require("./common.js");
var common = new Common();
var List = RichBase.extend({
	_scrollTop : null,
	_interval : null,
	init : function(){
		var that = this;
		var listFilter = window.listFilter || null;
		this.ListContainer = new PFT.ListContainer({
			container : $(window),
			distanceToBottom : 0
		});
		this.ListContainer.on("scroll",function(data){
			if(!listFilter) return false;
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
			queryor.getMore(that.getFilter());
		})
		listFilter && listFilter.on("filter.change",function(data){
			queryor.refresh(data);
		});
		$("#searchInp").on("input",function(e){
			that.onSearchInpChange(e);
		})
		this.initRouter();
		queryor = new Queryor();
		topic = new Topic();
		topic.on("topic.change",function(topic){
			if(listFilter){
				if(topic!=="不限"){
					listFilter.setFilterItem($("#switchTopicBtn"),topic,topic);
				}else{
					listFilter.setFilterItem($("#switchTopicBtn"),"",topic);
				}
				queryor.refresh(that.getFilter());
			}
		})
		queryor.refresh(this.getFilter());
	},
	initRouter : function(){
		this.router = new PFT.Router({
			default : function(data){
				common.switchPage("#listPage");
			},
			topic : function(data){
				topic.show({active:data.active || ""})
			}
		})
	},
	onSearchInpChange : function(e){
		var filterParams = this.getFilter();
		clearTimeout(this._interval);
		this._interval = setTimeout(function(){
			queryor.refresh(filterParams);
		},200)
	},
	getFilter : function(){
		var listFilter = window.listFilter || null;
		if(!listFilter) return {};
		return listFilter.getFilterParams();
	}
});
module.exports = List;