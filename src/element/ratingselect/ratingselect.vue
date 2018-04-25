<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span class="block positive" @click="select(2,$event)" :class="{'active':selectType==2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span class="block positive" @click="select(0,$event)" :class="{'active':selectType==0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span class="block negative" @click="select(1,$event)" :class="{'active':selectType==1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" @click="onlyContentToggle" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
	props:{
		ratings:{
			type:Array,
			default(){
				return [];
			}
		},
		selectType:{
			type:Number,
			default:ALL
		},
		onlyContent:{
			type:Boolean, 
			default:false
		},
		desc:{
			type:Object,
			default(){
				return {
					all:"全部",
					positive:"满意",
					negative:"不满意"
				}
			}
		}
	},
	methods:{
		onlyContentToggle(){
			if(!event._constructed){
				return;
			}
			
			this.onlyContent = !this.onlyContent;
			this.$root.eventHub.$emit("content.toggle",this.onlyContent);
		},
		select(type,event){

			if(!event._constructed){
				return;
			}
			this.selectType = type;
			this.$root.eventHub.$emit("ratingtype.select",type);
		}
	},
	computed:{
		positives(){
			return this.ratings.filter((rating)=>{
				return rating.rateType == POSITIVE;
			});
		},
		negatives(){
			return this.ratings.filter((rating)=>{
				return rating.rateType == NEGATIVE;
			});
		},
	}
}
</script>

<style lang="scss">
@import '../../assets/css/mixin.scss';

.ratingselect{
	.rating-type{
		padding:18px 0;
		margin: 0 18px;
		@include bottom-1px(rgba(7,17,27,0.1));
		font-size:0;
		.block{
			display:inline-block;
			padding: 8px 12px;
			line-height:16px;
			margin-right:8px;
			border-radius:2px;
			font-size:12px;
			color:rgb(77,85,93);
			.count{
				font-size:8px;
				margin-left:2px;
			}
			&.active{
				color:#fff;
			}
			&.positive{
				background:rgba(0,160,220,.2);
				&.active{
					background:rgb(0,160,220)
				}
			}
			&.negative{
				background:rgba(77,85,93,.2);
				&.active{
					background:rgb(77,85,93)
				}
			}

		}

	}
	.switch{
		padding:12px 18px;
		line-height:24px;
		@include bottom-1px(rgba(7,17,27,0.1));
		color:rgb(147,153,159);
		font-size: 0px;
		&.on{
			.icon-check_circle{
				color:#00c850;
			}
		}
		.icon-check_circle{
			display:inline-block;
			vertical-align: top;
			margin-right: 4px;
			font-size:24px;
		}
		.text{
			display:inline-block;
			vertical-align: top;
			font-size:12px;
		}

	}
}

</style>