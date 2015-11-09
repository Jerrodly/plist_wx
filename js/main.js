/**
 * Created by Administrator on 15-11-5.
 */
var List = require("./modules/list.js");
var list = null;
var Main = RichBase.extend({
	init : function(){
		list = new List();
	}
})
$(function(){ new Main()});