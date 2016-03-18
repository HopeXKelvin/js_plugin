/**
 * 幻灯片插件(简易版)
 * 日期：2016-03-16
 * 版本：0.0.1
 */
(function($){
    $.fn.jqSlider = function(optinos){
        var settings = {
            items : []//item是一个数组，装了每一个li的信息
        };
        //合并参数
        var opts = $.extend({},settings,optinos);
        
        var self = this;
        var itemsArr = [];
        
        //初始化 函数入口
        function init(){
            renderDom();
            buildItem(opts.items);
            bindEvent();
        }
        //渲染dom结构的方法
        function renderDom(){
            var leftBtnDomStr = '<div class="left-btn">'+
                                '<i class="icon-angle-left"></i>'+
                                '</div>',
                rightBtnDomStr = '<div class="right-btn">'+
                                 '<i class="icon-angle-right"></i>'+
                                 '</div>';
            var $wrapper = $(self), 
                $sliderBox = $("<div>").addClass("slider-box").appendTo($wrapper),
                $leftBtn = $(leftBtnDomStr).appendTo($sliderBox),
                $rightBtn = $(rightBtnDomStr).appendTo($sliderBox),
                $sliderContent = $("<div>").addClass("slider-content").appendTo($sliderBox),
                $sliderList = $("<ul>").addClass("slider-list").appendTo($sliderContent);
        }
        //遍历items参数，然后构建dom结构,并且构建每一个Item类
        function buildItem(items){
            var $sliderList = $("ul.slider-list");
            console.log($sliderList);
            if(items.length>0){
                //遍历，构造每一个item
                for(var i = 0;i < items.length;i++){
                    var item = new Item();
                    item.id = items[i].id;
                    item.imgSrc = items[i].imgSrc;
                    item.fn = items[i].fn;
                    item.isSelected = items[i].isSelected || false;//默认为false
                    //新建dom节点
                    var itemDomStr = '<li class="slider-item shadow-box">'+
                                     '<a href="javascript:;"><img src="'+item.imgSrc+'" alt="1"></a>'+
                                     '</li>';
                    var $itemDom = $(itemDomStr).appendTo($sliderList);
                    item.dom = $itemDom;
                    itemsArr.push(item);
                }
            }else{
                console.log("There is no items!");
            }
        }
        
        //重排items的排列顺序
        function reorderItems(isTurnLeft){
            var $sliderList = $("ul.slider-list");
            if(isTurnLeft){
                //轮播整体向右转，克隆slider-list的最后一个Item,移动到最前面来
                var $lastItemCopy = $sliderList.find("li:last").clone(true);
                $sliderList.prepend($lastItemCopy);
            }else{
                //轮播整体向左转，克隆slider-list的第一个Item,移动到最后面来
                var $firstItemCopy = $sliderList.find("li:first").clone(true);
                $sliderList.append($firstItemCopy);
            }
        }
        
        //事件绑定
        function bindEvent(){
            var $sliderContent = $("div.slider-content");
            var $leftBtn = $("div.left-btn>i"),
                $rightBtn = $("div.right-btn>i");
            console.log($sliderContent.scrollLeft());
            //绑定点击左右切换按钮的事件
            $leftBtn.on("click",function(){
                reorderItems(true);
                console.log($sliderContent.scrollLeft());
                    var scrollSize = $sliderContent.scrollLeft()-950;//在原来的偏移的基础上向左偏离950px
                // $sliderContent.animate({
                //     scrollLeft : scrollSize
                // },function(){
                //     //回调函数，去掉最后一个item节点
                //     // var $newSliderList = $("ul.slider-list");
                //     // $newSliderList.find("li:last").remove();
                // });
                var $newSliderList = $("ul.slider-list");
                $newSliderList.find("li:last").remove();
            });
            $rightBtn.on("click",function(){
                reorderItems(false);
                var scrollSize = $sliderContent.scrollLeft()+950;//在原来的偏移的基础上向右偏离950px
                // $sliderContent.animate({
                //     scrollLeft : scrollSize
                // },function(){
                //     //回调函数，去掉最前面的那个item节点
                //     // var $newSliderList = $("ul.slider-list");
                //     // $newSliderList.find("li:first").remove();
                // });
                var $newSliderList = $("ul.slider-list");
                $newSliderList.find("li:first").remove();
            });
            //绑定点击item的事件
            for(var i = 0; i < itemsArr.length;i++){
                var $item = itemsArr[i].dom;
                $item.on("click",itemsArr[i].fn);//当item被点击后，调用相应的回调函数
            }
        }
        
        //处理slider-list的移动
        
        
        //Iitem类
        function Item(){
            this.id = "";
            this.imgSrc = "";
            this.fn = function(){};
            this.isSelected = "";
        }
        init();
    }
})(jQuery);