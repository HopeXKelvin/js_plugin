>#**jquery.hhSelect.js**

query.hhSelect.js 是一个基于jQuery库的下拉框插件

可以实现下拉框的单选/多选/反选/全选功能

还能实现自由添加，删除下拉框选项

并且支持查看当前被选中的选项


>##运行环境


###要求：

####1.jquery v1.11.3及以上；

####2.IE8及以上版本浏览器，chrome和firefox等主流浏览器

>##使用方法

###1.下拉选项框的初始化

纯插件构造下拉选项框的模式:

语法:
```javascript
$(selector).hhSelect({
  data:[{"key":"key1","value":"value1"},
        {"key":"key2","value":"value2"}];
})
```
这里data的数据就是你需要构造的选项的数据

此数据以 key/value 键值对的形式赋值

selector是一个div容器就可以,并且必须设置一个高度.

实例：
```javascript
$(".a-select").hhSelect({
  data:[{"key":"opt1","value":"选项1"},
        {"key":"opt2","value":"选项2"},
        {"key":"opt3","value":"选项3"},
        {"key":"opt4","value":"选项4"}],
  selectTitle:"单项选择",
  dataType:"single"
});
```
或和构造下拉选项框的模式:

html:
```html
<div class="b-select">
  <div class="select-area invisible">
    <ul>
      <li data-key="1">123</li>
      <li data-key="2">321</li>
      <li data-key="3">456</li>
      <li data-key="4">654</li>
    </ul>
  </div>
</div>
```
jquery:
```javascript
var mulSelect=$(".b-select").hhSelect({
  data:[{"key":"mopt1","value":"111"},
        {"key":"mopt2","value":"222"},
        {"key":"mopt3","value":"333"},
        {"key":"mopt4","value":"444"}],
  dataType:"multiple"
});
```

###2.使用外部调用方法
>##组件属性列表

>##外部调用方法
