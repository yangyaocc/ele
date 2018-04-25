<template>
	<transition name="move">
		<div v-show='showFlag' class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image" alt="">
					<div class="back" @click="hide">
						<span class="icon-arrow_lift"></span>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol ref="cartc" :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" @click="addFrist" v-show="!food.count || food.count===0">
							加入购物车
						</div>
					</transition>
				</div>
				<div v-show="food.info">
					<split></split>
					<div class="info">
						<div class="title">商品信息</div>
						<div class="text">{{food.info}}</div>
					</div>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type="selectType" :desc="desc" :only-content="onlyContent" :ratings="food.ratings"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-for='rating in food.ratings' class="rating-item border-1px" v-show="ratingIsShow(rating.rateType,rating.text)">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img class="avatar" :src="rating.avatar" width="12" height="12" />
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
				<span :class="{'icon-thumb_up':rating.rateType===0,
								'icon-thumb_down':rating.rateType===1}"></span>
									{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="norating" v-show="!food.ratings || !food.ratings.length">
							暂无评价
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</transition>
	
</template>

<script>
import Vue from "Vue"
import BScroll from 'better-scroll';
import cartcontrol from '@/element/cartcontrol/cartcontrol'
import ratingselect from '@/element/ratingselect/ratingselect'
import {formatDate} from '@/filter/time'
import split from '@/element/split/split'

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
	props:{
		food:{
			type:Object
		}
	},
	created(){
		this.$root.eventHub.$on("ratingtype.select",this._ratingtypeSelect);
		this.$root.eventHub.$on("content.toggle",this._contentToggle);
	},
	methods:{
		show(){
			this.showFlag = true;
			this.selectType = ALL;
			this.onlyContent = false;
			this.$nextTick(()=>{
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.food,{
						click:true
					})
				}else{
					this.scroll.refresh();
				}
			});
		},
		hide(){
			this.showFlag = false;
		},
		addFrist(event){
			if(event._contructed){
				return;
			}
			/*this.$root.eventHub.$emit("cart.add",event.target);
			Vue.set(this.food,"count",1);*/
			this.$refs.cartc.addCart(event)
		},
		_ratingtypeSelect(type){
			this.selectType = type;
		},
		_contentToggle(isOnly){
			this.onlyContent = isOnly;
		},
		ratingIsShow(type,text){
			if(this.onlyContent && !text)return false;
			if(this.selectType === ALL) return true;
			return this.selectType===type;
		}
	},
	components:{
		cartcontrol,
		split,
		ratingselect
	},
	filters:{
		formatDate(time){
			let date = new Date(time);
			console.log(date);
			return formatDate(date,"YYYY-MM-DD hh:mm")
		}
	},
	data(){
		return {
			showFlag : false,
			selectType: ALL,
			onlyContent: true,
			desc:{
				all:"全部",
				positive:"推荐",
				negative:"吐槽"
			}
		}
	}
}
</script>

<style lang="scss">
@import "../../assets/css/mixin.scss";
.food{
	position:fixed;
	left:0;
	top:0;
	bottom:48px;
	z-index:30;
	width:100%;
	background:#fff;
	transition:all 0.2s linear;
	transform: translate3d(0,0,0);
	&.move-enter-active, &.move-leave-active{
		transform: translate3d(0,0,0);
	}
	&.move-enter, &.move-leave-active{
		transform:translate3d(100%,0,0);
	}
	.food-content{
		
		.image-header{
			position: relative;
			width:100%;
			height:0;
			padding-top:100%;
			img{
				position: absolute;
				top:0;
				left:0;
				width:100%;
				height:100%;
			}
			.back{
				position: absolute;
				top:10px;
				left:0;
				.icon-arrow_lift{
					display: block;
					padding: 10px;
					color:#fff;
					font-size:20px;
				}
			}
		}
		.content{
			position: relative;
			padding:18px;
			.title{
				line-height: 14px;
				margin-bottom: 8px;
				font-size: 14px;
				font-weight: 700;
				color: rgb(7,17,27)
			}
			.detail{
				margin-bottom:18px;
				height:10px;
				line-height: 10px;
				font-size: 0;
				.sell-count,.rating{
					font-size: 10px;
					color: rgb(147,153,159);
				}
				.sell-count{
					margin-right: 12px;
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
				right: 12px;
				bottom: 12px;
			}
			.buy{
				position: absolute;
				right:18px;
				bottom:18px;
				z-index:10px;
				line-height:24px;
				padding:0 12px;
				border-radius: 12px;
				box-sizing:border-box;
				font-size:10px;
				color:#fff;
				background:	rgb(0,160,220);
				&.fade-enter-active,&.fade-leave-active{
		          transition: opacity .5s
		        }
		        &.fade-enter,&.fade-leave-active{
		          opacity: 0
		        }
			}
		}
		.info{
			padding:18px;
			.title{
				line-height:14px;
				margin-bottom:6px;
				font-size:14px;
				color:rgb(7,17,27);
			}
			.text{
				padding:0 8px;
				line-height:24px;
				font-size:12px;
				color:rgb(7,17,27)
			}
		}

		.rating{
			padding-top:18px;
			.title{
				line-height:14px;
				margin-left:18px;
				font-size:14px;
				color:rgb(7,17,27);
			}
			.rating-wrapper{
				padding: 0 18px;
				.rating-item{
					padding: 16px 0;
					@include bottom-1px(rgba(7,17,27,.2))
					.user{
						position: absolute;
						right:0px;
						top: 16px;
						line-height:12px;
						font-size:0;
						.name{
							display:inline-block;
							margin-right:6px;
							vertical-align:top;
							font-size:10px;
							color:rgb(147,153,159)
						}
						.avatar{
							border-radius: 50%;
						}
					}
					.time{
						margin-bottom:6px;
						line-height:12px;
						font-size:10px;
						color:rgb(147,153,159);
					}
					.text{
						line-height:16px;
						font-size:12px;
						color:rgb(7,17,27);
						.icon-thumb_up,.icon-thumb_down{
							margin-right:4px;
							font-size:12px;
						}
						.icon-thumb_up{
							color:rgb(0,160,220);
						}
						.icon-thumb_down{
							color:rgb(147,153,159)
						}
					}
				}
				.norating{
					padding: 16px 0;
					font-size:12px;
					color:rgb(147,153,159);
				}
			}
		}
	}
}
</style>