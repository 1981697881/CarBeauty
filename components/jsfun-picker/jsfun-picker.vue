<template>
	<view class="jsfun-picker">
	 <slot></slot>
	 <!-- 遮罩层 -->
	 <view class="mask" @tap.stop="closePicker" catchtouchmove="true" v-if="isShow"></view>
	 <!-- 多选控件 -->
	 <view class="picker" :class="{'pickerShow':isShow}" catchtouchmove="true">
		 <!-- 标题 -->
		 <view class="title">
		 		 <text class="cancel" @tap.stop="closePicker">取消</text>
		 		 <text class="ok" @tap.stop="okClick">确定</text>
		 </view>
		 <!-- 数据列表 -->
		 <view class="list" v-if="listArr.length>0">
		 	 <view 
			 v-for="(item,index) in listArrNew" 
			 :key="index" 
			 @tap="itemClick(item)"
			 :class="{'active':item.select}"
			 >{{item.cosmetologyProject}}</view>
		 </view > 
		 <view class="list" v-else>
		 	 未接收到数据
		 </view>
		 <!-- 底部说明 -->
		 <view class="mess">
		 	价格：￥{{standardPrice}} 提成：￥{{commission}}
		 </view>
	 </view>
	 
	 
	</view>
</template>

<script>
	export default {
		name: 'jsfun-picker',
		props: {
			listArr:{ //数据
			  type: Array,
			  default: []
			},	
			defaultArr: { //默认选中的内容
				type: String,
				default: '' 
			},
			type: { //多选 单选  multiple single 
				type: String,
				default: 'single' 
			},
					
			// disabled: { //是否为禁用状态
			// 	type: [String, Boolean],
			// 	defalut: false
			// },
		},		
		data() {
			return {
				listArrNew:[],//记录选中的内容
				isShow:false,
				standardPrice: 0,
				commission: 0,
			}
		},
		watch: {
			//这里需要监听默认值的改变，重新初始化
		    defaultArr(val) {
				this.initValue();
		    },
		},
		
		created() {		
			
		},
		methods: {
			showPicker(){
				setTimeout(() => {
				  this.isShow = true;
				  this.initValue();
				}, 100);				
			},
			//关闭
			closePicker(){	
				this.isShow = false;
				//点遮罩 点取消关闭说明用户不想修改，所以这里对数据进行初始化
				this.initValue(); 
			},
			//组件数据初始化  进入时、关闭时调用初始化
			initValue(){
				//默认值
				let defaultArr = this.defaultArr.split(",");
				//将传进来的数组转成对象使用	
				var temp = []
				let standardPrice = 0;
				let commission = 0;
				this.listArr.forEach((item)=>{
					let defalutSelect = false;
					if(defaultArr.length>0 && defaultArr.indexOf(item.cosmetologyProject)!=-1){
						defalutSelect = true;
						standardPrice+=Number(item.standardPrice)
						commission+=Number(item.commissionPrice)
					} 
					item.select = defalutSelect
					temp.push(item)
				})
				this.listArrNew = [...temp]; 
				this.standardPrice = standardPrice
				this.commission = commission
			},
			//选中元素
			itemClick(item) {
				if(item.select){
					item.select = false
				}else{
					item.select = true
				}
				//如果是单选需要清除其选中的项
				if(this.type=="single"){
					for (let item1 in this.listArrNew) {
						var obj = this.listArrNew[item1];
						if( obj.cosmetologyProject != item.cosmetologyProject) obj.select = false;
					}
				}
				
				let standardPrice = 0;
				let commission = 0;
				this.listArr.forEach((item)=>{
					if(item.select){
						standardPrice+=Number(item.standardPrice)
						commission+=Number(item.commissionPrice)
					}
				})
				this.standardPrice = standardPrice
				this.commission = commission
				this.$forceUpdate()
			},
			//点击确定
			okClick(){
				var data = {},list = {},textStr = "",valStr = "",indexStr = "";
				this.listArrNew.forEach((item,index)=>{
					if(item.select){
						list[index] = item.cosmetologyProject
						indexStr += (indexStr==""?"":",") + index
						textStr += (textStr==""?"":",") + item.cosmetologyProject
						valStr += (valStr==""?"":",") + item.id
					}
				})
				data['list'] = list
				data['indexStr'] = indexStr
				data['textStr'] = textStr
				data['valStr'] = valStr
				data['standardPrice'] = this.standardPrice
				data['commissionPrice'] = this.commission
				this.$emit('click',data)
				//确定后更新默认初始值,这样再次进入默认初值就是最后选择的
				/* this.defaultArr = textStr; */
				//关闭
				this.closePicker();
			}
		}
	}
</script>

<style lang="scss">
	.jsfun-picker {
       .mask {
		  position: fixed;
		  z-index: 1000;
		  top: 0;
		  right: 0;
		  left: 0;
		  bottom: 0;
		  background: rgba(0, 0, 0, 0.6);
		}
        .picker{
			transition: all .3s ease;
			transform: translateY(100%);
			&.pickerShow{
			   transform:translateY(0);
			}
			
			position: fixed;
			z-index: 1000;
			right: 0;
			left: 0;
			bottom: 0;
			background: #fff;	
			color:#666;
					
			.title{
				display: flex;
				justify-content: space-between;
				border-bottom: solid 1px #efefef;
				padding:0upx 20upx;
				line-height: 70upx;
				font-size: 28upx;
				font-weight: bold;
				//确定按钮颜色
				.ok{
					color: blue;
				}
			}
			
			.list{
				padding:0upx 10upx;
				margin: 20upx 0upx;
				display: flex;
				flex-flow: wrap;
				//列表元素样式
				view{
					background: #efefef;
				    text-align: center;
				    margin:10upx;
					padding:6upx 20upx;
					border-radius:6upx; 
					color:#777;
				}
				//列表元素选中的样式
				.active{
					background:blue;
					color:#fff;
				}
			}
			.mess{
				padding:0upx 20upx;
				margin-bottom: 20upx;
				text-align:left;
			}
		} 

	}
</style>