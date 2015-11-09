/**
 * Created by Administrator on 15-11-9.
 */
(function(){
	var ListFilter = RichBase.extend({
		init : function(){
			this.container = $("#filterBar");
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
			if(!itemid || !val) return false;
			var filterItem = $(itemid);
			var oldVal = filterItem.attr("data-val");
			if(oldVal!=val){
				filterItem.attr("data-val",val);
				this.fire("filter.change",this.getFilterParams());
			}
			showText && filterItem.find(".t").text(showText);
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