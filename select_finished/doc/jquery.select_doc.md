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

实例1：纯插件构造方式

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
上面的代码执行之后，会在页面中生成一个下拉单选框,下拉框的选项都由插件的data参数构成

实例2：html和jq插件混合构造方式:

html代码:
```html
<div class="b-select">
  <div class="select-area invisible">
    <ul>
      <li data-key="mulOpt1">o1</li>
      <li data-key="mulOpt2">o2</li>
      <li data-key="mulOpt3">o3</li>
      <li data-key="mulOpt4">o4</li>
    </ul>
  </div>
</div>
```
javascript代码:
```javascript
var mulSelect=$(".b-select").hhSelect({
  data:[{"key":"add1","value":"a1"},
        {"key":"add2","value":"a2"},
        {"key":"add3","value":"a3"},
        {"key":"add4","value":"a4"}],
  dataType:"multiple"
});
```

执行以上代码后，会在页面得到一个合并了html的选项和使用插件填充的选项的下拉列表框

###2.使用外部调用方法

- 获取选中项的方法：

  >获得当前被选中的选项,返回的数据是{key:"key",value:"value"}格式

  >需要遍历取出相应的值.

  代码:
  ```javascript
  var selectLis=mulSelect.getSelected();
  ```

  然后可以通过遍历selectLis这个数组来获取相应项的key和value的值.

- 添加选择项的方法：

  代码：
  ```javascript
  mulSelect.addLiNode("添加项key","外部添加项2");
  ```
  调用后会在原来的列表的基础上添加这个选择项

- 删除选择项的方法：
  代码：
  ```javascript
  mulSelect.deleteLiNode("opt-key");
  ```
  参数是选择项的key值,调用该方法根据参数key值取删除对应选择项


>##组件属性列表

属性名称 | 属性类型 | 属性取值    | 属性值对应的含义
---------|----------|-------------|-----------------
dataType |  string  |single/multiple|single表示单选,multiple表示多选
  data   |  array   |{key:"",value:""}|key代表选项的键值,value代表选项显示的文本值
selectTitle|string  | 字符串      |如果不设置，默认值会是"单选框"
selectDis|string| 字符串          |这个是设置选择框的显示文字，默认值是"请选择"
>##外部调用方法
