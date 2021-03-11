function getsortFunc(sortType:string) {
	switch (sortType) {
		case 'tagpe':
			return (a:any, b:any) => a.pe - b.pe;
		case 'tagdp': 
			return (a:any, b:any) => b.divyield - a.divyield;
		default:
			return (a:any, b:any) => b.v - a.v;
	}
}

export function sortStocks(sortType:string, arr:any[]) {
	arr.sort(getsortFunc(sortType));
	let o = 1;
	for (let item of arr) {
		item.order = o;
		++o;
	}
}
