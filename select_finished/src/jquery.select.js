;(function($,window){
	// 声明默认属性对象
	var pluginName="hhSelect",
		defaults={
			dataType:"single",//默认单选框
			data:[],
			selectTitle:null,//默认单选框显示标题
			selectDis:"请选择"//默认选择区域的显示文本
		};
	// 构造函数
	function Plugin(element,options){
		this.element=element;//插件作用的dom元素
		// 合并默认属性对象和传递的参数
		this.settings=$.extend({},defaults,options);
		this._defaults=defaults;
		this._name=pluginName;
		this.init(this.settings);
		this.exposure=new Exposure(this);
	}
	// 继承Plugin，并写入自己的方法
	Plugin.prototype={
		init:function(datas){
			// 初始化，由于继承自Plugin原型
			// 可以直接使用this.element或this.settings等属性
			var _datas=datas,
				_dataType=_datas["dataType"]
				$this=$(this.element),
				selectSum=0,
				oldSelectArea=$this.find(".select-area").length?$this.find(".select-area"):undefined,
				domEle=null;
			// 调用getDom方法
			if(oldSelectArea){
				oldSelectArea.remove();//删除原有的结点
				var oldList=this.reConstruct(oldSelectArea),
					domEle=this.getDom(_datas,oldList);
			}else{
				domEle=this.getDom(_datas);
			}
			$this.append(domEle);
			var selectUl=$this.find("ul"),
				display=$this.find(".select-display"),
				selectArea=$this.find(".select-area");
			selectUl.addClass("invisible");
			// 根据_dataType的类型分别生成不同的dom元素
			// 并绑定不同的点击事件
			if(_dataType=="single"){
				// 单选框
				this.singleSelect(selectUl,display);
			}else{
				// 多选框
				var toolLi='<li class="tool-box">'+
							'<span class="select-all select-btn">全选</span>'+
							'<span class="select-reverse select-btn">反选</span>'+
							'</li>';
				selectUl.append(toolLi);
				var btnEles=$this.find(".select-btn");
				this.multipleSelect(selectUl,display);
				this.allAndRevSelect(btnEles,selectUl,display);
			}
			this.ulDisplay(selectArea,display,selectUl)
			// console.log("init done!");
		},
		getDom:function(datas){
			// dom元素拼接方法
			var $wrapper=$("<div>").addClass("select-box"),
				oldList=arguments[1]?arguments[1]:{},
				newList=datas["data"],
				selectTitle=datas["selectTitle"],
				selectDis=datas["selectDis"],
				$selectTitleWrap=selectTitle?$("<span>").addClass("select-title").text(selectTitle):"",
				$selectAreaWrap=$("<div>").addClass("select-area"),
				$selectDisWrap=$("<span>").addClass("select-display").text(selectDis),
				$ulWrap=$("<ul>").addClass("select-list");

			// 这里要非常注意，json格式的数据遍历以及得到它的长度的问题
			var alength=this.getJsonLength(oldList),
					blength=this.getJsonLength(newList);
			// 遍历data 生成 li的jq对象并拼接到ul上去
			for(var i=0;i<alength;i++){
				var $li=$("<li>").data("key",oldList[i]["key"]).text(oldList[i]["value"]);
				$ulWrap.append($li);
			}
			for(var i=0;i<blength;i++){
				var $li=$("<li>").data("key",newList[i]["key"]).text(newList[i]["value"]);
				$ulWrap.append($li);
			}
			$selectAreaWrap.append($selectDisWrap);
			$selectAreaWrap.append($ulWrap);
			$wrapper.append($selectTitleWrap);
			$wrapper.append($selectAreaWrap);
			return $wrapper;
		},
		reConstruct:function(divWrap){
			// 一个重构html结构的方法
			// 参数是一个class="slect-area"的div
			var oldUl=divWrap.find("ul"),
				oldLis=oldUl.find("li"),
				lisValue=[];
			// 遍历获取oldLis的key和value
			oldLis.each(function(){
				var _self=$(this);
				lisValue.push({"key":_self.attr("data-key"),"value":_self.text()});
			});
			return lisValue;
		},
		singleSelect:function(selectUl,display){
			// 单项选择的点击事件绑定
			var selectUl=selectUl,
				display=display,
				selectList=selectUl.find("li").not(".tool-box");
			// 每次绑定事件之前先解绑所有点击事件，以免发生重复绑定
			selectList.off("click");
			// 在重新绑定点击事件
			selectList.each(function(){
				$(this)
					.on("click",function(){
						selectUl.removeClass("visible").addClass("invisible");
						display.text($(this).text());
						$(this).siblings()
							.removeClass("isSelected")
						$(this)
							.addClass("isSelected")
					});
			});
		},
		multipleSelect:function(selectUl,display){
			// 多项选择的点击事件绑定
			var selectUl=selectUl,
				display=display,
				selectList=selectUl.find("li").not(".tool-box");
			// 每次绑定事件之前先解绑所有点击事件，以免发生重复绑定
			selectList.off("click");
			// 在重新绑定点击事件
			selectList.each(function(){
				$(this)
					.on("click",function(){
						if($(this).hasClass("isSelected")){
						selectSum--;
						$(this)
							.removeClass("isSelected")
						}else{
							selectSum++;
							$(this)
								.addClass("isSelected")
						}
						display.text("选中:"+selectSum+"项");
					});
			});
		},
		ulDisplay:function(zone,trigger,target){
			// 控制点击出现列表的方法
			var trigger=trigger;
			var target=target;
			trigger.on("click",function(){
				if(target.hasClass("invisible")){
					target.removeClass("invisible").addClass("visible");
				}else{
					target.removeClass("visible").addClass("invisible");
				}
			});
			// 控制点击ul以外会发生的事件
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
		},
		allAndRevSelect:function(btnEles,selectUl,display){
			// 多选框的全选和反选的点击事件绑定
			var btns=btnEles,
				selectUl=selectUl,
				display=display,
				selectLis=selectUl.find("li").not(".tool-box");
			btns.each(function(){
				$this=$(this);
				// 同样要先解绑点击事件
				$this.off("click");
				// 再分别绑定
				if($this.hasClass("select-all")){
					$this.on("click",function(){
						// 全选
						selectLis.each(function(){
								$(this).addClass("isSelected");
								selectSum=selectLis.length
							});
						display.text("选中:"+selectLis.length+"项");
					});
				}else{
					$this.on("click",function(){
						// 反选
						selectLis.each(function(){
							if($(this).hasClass("isSelected")){
								selectSum--;
								$(this)
									.removeClass("isSelected");
								}else{
									selectSum++;
									$(this)
										.addClass("isSelected");
								}
						});
						display.text("选中:"+selectSum+"项");
					});
				}
			});
		},
		getLiDom:function(key,value){
			// 生成li结构的方法
			var $li=$("<li>").data("key",key).text(value);
			return $li;
		},
		getJsonLength:function(jsonData){
			// 获取json格式数据的长度
			// 因为Json格式的数据本身并没有length这个属性
			var length=0;
			for(var item in jsonData){
				length++;
			}
			return length;
		}
	};
	// 新建一个方法对象
	// 添加一些方法
	// 然后返回给外部调用
	function Exposure(plugin){
		this.plugin=plugin;
		this.elements=plugin.element;
		this.settings=plugin.settings;
	}
	// 外部可以调用的方法
	Exposure.prototype={
		getSelected:function(){
			// 获取当前被选中的选项
			// 返回{key,value}形式的数据
			var $lis=$(this.elements).find("ul li").not(".tool-box"),
					selectedLis=[];
			$lis.each(function(){
				if($(this).hasClass("isSelected")){
					selectedLis.push({
						key:$(this).data("key"),
						value:$(this).text()
					});
				}
			});
			return (selectedLis.length>0)?selectedLis:null;
		},
		addLiNode:function(key,value){
			// 添加li结点
			var $newLi=this.plugin.getLiDom(key,value),
					$oldLis=$(this.elements).find("ul li").not(".tool-box"),
					$lastOldLi=$oldLis.last();
			$newLi.insertAfter($lastOldLi);
			// 下面这段代码会重复出现
			var $ul=$(this.elements).find("ul"),
					$display=$(this.elements).find(".select-display");
			// 添加完还需要再次绑定点击事件
			// 还需要做判断
			if(this.settings["dataType"]=="single"){
				// 单选
				this.plugin.singleSelect($ul,$display);
			}else{
				// 多选
				var btnEles=$(this.elements).find(".select-btn");
				this.plugin.multipleSelect($ul,$display);
				this.plugin.allAndRevSelect(btnEles,$ul,$display);
			}
		},
		deleteLiNode:function(key){
			// 删除li结点
			// 根据提供的key值找到相应的选项
			// 并进行删除操作
			// 如果没有找到则不做任何事情
			var	$lis=$(this.elements).find("ul li").not(".tool-box");
			$lis.each(function(){
				if($(this).data("key")==key){
					// 删除节点
					$(this).remove();
				}
			});
			var $ul=$(this.elements).find("ul"),
					$display=$(this.elements).find(".select-display");
			// 添加完还需要再次绑定点击事件
			// 还需要做判断
			if(this.settings["dataType"]=="single"){
				// 单选
				this.plugin.singleSelect($ul,$display);
			}else{
				// 多选
				var btnEles=$(this.elements).find(".select-btn");
				this.plugin.multipleSelect($ul,$display);
				this.plugin.allAndRevSelect(btnEles,$ul,$display);
			}
		}
	};
	//防止产生多个实例
	$.fn[pluginName]=function(options){
		var exposureList=[];
		this.each(function(){
			/*
			$.data(ele,name,value)方法
			作用：给ele元素添加一个名称为name的数据，数据的值时value
			如果要获取一个值就是 $.data(ele,name)，
			根据name 获取ele元素上这个属性的值
			*/
			if(!$.data(this,"plugin_"+pluginName)){
				var plugin = new Plugin(this,options);
				$.data(this,"plugin_"+pluginName,plugin);
				exposureList.push(plugin.exposure);
			}
		});
		if(exposureList.length<=0){
			return false;
		}else{
			// 判断是否有多个外部调用实例，若有多个就返回数组
			// 若只有一个就返回数组的第一个实例.
			return (exposureList.length>1)?exposureList:exposureList[0];
		}
	};
})(jQuery,window);
