/**
 * Created by Administrator on 15-11-5.
 */
var Queryor = require("./modules/query.js");
var queryor = null;
var Main = RichBase.extend({
	init : function(){
		this.ListContainer = new PFT.ListContainer({
			container : $(window),
			distanceToBottom : 0
		});
		this.ListContainer.on("scrollAtBottom",function(data){
			queryor.getMore();
		})
		if(filter){
			queryor = new Queryor({filter:filter});
		}else{
			queryor = new Queryor();
		}
		queryor.refresh();
	}
});