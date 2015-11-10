/**
 * Created by Administrator on 15-11-9.
 */
(function(){
	var ListFilter = RichBase.extend({
		init : function(){
			this.container = $("#filterBar");
			var urlParams = PFT.Help.getURLParma(window.location.href);
			var topic = urlParams.topic;
			if(urlParams && topic){
				//this.setFilterItem("#switchTopicBtn",topic,topic);
			}
		},
		getFilterParams : function(){
			var data = {};
			this.container.find(".ui-filterItem").each(function(){
				var item = $(this);
				var param = item.attr("data-param");
				var val = item.attr("data-val");
				if(param && val) data[param] = val;
			})
			return data;
		},
		setFilterItem : function(itemid,val,showText){
			if(!itemid) return false;
			var filterItem = $(itemid);
			filterItem.attr("data-val",val);
			if(showText){
				filterItem.find(".t").text(showText);
				filterItem.attr("data-show",showText);
			}
			this.fire("filter.change",this.getFilterParams());
		},
		show : function(){
			$("#filterBar").removeClass("hide");
		},
		hide : function(){
			$("#filterBar").addClass("hide");
		}
	});

	var listFilter = new ListFilter();
	window["listFilter"] = listFilter;
})();