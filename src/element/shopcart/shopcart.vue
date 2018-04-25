<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<span class="icon-shopping_cart"></span>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highlight':totalPrice>0}">
						￥ {{totalPrice}} 
					</div>
					<div class="desc">
						另需配送费￥{{deliveryPrice}}
					</div>
				</div>
				<div class="content-right">
					<div class="pay" :class="payClass" @click.stop.prevent="pay">
						{{payDesc}}
					</div>
				</div>
			</div>
			 <div class="ball-container">
		      <transition name="drop" v-on:before-enter="beforeEnter"
		        v-on:enter="enter" v-on:after-enter="afterEnter"
		        v-for="(ball,index) in balls" :key="index">
		        <div class="ball" v-show="ball.show" >
		          <div class="inner inner-hook"></div>
		        </div>
		      </transition>
		    </div>
		    <transition name="fold">
		    	<div class="shopcart-list" v-show="listShow" >
			    	<div class="list-header">
			    		<h1 class="title">购物车</h1>
			    		<h1 class="empty" @click="empty">清空</h1>
			    	</div>
			    	<div class="list-content" ref="listContent">
			    		<ul>
			    			<li class="food"  v-for="food in selectFoods">
			    				<span class="name">{{food.name}}</span>
			    				<div class="price">
									<span>￥{{food.price*food.count}}</span>
			    				</div>
			    				<div class="cartcontrol-wrapper">
			    					<cartcontrol @cartadd="drop" :food="food"></cartcontrol>
			    				</div>
			    			</li>
			    		</ul>
			    	</div>
			    </div>
		    </transition>
		</div>
		<transition name="fademask">
			<div class="list-mask" v-show="listShow" @click="hidList"></div>
		</transition>
	</div>
	
</template>

<script>
import cartcontrol from '@/element/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
export default {
	props:{
		deliveryPrice:{
			type:Number
		},
		minPrice:{
			type:Number
		},
		selectFoods:{
			type:Array,
			default(){
				return [];
			}
		}
	},
	data(){
		return {
			balls:[
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				},
				{
					show:false
				}
			],
			dropBalls:[],
			fold: true
		}
	},
	created() {
		this.$root.eventHub.$on('cart.add', this.drop)
	 },
	methods:{
		drop(el){
			for(let i = 0 ; i < this.balls.length;i++){
				let ball = this.balls[i];
				if(!ball.show){
					ball.show = true;
					ball.el = el;
					this.dropBalls.push(ball);
					return;
				}
			}
		},
	    beforeEnter(el) {
	      let count = this.balls.length
	      while (count--) {
	        let ball = this.balls[count]
	        if (ball.show) {
	          let rect = ball.el.getBoundingClientRect()
	          let x = rect.left - 32;
	          let y = -(window.innerHeight - rect.top - 22)
	          el.style.display = ''
	          el.style.webkitTransform = `translate3d(0,${y}px,0)`
	          el.style.transform = `translate3d(0,${y}px,0)`
	          let inner = el.querySelector('.inner-hook')
	          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
	          inner.style.transform = `translate3d(${x}px,0,0)`
	        }
	      }
	    },
	    enter(el) {
	      el.offsetHeight;//触发浏览器重绘
	      this.$nextTick(() => {
	        el.style.webkitTransform = 'translate3d(0,0,0)'
	        el.style.transform = 'translate3d(0,0,0)'
	        let inner = el.querySelector('.inner-hook')
	        inner.style.webkitTransform = 'translate3d(0,0,0)'
	        inner.style.transform = 'translate3d(0,0,0)'
	      })
	    },
	    afterEnter(el) {
	      let ball = this.dropBalls.shift()
	      if (ball) {
	      	el.style.display = 'none';
	        ball.show = false;
	      }
	    },
	    toggleList(){
	    	if(!this.totalCount){
	    		return;
	    	}
	    	this.fold = !this.fold;
	    },
	    hidList(){
	    	this.fold = true;
	    },
	    empty(){
	    	this.selectFoods.forEach((food)=>{
	    		food.count = 0;
	    	})
	    },
	    pay(){
	    	if(this.totalPrice < this.minPrice){
	    		return;
	    	}
	    	window.alert(`支付${this.totalPrice}元`);
	    }
	},
	computed:{
		totalPrice(){
			let total = 0;
			this.selectFoods.forEach((food,i)=>{
				total+=food.price*food.count;
			})
			return total;
		},
		totalCount(){
			let count = 0;
			this.selectFoods.forEach((food)=>{
				count+=food.count;
			})
			return count;
		},
		payDesc(){
			if(this.totalPrice===0){
				return `￥${this.minPrice}元起送`;
			}else if(this.totalPrice<this.minPrice){
				return `还差￥${this.minPrice -this.totalPrice}元起送`
			}{
				return "去结算"
			}
		},
		payClass(){
			let enoughClass = (this.totalPrice<this.minPrice)?'not-enough':'enough';
			return enoughClass;
		},
		listShow(){
	    	if(!this.totalCount){
	    		this.fold = true;
	    		return false;
	    	}
	    	let isShow = !this.fold;
	    	if(isShow){
	    		if(!this.scroll){
	    			this.$nextTick(()=>{
		    			this.scroll = new BScroll(this.$refs.listContent,{click:true})
		    		})
	    		}else{
	    			this.scroll.refresh();
	    		}
	    		
	    	}
	    	return isShow;
	    }
	},
	components:{
		cartcontrol
	}
}
</script>

<style lang="scss">
@import '../../assets/css/mixin.scss';
	.shopcart{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 111;
		width: 100%;
		height: 48px;

		.content{
			display: flex;
			background: #141d27;
			color: #80858a;
			.content-left{
				flex: 1;
				font-size:0;
				.logo-wrapper{
					display:inline-block;
					position:relative;
					top:-10px;
					margin:0 12px;
					padding:6px;
					height:56px;
					width:56px;
					box-sizing:border-box;
					vertical-align: top;
					border-radius: 50%;
					background: #141d27;
					.logo{
						width:100%;
						height:100%;
						text-align:center;
						border-radius: 50%;
						background: #2b3b3c;
						&.highlight{
							background:rgb(0,160,220);
							.icon-shopping_cart{
								color:#fff;
							}
						}
						.icon-shopping_cart{
							line-height:44px;
							font-size:24px;
						}
					}
					.num{
						position:absolute;
						top:0;
						right:0;
						width:24px;
						height:16px;
						line-height:18px;
						text-align:center;
						border-radius:16px;
						font-size:9px;
						font-weight:700;
						color:#fff;
						background:rgb(240,20,20);
						box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
					}
				}
				.price{
					display:inline-block;
					vertical-align: top;
					line-height:24px;
					margin-top:12px;
					padding-right:12px;
					border-right:1px solid rgba(255,255,255,0.1);
					box-sizing:border-box;
					font-size:16px;
					font-weight:700;
					&.highlight{
						color:#fff;
					}
				}
				.desc{
					display:inline-block;
					vertical-align: top;
					line-height: 24px;
					margin: 12px 0 0 12px;
					font-size: 10px;
				}
			}
			.content-right{
				flex: 0 0 105px;
				background: #2b333b;
				width: 105px;
				.pay{
					height:48px;
					line-height:48px;
					text-align:center;
					font-size: 12px;
					font-weight:700;
					&.enough{
						background:#00b43c;
						color:#fff;	
					}
				}
			}
		}
		.ball-container{
			.ball{
				position:fixed;
			    left:32px;
			    bottom:22px;
			    z-index:200;
		        &.drop-enter,&.drop-enter-active{
		          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
		        }
		        .inner{
		        	width:16px;
			        height:16px;
			        border-radius:50%;
			        background:rgb(0,160,220);
			        transition:all 0.4s linear;
		        }
		            
			}
		}
		.shopcart-list{
			position:absolute;
			left:0;
			bottom:0;
			z-index:-1;
			width:100%;
			transition: all 0.5s;
			transform: translate3d(0,-50px,0);
	    	&.fold-enter, &.fold-leave-active{
	    		transform: translate3d(0,100%,0);
	    	}
	    	.list-header{
	    		height:40px;
	    		line-height:40px;
	    		padding: 0 18px;
	    		background:#f3f5f7;
	    		border-bottom:1px solid rgba(7,17,27,.1);
	    		.title{
	    			float:left;
	    			font-size:14px;
	    			color:rgb(7,17,27);
	    		}
	    		.empty{
	    			float:right;
	    			font-size:12px;
	    			color:rgb(0,160,220);
	    		}
	    	}
	    	.list-content{
	    		padding:0 18px;
	    		max-height:217px;
	    		overflow:hidden;
	    		background:#fff;
	    		.food{
	    			padding:12px 0;
	    			box-sizing:border-box;
	    			@include bottom-1px(rgba(7,17,27,.1));
	    			.name{
	    				line-height:24px;
	    				font-size:14px;
	    				color: rgb(7,17,27)
	    			}
	    			.price{
	    				position:absolute;
	    				right:90px;
	    				bottom:12px;
	    				line-height:24px;
	    				font-size:14px;
	    				font-weight:700;
	    				color:rgb(240,20,20)
	    			}
	    			.cartcontrol-wrapper{
	    				position:absolute;
	    				right:0px;
	    				bottom:6px;
	    			}
	    		}
	    	}
		}
	}
	.list-mask{
		position:fixed;
		top:0;
		left:0;
		z-index:40;
		width:100%;
		height:100%;
		opacity:1;
		background:rgba(0,0,0,.6);
		backdrop-filter: blur(10px);
		transition:all 0.5s;
		&.fademask-enter-active, &.fademask-leave-active{
    		opacity: 1;
    		background:rgba(0,0,0,.6);
    	}
		&.fademask-enter, &.fademask-leave-active{
    		opacity: 0;
    		background: rgba(0,0,0,0);
    	}
	}
</style>