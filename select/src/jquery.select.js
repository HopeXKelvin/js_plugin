(function($,window){
	$.fn._hhSelect=function(options){
		// 定义一些变量以及参数
		var _self=this,
			selectSum=0;
		var defaults={
			"data-type":"single",
			"data":[]//默认为单选框
		};
		// 合并参数
		var opts=$.extend({},defaults,options);
		// 入口函数
		function initSelect(){
			initDom(opts["data-type"]);
		}
		// 初始化dom元素
		function initDom(type){
			var	selectArea=_self.find(".select-area");
				displayLine=_self.find(".display-line"),
				selectUl=_self.find(".select-ul");

			// 拼接自定义选项
			var lists=getList(opts["data"]);
			selectUl.append(lists);
			// 根据type的值初始化不同的dom元素
			if(type.toString()=="single"){
				// 构造单选框的结构
				// 暂时不考虑查询功能，下面的dom结构先注释了.
				// var $wrapper=$("<li>").appendTo(selectUl).addClass("searchBox toolBox");
				// var domStr='<span id="searchBtn">查询:</span>'+
				// 					'<input name="search" type"text" />';
				// $wrapper.append(domStr);
				// selectUl.append($wrapper);
				// var searchBtn=$wrapper.find("#searchBtn");

				// 绑定单选点击事件
				sinSelect(selectUl,displayLine);
			}else if(type.toString()=="multiple"){
				// 构造多选框的结构
				var $wrapper=$("<li>").appendTo(selectUl).addClass("mulSelectOp toolBox");
				var domStr='<span id="allSelect">全选</span>'+
							'<span id="reverseSelect">反选</span>'+
							'<span id="selectDone">确定</span>';
				$wrapper.append(domStr);
				var allSelect=$wrapper.find("#allSelect"),
					reverseSelect=$wrapper.find("#reverseSelect"),
					selectDone=$wrapper.find("#selectDone");
				selectUl.append($wrapper);
				mulSelect(selectUl,displayLine);
				// 绑定全选，反选，确定按钮的事件
				allSelectFn(allSelect,selectUl,displayLine);
				reverseSelectFn(reverseSelect,selectUl,displayLine);
				selectDoneFn(selectDone,selectUl,displayLine);
			}
			// 再绑定两个使列表显示和消失的事件
			displayUlControl(displayLine,selectUl);
			clickDocEvent(selectArea);
		}

		// 初始化用户自定义的列表dom结构
		function getList(data){
			// 遍历data，生成li
			var listStr="";
			for(var i=0;i<data.length;i++){
				listStr+='<li>'+data[i]+'</li>';
			}
			return listStr;
		}

		// 公共事件方法
		// 1.单击trigger触发 显示和隐藏target
		function displayUlControl(trigger,target){
			var trigger=trigger;
			var target=target;
			trigger.on("click",function(){
				if(target.hasClass("invisible")){
					target.removeClass("invisible").addClass("visible");
				}else{
					target.removeClass("visible").addClass("invisible");
				}
			});
		}
		// 2.全选功能
		function allSelectFn(btnEle,selectUl,displayLine){
			var btn=btnEle,
				selectUl=selectUl,
				display=displayLine;
			btn.on("click",function(){
				var _selectLis=selectUl.find("li").not(".mulSelectOp");
					_selectLis.each(function(){
						$(this).addClass("isSelected").removeClass("isHover");
						selectSum=_selectLis.length
					});
				display.text("选中:"+_selectLis.length+"项");
			});
		}
		// 3.反选功能
		function reverseSelectFn(btnEle,selectUl,displayLine){
			var btn=btnEle,
				selectUl=selectUl,
				display=displayLine;
			btn.on("click",function(){
				var _selectLis=selectUl.find("li").not(".mulSelectOp");
				_selectLis.each(function(){
					if($(this).hasClass("isSelected")){
						selectSum--;
						$(this)
							.removeClass("isSelected")
							.addClass("isHover");
						}else{
							selectSum++;
							$(this)
								.addClass("isSelected")
								.removeClass("isHover");
						}
					display.text("选中:"+selectSum+"项");
				});
			});
		}
		// 4.确定功能
		function selectDoneFn(btnEle,selectUl,displayLine){
			var btn=btnEle,
				selectUl=selectUl,
				display=displayLine;
			btn.on("click",function(){
				selectUl.removeClass("visible").addClass("invisible");
				display.text("选中:"+selectSum+"项");
			});
		}
		// 5.多选框的选择事件
		function mulSelect(selectUl,displayLine){
			var selectUl=selectUl,
				display=displayLine,
				selectList=selectUl.find("li").not(".toolBox");
			// 每次绑定事件之前先解绑所有点击事件，以免发生重复绑定
			selectList.off("click");
			// 在重新绑定点击事件
			selectList.each(function(){
				$(this)
					.addClass("isHover")
					.on("click",function(){
						console.log($(this).text());
						if($(this).hasClass("isSelected")){
						selectSum--;
						$(this)
							.removeClass("isSelected")
							.addClass("isHover");
						}else{
							selectSum++;
							$(this)
								.addClass("isSelected")
								.removeClass("isHover");
						}
						display.text("选中:"+selectSum+"项");
					});
			});
		}
		// 6.单选框的选择事件
		function sinSelect(selectUl,displayLine){
			var selectUl=selectUl,
				display=displayLine,
				selectList=selectUl.find("li").not(".toolBox");
			// 每次绑定事件之前先解绑所有点击事件，以免发生重复绑定
			selectList.off("click");
			// 在重新绑定点击事件
			selectList.each(function(){
				$(this)
					.addClass("isHover")
					.on("click",function(){
						console.log($(this).text());
						selectUl.removeClass("visible").addClass("invisible");
						display.text($(this).text());
						$(this).siblings()
							.removeClass("isSelected")
							.addClass("isHover");
						$(this)
							.addClass("isSelected")
							.removeClass("isHover");
					});
			});
		}
		// 7.点击ul以外的区域 是列表消失的事件
		function clickDocEvent(zone){
			var zone=zone,
				_selectList=zone.find("ul");
			$(document).on("click",function(e){
				if($.contains(zone[0],e.target)){
					return;
				}
				if(_selectList.hasClass("visible")){
					_selectList.removeClass("visible").addClass("invisible");
				}
			});
		}

		// 8.添加li 结点
		function addList(val){
			var lists=_self.find("ul li").not(".toolBox"),
				lastLi=lists.last(),
				liNode=$("<li>").text(val).addClass("isHover");
			liNode.insertAfter(lastLi);
		}

		//执行入口函数
		function HhSelect(){
			initSelect();
		}
		// 对外方法
		HhSelect.prototype={
			getVal:function(){
				var lists=_self.find("ul li");
				var arr=[];
				lists.each(function(){
					var self=$(this);
					if(self.hasClass("isSelected")){
						arr.push(self.text());
					}
				});
				if(arr.length<=0){
					return "没有被选择的选项!";
				}else if(arr.length==1){
					return arr[0].toString();
				}
				return arr;
			},
			addItem:function(val){
				addList(val)
				if(opts["data-type"]=="single"){
					// 重新绑定单选框事件
					sinSelect(_self.find("ul"),_self.find(".display-line"));
				}else if(opts["data-type"]=="multiple"){
					// 重新绑定多选框事件
					mulSelect(_self.find("ul"),_self.find(".display-line"));
				}else{
					return false;
				}
			}
		};
		var hhs=new HhSelect();
		return hhs;
	}
})(jQuery,window);
