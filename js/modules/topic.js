/**
 * Created by Administrator on 15-11-9.
 */
var Common = require("./common.js");
var common = new Common();
var Topic = RichBase.extend({
	isInit : false,
	init : function(){
		var that = this;
		this.container = $("#topicPage");
		this.listUl = $("#topicListUl");
		this.container.on("tap",".topicItem",function(e){
			var target = $(e.currentTarget);
			target.addClass("active").siblings().removeClass("active");
		})
		$("#certainTopicBtn").on("tap",function(e){
			var tarBtn = $(this);
			var topic_orign = tarBtn.attr("data-topic");
			var topic_new = that.listUl.children(".active").find(".t").text();
			window.history.back();
			if(topic_new && topic_new!==topic_orign){
				tarBtn.attr("data-topic",topic_new);
				that.fire("topic.change",topic_new);
			}
		})
	},
	show : function(opt){
		common.switchPage("#topicPage");
		var active = opt.active;
		if(!this.isInit){
			this.buildList();
			this.isInit = true;
		}
		if(!active) return false;
		setTimeout(function(){
			$("#topicListUl").children().each(function(){
				var item = $(this);
				var text = item.text();
				if(text==active) item.addClass("active").siblings().removeClass("active");
			})
		},100)
	},
	buildList : function(){
		var listUl = this.listUl;
		PFT.Topic.get({
			loading : function(){
				listUl.html('<li class="sta refresh loading"><i class="iconfont loading">&#xe644;</i><span class="t">数据加载中...</span></li>')
			},
			removeLoading : function(){ listUl.html("")},
			success : function(topics){
				var html = '<li class="topicItem all"><span class="t">不限</span><i class="iconfont">&#xe6b6;</i></li>';
				for(var i in topics){
					var topic = topics[i];
					html += '<li class="topicItem"><span class="t">'+topic+'</span><i class="iconfont">&#xe6b6;</i></li>';
				}
				listUl.html(html);
			},
			empty : function(res){
				listUl.html('<li class="sta refresh empty"><i class="iconfont">&#xe669;</i><span class="t">暂无主题分类...</span></li>')
			},
			fail : function(res){
				listUl.html('<li class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">请求主题出错...</span></li>')
			},
			timeout : function(res){
				listUl.html('<li class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">请求主题超时，请稍后重试...</span></li>')
			},
			serverError : function(res){
				listUl.html('<li class="sta refresh fail"><i class="iconfont">&#xe669;</i><span class="t">请求主题出错，请稍后重试...</span></li>')
			}
		})
	}
});
module.exports = Topic;