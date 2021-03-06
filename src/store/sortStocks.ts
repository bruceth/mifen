function getsortFunc(sortType:string) {
	switch (sortType) {
		case 'tagpe':
			return (a, b) => a.pe - b.pe;
		case 'tagdp': 
			return (a, b) => b.divyield - a.divyield;
		default:
			return (a, b) => b.v - a.v;
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
