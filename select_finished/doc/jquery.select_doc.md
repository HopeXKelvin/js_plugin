>**jquery.hhSelect.js**

query.hhSelect.js 是一个基于jQuery库的下拉框插件

可以实现下拉框的单选/多选/反选/全选功能

还能实现自由添加，删除下拉框选项

并且支持查看当前被选中的选项


>**运行环境**


要求：

1.jquery v1.11.3及以上；

2.IE8及以上版本浏览器，chrome和firefox等主流浏览器

>使用方法

**`$(".a-select").hhSelect({
  data:[{"key":"opt1","value":"选项1","isSelected":false},
          {"key":"opt2","value":"选项2","isSelected":false},
          {"key":"opt3","value":"选项3","isSelected":false},
          {"key":"opt4","value":"选项4","isSelected":false}],
  selectTitle:"单项选择",
  dataType:"single"
});`**

>组件属性列表

>外部调用方法
