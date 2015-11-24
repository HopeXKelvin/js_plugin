(function  ($) {
	$.fn.hhSelect = function  (option) {
		var $select = $(this);
		if(!$select.length){
            console.error("Can't find selectElement which selector is :"+$select.selector);
            return false;
        }
		if(!$select.is("select")){
            return false;
		}
		if($select.data()["hhSelect"]){
		    var hhSelect = $select.data()["hhSelect"];
			return hhSelect;
		}
		var setting = {
			width:120,
			menuWidth:"auto",
			menuHeight:"auto",
			maxHeight:300,
			menuReverse:false,
			required:false,//是否允许不选择,默认为允许
			isQuery:false,
			data:[],
			dataLabelKey:$select.data("labelkey") || "label",
			dataValKey:$select.data("valkey") || "key",
			dataDisabledKey:$select.data("disabledkey") || "disabled",
			dataActiveKey:$select.data("activekey") || "active",
			multiple : false,
			btnLabel : "请选择",
			onBeforeSelected : function($li,checked,value){},
			onAfterSelected : function($li,checked,value){},
			onOpen : function($menu){},
			onClose : function($menu){}
		}
		var opt = $.extend({},setting,option)
		var strUtils = {
			active : 'hhselect-active',
			hidden : 'hhselect-hidden',
			items : "项",
			selectedItems : "已选择 : ",
			selectAll: "全选",
			selectInverse : "反选",
			disabled : "disabled",
			nomatching : "无匹配项"
		}
		function selectManager(){
			this.$source = $select;
			this.data = opt.data;
			this.value = [];
			this.itemList = [];
			this.queryList = [];
		}

		var sm = new selectManager();

		function Item ($ele,value,label) {
			this.$ele = $ele,
			this.value = value,
			this.label = label
		}

		function initSelect(){
			buildEle();
		}

		function buildEle(){
			var $wrapper = $("<span>").insertAfter(sm.$source).addClass("hhselect");
			sm.$source.hide().appendTo($wrapper);
			var domStr = '<span class="hhselect-btn">'+
							'<label class="hhselect-btn-label"></label>'+
						'</span>'+
						'<div class="hhselect-menu">'+
							//查询部分
							'<div class="hhselect-query-wrap" >'+
								'<input placeholder="输入查询条件" type="text" class="hhselect-query-inp" />'+
								'<label class="hhselect-query-tips"></label>'+
								'<ul class="hhselect-query-list">'+
								'</ul>'+
							'</div>'+//hhselect-query-wrap
							'<div class="hhselect-menu-wrap" >'+
								//全选反选
								'<div class="hhselect-menu-btn" >'+
									'<span class="hhselect-selectAll">'+strUtils["selectAll"]+'</span>'+
									'<span class="hhselect-selectInverse">'+strUtils["selectInverse"]+'</span>'+
								'</div>'+
								//子项部分
								'<ul class="hhselect-menu-list">'+
								'</ul>'+
							'</div>'+//hhselect-menu-wrap
						'</div>';//hhselect-menu
			$wrapper.append(domStr);
			//设置禁用状态
			if(isDisabled()) $wrapper.attr(strUtils['disabled'],strUtils['disabled'])

			var $btnLabel = $wrapper.find(".hhselect-btn-label");
			var $menuList = $wrapper.find(".hhselect-menu-list");
			var $menu = $menuList.parents(".hhselect-menu");
			var $btn = $btnLabel.parent(".hhselect-btn");
			var $menuBtn = $wrapper.find(".hhselect-menu-btn");
			//查询部分
			var $queryWrap = $menu.find(".hhselect-query-wrap"),
					$queryInp = $queryWrap.find(".hhselect-query-inp"),
					$queryList = $menu.find(".hhselect-query-list"),
					$queryTips = $menu.find(".hhselect-query-tips"),
					$menuWrap = $menu.find(".hhselect-menu-wrap")

			sm.ele = {
				$wrapper : $wrapper,
				$btnLabel : $btnLabel,
				$menuList : $menuList,
				$menu : $menu,
				$menuBtn : $menuBtn,
				$btn : $btn,
				$queryWrap : $queryWrap,
				$queryInp : $queryInp,
				$queryList : $queryList,
				$menuWrap : $menuWrap,
				$queryTips : $queryTips
			}
			//重置select的默认选择
			$select[0].multiple = true;
			if($select.children().length && !('selected' in $select.children('option:eq(0)')[0].attributes)){
				$select.children('option:eq(0)')[0].selected = false;
			}
			//设置menu的tabIndex，用以失焦时关闭
			$menu.attr("tabindex",1)
			//全选反选的控制
			if(opt.multiple){
				$menuBtn.show();
			}
			//控制搜索框的显示
			if(!opt.isQuery) $queryWrap.hide();
			var $dataList = getDataList(sm.data);//取得子项
			$menuList.append($dataList);//插入子项
			setWrapperWidth();//设置容器宽度
			setBtnLabel();//设置显示的文字
			//事件绑定部分
			$btn.on("click",function(e) {//入口
				if(isDisabled()) return;
				toggleMenu();
			});
			$menuBtn.children(".hhselect-selectAll").on("click",function() {//全选
				if(isDisabled()) return;
				selectAll();
			})
			$menuBtn.children(".hhselect-selectInverse").on("click",function() {//反选
				if(isDisabled()) return;
				selectInverse();
			})
			//弹窗每项的点击监听
			$menu.on("click","li",function(e){
				if(isDisabled()) return;
				var $li = $(this)
				if(!!$li.data("sourcedom")) $li = $li.data("sourcedom")
				liClick($li);
				$(this).attr("class",$li.attr("class"));
				e.stopPropagation();
			});
			//document点击监听，用以控制鼠标点击别处时隐藏弹窗
			$(document).on("click",function(e) {
				if($.contains($wrapper[0],e.target)) return;
				hideMenu();
			});
			/*var isMouseOver = false;
			$menu.on("blur",function(){
				if(isMouseOver) return;
				// hideMenu();
			})*/
			//搜索框的输入监听
			$queryInp.on('keyup',function(){
				resetQueryList();
				queryItems($(this));
			})
		}
		//查询
		function queryItems($inp){
			var $queryTips = sm.ele.$queryTips,
					text = fmtQueryText($inp.val()) || "";
			if(!!!text.length) {//没值
				switchQueryList(true);
				$queryTips.hide();
			}else{//有值
				var isMatch = matchText(text)//匹配文字
				if(!isMatch) {
					$queryTips.show().text(strUtils['nomatching']);
				}else{
					$queryTips.hide();
				}
				switchQueryList(false);
			}
			setMenuPos();
		}
		//切换搜索框的显示隐藏
		function switchQueryList (isQuery) {
			sm.ele.$menuWrap.toggle(isQuery);
			sm.ele.$queryList.toggle(!isQuery);
		}
		//匹配条件
		function matchText (text) {
			var itemList = sm.itemList,
					queryList = sm.queryList,
					$queryList = sm.ele.$queryList;
			$.each(itemList,function(i,item){
				var _label = item.label
				if (_label.indexOf(text) > -1) {
						queryList.push(item);
						var $li = item.$ele.clone();
						$li.data('sourcedom',item.$ele)
						$queryList.append($li);
					};
			})
			return !!queryList.length;
		}
		//格式化查询条件
		function fmtQueryText (text) {
			return text;
		}
		//重置query
		function resetQueryList() {
			sm.queryList = [];
			sm.ele.$queryList.empty();
		}
		//重置queryInp
		function resetQuery () {
			resetQueryList();
			sm.ele.$queryInp.val("");
			sm.ele.$queryList.hide();
			sm.ele.$queryTips.hide();
			sm.ele.$menuWrap.show();
		}

		function selectAll () {
			var $menuList = sm.ele.$menuList.children("li").not("["+strUtils["disabled"]+"]");
			// $menuList.addClass(strUtils["active"]);
			activeLi($menuList)
			setBtnLabel();
		}

		function selectInverse () {
			var $menuList = sm.ele.$menuList.children("li").not("["+strUtils["disabled"]+"]");
			// $menuList.toggleClass(strUtils["active"]);
			toggleLi($menuList);
			setBtnLabel();
		}
		function isDisabled () {
			return sm.$source.is("["+strUtils['disabled']+"]");
		}
		function setWrapperWidth () {
			var $wrapper = sm.ele.$wrapper;
			var width;
			if(opt.width != setting.width ){
				width = opt.width;
			}else{
				width = sm.$source.outerWidth();
			}
			$wrapper.width(width);
		}

		function setBtnLabel () {
			var $btnLabel = sm.ele.$btnLabel;
			var $menuList = sm.ele.$menuList.children('li.'+strUtils["active"]);
			var length = $menuList.length;
			var label = "";
			var tips  = strUtils["selectedItems"]||"";
			if(length){
				label = (length < 2)? $menuList.text():length + strUtils["items"];
				$menuList.each(function  (i,ele) {
					tips += $(ele).text()+","
				})
				tips = tips.substring(0,tips.length-1);
			}else{
				label = opt.btnLabel;
				tips = label;
			}
			$btnLabel.text(label);
			$btnLabel.attr("title",tips);
		}

		function showMenu () {
			var $menu = sm.ele.$menu;
			var $btn = sm.ele.$btn;
			if($menu.is(":visible")) return;
			$btn.addClass(strUtils["active"]);
			setMenuPos();
			$menu.show();
			opt.onOpen($menu);
		}
		function hideMenu () {
			var $menu = sm.ele.$menu;
			var $btn = sm.ele.$btn;
			$menu.is(":visible") && $menu.hide();
			$btn.removeClass(strUtils["active"]);
			opt.onClose($menu);
			resetQuery();
		}
		function toggleMenu () {
			var $menu = sm.ele.$menu;
			var $btn = sm.ele.$btn;
			//判断是否显示
			if(!!!$menu.is(":visible")){
				showMenu();
			} else{
				hideMenu();
			}
		}

		function getDataList(data) {
			sm.itemList = [];
			var $source = sm.$source;
			var optionData = data;
			optionData.forEach(function(_data) {
				var value = _data[opt.dataValKey]+"" ||"";//确保为0时能赋值
				var label = _data[opt.dataLabelKey]+""||"";//确保为0时能赋值
				var disabled = !!_data[opt.dataDisabledKey];
				var selected = !!_data[opt.dataActiveKey];
				var $option = $("<option>").appendTo($source);
				$option.text(label).val(value);
				$option[0].selected = selected;
				$option[0].disabled = disabled;
			})

			var $sOptionList = $source.children("option");
			var $li = $('<li data-value="" ></li>');
			var list = [];
			var $ul = $('<ul>')//tempWrap

			// option
			$sOptionList.each(function(i,ele) {
				var value = ele.value;
				var label = $(ele).text();
				var $cLi = $li.clone().appendTo($ul);

				$cLi.text(label).attr({"data-value":value,"title":label});
				if (ele.selected) activeLi($cLi);//$cLi.addClass(strUtils['active']);
				if (ele.disabled) $cLi.attr(strUtils['disabled'],strUtils['disabled']);
				list.push($cLi);
				//拓展搜索部分，创建item映射
				var item = new Item($cLi,value,label);
				sm.itemList.push(item);
				$cLi.data("item",item);
			})

			//reSelected
			if($source.is("[data-value]") && $source.attr("data-value").length){
			    var sVal = $source.attr("data-value")
			    sVal = sVal.split(",");
			    if(!opt.multiple) sVal = sVal.splice(0,1)
			    for ( var i = 0; i < sVal.length; i++) {
			        var _val = sVal[i];
			        $.each(list,function(i,$cLi){
			        	if($cLi.attr("data-value") == _val){
                      activeLi($cLi)
                  }
			        })
          }
			}

			if(opt.required && !!!$ul.children('li.'+strUtils['active']).length){
				activeLi($ul.children('li:eq(0)'))
			}

			return list;
		}

		function getItemByVal (value) {
			var $li = [];
			var $menuList = sm.ele.$menuList.children("li");
			$menuList.each(function  (i,ele) {
				if($(ele).attr("data-value") == String(value)){
					$li = $(ele);
				}
			})
			return $li;
		}

		function setMenuPos() {
			var $source = sm.$source
			var menuReverse = opt.menuReverse || $source.is("[menuReverse]")
			var $menu = sm.ele.$menu;
			var $btn = sm.ele.$btn;
			$menu.height(opt.menuHeight).width(opt.menuWidth);
			$menu.css({
				top: menuReverse? -$menu.outerHeight(true):$btn.outerHeight(true),
				left:0,
				maxHeight:opt.maxHeight
			})
		}

		function liClick ($li) {
			if($li.is("["+strUtils['disabled']+"]")) return;
			var active = strUtils["active"];
			opt.onBeforeSelected($li,$li.hasClass(active),$li.attr("data-value"))
			toggleLi($li)
			if(!opt.multiple) hideMenu();
			setBtnLabel();
			opt.onAfterSelected($li,$li.hasClass(active),$li.attr("data-value"))
		}

		function activeLi ($item) {
			$item.addClass(strUtils["active"])
			if(!opt.multiple){
				$item.siblings("."+strUtils["active"]).removeClass(strUtils["active"])
			}
		}

		function cancelLi ($item) {
			if(opt.required && !$item.siblings("."+strUtils["active"]).length){
				console.error('current item is the only option && requried at least one option')
				return false;
			}
			$item.removeClass(strUtils["active"])
			return true;
		}

		function toggleLi ($item) {
			$item.each(function(i,ele){
				if(!$(ele).hasClass(strUtils["active"])){
					activeLi($(ele))
				}else{
					cancelLi($(ele))
				}
			})
		}

		function Hhselect () {
			initSelect();
		}
		Hhselect.prototype = {
	        getVal : function() {
	            var valueStr = "";
	            var $menuList = sm.ele.$menuList.children('li.'+strUtils["active"]);
	            $menuList.each(function (i,ele) {
	                var value =  $(ele).data("value")+'';
	                if(value.length)valueStr += value+","
	            })
	            if(valueStr.length )valueStr = valueStr.substring(0,valueStr.length-1)
	            return valueStr;
	        }, isSeleted : function() {
	            var $menuList = sm.ele.$menuList.children('li.'+strUtils["active"]);
	            return Boolean($menuList.length)
	        }, disableItem :  function(value) {
	            var $li = getItemByVal(value);
	            if(!$li.length) return;
	            if(!cancelLi($li)) {
	            	return;
	            }
	            $li.attr(strUtils['disabled'],strUtils['disabled']);
	        },enableItem : function(value) {
	            var $li = getItemByVal(value);
	            if(!$li.length || $li.is(":not(["+strUtils['disabled']+"])")) return;
	            $li.removeAttr(strUtils['disabled']);
	        },hideItem :  function(value) {
	            var $li = getItemByVal(value);
	            if(!$li.length) return;
	            // var active = strUtils["active"];
	            if(!cancelLi($li)) {
	            	return;
	            }
	            var hidden = strUtils["hidden"];
	            $li.addClass(hidden);//若是hidden，则取消其选中状态
	            setMenuPos();
	            setBtnLabel();
	        },showItem : function(value) {
	            var $li = getItemByVal(value);
	            if(!$li.length || $li.is(":not(."+strUtils['hidden']+")")) return;
	            $li.removeClass(strUtils['hidden']);
	            setMenuPos();
	        },clearAllItem : function() {
	            var $menuList = sm.ele.$menuList;
	            $menuList.empty();
	            $select.empty();
	            sm.itemList = [];
	            setBtnLabel();
	        },addItem : function(data) {
	            var $menuList = sm.ele.$menuList;
	            var $dataList = getDataList(data);
	            $menuList.append($dataList);
	            setBtnLabel();
	        },selectedItem : function(value) {
	            var $li = getItemByVal(value);
	            if(!$li.length) return;
	            activeLi($li)
	            setBtnLabel();
	        },cancelItem : function  (value) {
	        		var $li = getItemByVal(value);
	            if(!$li.length) return;
	            cancelLi($li)
	            setBtnLabel();
	        },getSelectedItem : function(){
	            var selectedItems = [];
	            var $menuList = sm.ele.$menuList.children('li.'+strUtils["active"]);
	            $menuList.each(function(i,ele){
	                var value =  $(ele).data("value");
	                var label =  $(ele).text();
	                selectedItems.push({"label":label,"value":value})
	            })
	            return selectedItems;
	        },disable : function () {
	        	var $wrapper = sm.ele.$wrapper,
	        	    $source = sm.$source;
	        	$wrapper.add($source).attr(strUtils['disabled'],strUtils['disabled']);
	        	hideMenu();
	        },enable : function  () {
	        	var $wrapper = sm.ele.$wrapper,
	        	    $source = sm.$source;
	        	$wrapper.add($source).removeAttr(strUtils['disabled']);
	        }
		}

		var hhs = new Hhselect();
		$select.data()["hhSelect"] = hhs;
		return hhs;
	}
})(jQuery)
