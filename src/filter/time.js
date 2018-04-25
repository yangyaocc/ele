export function formatDate(date,fmt){
	if(/(Y+)/.test(fmt))
	fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'')).substr(4-RegExp.$1.length);
	let o ={
		"M+":date.getMonth()+1,
		"D+":date.getDate(),
		"h+":date.getHours(),
		"m+":date.getMinutes(),
		"s+":date.getSeconds()
	}
	for(let key in o){
		let match = fmt.match(new RegExp(`${key}`));
		if(match){
			let matchStr = match[0]
			let str = o[key]+'';
			fmt = fmt.replace(matchStr,matchStr.length==1?str:padLeftZero(str));
		}
	}

	return fmt; 
}

function padLeftZero(str){
	return ("00"+str).substr(str.length);
}