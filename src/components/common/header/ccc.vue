<!-- <div v-show="detailShow" class="detail" transition="fade">
	      <div class="detail-wrapper clearfix">
	        <div class="detail-main">
	          <h1 class="name">{{seller.name}}</h1>
	          <div class="star-wrapper">
	            <star :size="48" :score="seller.score"></star>
	          </div>
	          <div class="title">
	            <div class="line"></div>
	            <div class="text">优惠信息</div>
	            <div class="line"></div>
	          </div>
	          <ul v-if="seller.supports" class="supports">
	            <li class="support-item" v-for="(index,item) in seller.supports">
	              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
	              <span class="text">{{seller.supports[index].description}}</span>
	            </li>
	          </ul>
	          
	        </div>
	      </div>
	      <div class="detail-close" @click="hideDetail">
	        <i class="icon-close"></i>
	      </div>
	    </div> -->