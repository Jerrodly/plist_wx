/**
 * Created by Administrator on 15-11-9.
 */
(function(){
	var ListFilter = RichBase.extend({
		init : function(){
			this.container = $("#filterBar");
			this.initCityQuery();
		},
		initCityQuery : function(){
			var that = this;
			var QueryCity = PFT.QueryCity;
			var queryCity = this.queryCity = new QueryCity({
				container : $("#cityQueryPage"),
				listUl : $("#allcityUl")
			});
			queryCity.on("city.tap",function(data){
				window.history.back();
				var type = data.type;
				if(type=="location"){ //选择定位的城市

				}else if(type=="root"){ //取消所有选择 即选择全国所有城市

				}else{ //正常选中某个城市

				}
				var val = data.id;
				var text = data.name;
				if(!val) val = text;
				if(!val && !text){
					window.listFilter.setFilterItem("#switchCityBtn","","不限");
				}else{
					window.listFilter.setFilterItem("#switchCityBtn",val,text);
				}
				that.fire("city.switch",data);
			});
			queryCity.on("city.location.switch",function(data){ //切换定位城市
				console.log(data);
			})
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
		},
		showPtypeSelector : function(ptypes){
			var that = this;
			var selector = $("#ptypeSelector");
			if(!this.ptypes){
				this.ptypes = ptypes;
				selector.find(".typeUl").html(this.buildPtypeSelector(ptypes));
				selector.on("tap",".ptypeLi",function(e){
					var tarLi = $(e.currentTarget);
					var ptype = tarLi.attr("data-type");
					var ptype_text = tarLi.attr("data-typetext");
					if(ptype!==$("#switchPtypeBtn").attr("data-val")){
						that.setFilterItem("#switchPtypeBtn",ptype,ptype_text);
						that.fire("ptype.switch",{ptype:ptype,ptype_text:ptype_text});
					}
					window.history.back();
				})
			}
			selector.css({"display":"block"})
			setTimeout(function(){
				selector.css({"bottom":40})
			},10)
		},
		closePtypeSelector : function(){
			var selector = $("#ptypeSelector");
			var h = selector.height();
			selector.css({"bottom":-h});
			setTimeout(function(){
				selector.css({display:"none"});
			},300)
		},
		buildPtypeSelector : function(ptypes){
			var html = "";
			for(var i in ptypes){
				var type = i;
				var type_text = ptypes[i];
				html += '<li class="ptypeLi" data-type="'+type+'" data-typetext="'+type_text+'">'+type_text+'</li>';
			}
			return html;
		}
	});

	var listFilter = new ListFilter();
	window["listFilter"] = listFilter;
})();