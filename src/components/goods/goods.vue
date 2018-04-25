<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuwrapper">
			<ul>
				<li v-for='(item,index) in goods' @click="selectMenu(index,$event)" class="menu-item" :class="{'current':currentIndex===index}">
					<span class="text border-1px">
						<icon v-if='item.type>0' :type="item.type" :iconNum="3"></icon>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodswrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" @click="selectFood(food,$event)" class="food-item border-1px">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" />
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol  :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :select-foods="selectFoods" :min-price="seller.minPrice"></shopcart>
		<food :food="selectedFood" ref="food"></food>
	</div>
</template>

<script>
import icon from '@/element/icon/icon'
import shopcart from '@/element/shopcart/shopcart'
import cartcontrol from '@/element/cartcontrol/cartcontrol'
import food from '@/element/food/food'
import BScroll from 'better-scroll'


const ERR_OK = 0;

export default {
	props:{
		seller:{
			type:Object
		}
	},
	created(){
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		this.$http.get('/api/goods').then((res)=>{
			res = res.data;
	        if(res.errno === ERR_OK){
	          this.goods = res.data;
	          this.$nextTick(()=>{
	          	this._initScroll();
	          	this._caculateHeight();
	          })
	        }
		})
	},
	components:{
		icon,
		shopcart,
		cartcontrol,
		food
	},
	computed:{
		currentIndex(){
			if(this.scrollY>=0)return 0;
			let scrollCur = Math.abs(this.scrollY);
			for (let i = 0 ; i < this.listHeight.length;i++) {
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i+1];
				if(!height2 || (scrollCur>=height1 && scrollCur<height2)){
					return i;
				}
			}
			return 0;
		},
		selectFoods(){
			let foods = [];
			this.goods.forEach((good)=>{
				good.foods.forEach((food)=>{
					if(food.count){
						foods.push(food);
					}
				})
			})
			return foods;
		}

	},
	methods: {
		_initScroll(){
			this.menuScroll = new BScroll(this.$refs.menuwrapper,{
				click:true
			});

			this.foodsScroll = new BScroll(this.$refs.foodswrapper,{
				probeType:3,
				click:true
			});

			this.foodsScroll.on("scroll",(pos)=>{
				this.scrollY = Math.round(pos.y);
			})
		},
		_caculateHeight(){
			let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			[].forEach.call(foodList,(v,i)=>{
				height +=v.clientHeight;
				this.listHeight.push(height);
			})
		},
		selectMenu(index,event){
			if(!event._constructed){
				return;
			}
			let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
			this.foodsScroll.scrollToElement(foodList[index],200);
		},
		selectFood(food){
			if(!event._constructed){
				return;
			}
			this.selectedFood = food;
			this.$refs.food.show();
		}
	}, 
	event:{
		
	},
	data(){
		return {
			goods:[],
			listHeight:[],
			scrollY:0,
			selectedFood:{}
		}
	}
}
</script>

<style lang="scss">
@import "../../assets/css/mixin.scss";

.goods{
	display:flex;
	overflow:hidden;
	position: absolute;
	top: 174px;
	width: 100%;
	bottom:46px;
	.menu-wrapper{
		flex: 0 0 80px;
		width:80px;
		background:#f3f5f7;
		.menu-item{
			display:table;
			height:54px;
			width:56px;
			line-height:14px;
			padding:0 12px;
			&.current{
				position:relative;
				z-index:11;
				margin-top: -1px;
				background:#fff;
				font-weight:700;

			}
			.text{
				font-size:12px;
				display:table-cell;
				width:56px;
				text-align: center;
				@include bottom-1px(rgba(7,17,27,.1));
				vertical-align:middle;
			}
			&:last-child,&.current .text{
				&:after{border-top:0;}
			}
		}
	}
	.foods-wrapper{
		flex:1;
		.title{
			padding-left:14px;
			height:24px;
			line-height:24px;
			border-left:2px solid #d9dde1;
			font-size:12px;
			color:rgb(147,153,159);
			background:#f3f5f7;
		}
		.food-item{
			display:flex;
			margin: 18px;
			padding-bottom:18px;
			@include bottom-1px(rgba(7,17,27,.2));
			&:last-child{
				&:after{
					border-top: 0;
				}
				margin-bottom: 0px;
			}
			.icon{
				flex:0 0 57px;
				margin-right:10px;
			}
			.content{
				flex:1;
				font-size:0;
				.name{
					margin:2px 0 8px 0;
					height:14px;
					line-height:14px;
					font-size:14px;
					color:rgb(7,17,27)
				}
				.desc,.extra{
					line-height: 10px;
					font-size: 10px;
					color: rgb(147,153,159);
				}
				.desc{
					line-height:12px;
					margin-bottom:8px;
				}
				.extra{
					.count{
						margin-right:6px;
					}
				}
				.price{
					font-weight: 700;
					line-height: 24px;
					.now{
						margin-right: 8px;
						font-size: 14px;
						color: rgb(240,20,20);
					}
					.old{
						text-decoration: line-through;
						font-size:10px;
						color: rgb(147,153,159);
					}
				}
				.cartcontrol-wrapper{
					position: absolute;
		            right: 0;
		            bottom: 12px;
				}
	            
			}
		}
	}
}
</style>