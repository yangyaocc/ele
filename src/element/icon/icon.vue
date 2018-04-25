<template>
	<span class="iconCp" 
	:style="{backgroundImage:iconUrl}"></span>
</template>

<script>
let classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
export default {
	props:{					
		type:{
			type:Number
		},
		iconNum:{
			type:Number
		}
	},
	created() {

	  this.iconUrl = "url(/static/icon/"+classMap[this.type]+'_'+this.iconNum+"@"+devicePixelRatio+"x.png"+")"
    },
    data(){
    	return {
    		
    	}
    }
}
</script>

<style lang="scss">
.iconCp{
	display: inline-block;
	vertical-align: top;
	width: 12px;
	height: 12px;
	margin-right: 4px;
	background-size: 12px 12px;
	background-repeat: no-repeat;
}
</style>