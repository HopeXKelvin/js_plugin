(function($,window){
  $.fn.khSelect=function(options){
    // 定义一些变量，以及一些全局可以用到的jq对象
    var defaults={
      "data-type":"single"//默认单选
    };

    // 合并参数
    var opts=$.extend({},defaults,options);
    var _self=this;
    var $displayLine=_self.find(".displayLine"),
        $selectUl=_self.find(".selectUl"),
        selectSum=0;

    // 入口函数
    function initSelect(){
      buildDom(opts["data-type"]);
      bindEvent();
    }

    // 初始化dom元素，并使整个页面完整化
    function buildDom(type){
      // 根据type的不同设置不同的dom元素
      if(type.toString()=="single"){
        // 单选
        // var $wrapper=$("<li>").appendTo(selectUl);
      }else if(type.toString()=="multiple"){
        // 多选
      }
    }

    // 绑定事件
    function bindEvent(){
      controlDisplay();
    }

    // 点击 选择框的事件
    function controlDisplay(){
      $displayLine.on("click",function(){
        if($selectUl.hasClass("visible")){
          $selectUl.removeClass("visible").addClass("invisible");
        }else{
          $selectUl.removeClass("invisible").addClass("visible");
        }
      });
    }

    // 执行入口函数
    initSelect();
  }
})(jQuery,window)
