### jsfunPicker 1.0.1

用于使用picker的形式选择标签，把选项全部列出来，不用滑动，支持多选单选

### 使用方式：

在 ``script`` 中引用组件 

```javascript
import jsfunPicker from '@/components/jsfun-picker/jsfun-picker.vue'
export default {
    components: {jsfunPicker}
}
data() {
	return {
		priceList: ['20.00', '25.00', '30.00', '35.00','40.00', '45.00', '50.00', '60.00'],
		priceDefault:'25.00,30.00,35.00',		
	};
},
methods:{
	priceChange(data){
		console.log("==返回值==");
		console.log(data);
		console.log(data.indexStr);
		console.log(data.textStr);
	}
}
```

在 ``template`` 中使用组件

```html
<jsfun-picker 
		mess="备注：这是底部分显示的备注提示" 
		:listArr = "priceList"
		:defaultArr = "priceDefault"
		type="single" 
		@click="priceChange" 
		>
		<!-- 自定义页面显示元素 -->
		<view>			
			{{priceDefault}}
		</view>
</jsfun-picker>
```


### 属性说明：

|属性名		|类型	|默认值					|说明				|
|---		|----	|---					|---																											|
|mess		|String	|""						|底部说明文字																										|
|listArr		|Array	|-|选项列表，格式：['20.00', '25.00', '30.00']				|
|defaultArr		|String	|""|默认值：多选是逗号分割的字符串，格式："25.00,30.00,35.00"|
|type	|String|single	|可选值：multiple（多选）、single（单选）|



### 事件说明：

|事件称名|说明|
|---|----|---|
|click|点击确定后执行的事件	|


### 版本说明


|版本号	|更新时间	|功能作用	|
|--		|--			|--			|
|1.0.1	|20190523	|1.确定后组件内更新默认值，<br>2.再次进入后显示上次确定的内容|
|1.0	|20190523	|初始版本										|

