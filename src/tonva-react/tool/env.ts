import { from62 } from './62';
import { LocalMap } from './localDb';

/*
// 如果路径上有独立的test单词，则是test环境
// 这段代码移到下面 initEnv 去了
function isTesting():boolean {
	let ret = /(\btest\b)/i.test(document.location.href);
	return ret;
}
*/
export const env = (function () {
	let {unit, testing, params, lang, district} = initEnv();
    return {
		unit,
		testing,
		params,
		lang, 
		district,
        isDevelopment: process.env.NODE_ENV === 'development',
        localDb: new LocalMap(testing===true? '$$':'$'),
        setTimeout: (tag:string, callback: (...args: any[]) => void, ms: number, ...args: any[]):NodeJS.Timer => {
            return global.setTimeout(callback, ms, ...args);
        },
        clearTimeout: (handle:NodeJS.Timer):void => {
            global.clearTimeout(handle);
        },
        setInterval: (callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timer => {
            return global.setInterval(callback, ms, ...args);
        },
        clearInterval: (handle:NodeJS.Timer):void => {
            global.clearInterval(handle);
        }
    }
}());

function initEnv(): {
	unit:number; 
	testing:boolean; 
	params:{[key:string]:string}; 
	lang:string; 
	district:string;}
{
	let pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s:any) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
    let params:{[key:string]:string} = {};
    for (;;) {
	   let match = search.exec(query);
	   if (!match) break;
       params[decode(match[1])] = decode(match[2]);	
	}

	let testing:boolean; // = isTesting();
	let unit:number;

	let sUnit = params['u'] || params['unit'];
	if (sUnit) {
		let p = sUnit.indexOf('-');		
		if (p>=0) {
			let tc = sUnit.charCodeAt(p+1);
			const tt = 'tT';
			testing = tc === tt.charCodeAt(0) || tc === tt.charCodeAt(1);
			sUnit = sUnit.substr(0, p);
		}
		else {
			testing = false;
		}
		if (sUnit[0] === '0') {
			unit = Number(sUnit);
		}
		else {
			unit = from62(sUnit);
		}
		if (isNaN(unit) === true) unit = undefined;
	}
	else {
		// 下面都是为了兼容以前的操作。
		// 整个url上，只要有test作为独立的字符串出现，就是testing
		testing = /(\btest\b)/i.test(document.location.href);
		let unitName:string;
		let el = document.getElementById('unit');
		if (el) {
			unitName = el.innerText;
		}
		else {
			el = document.getElementById('unit.json');
			if (el) {
				let json = el.innerHTML;
				if (json) {
					let res = JSON.parse(json);
					unitName = res?.unit;
				}
			}
		}
		if (!unitName) {
			unitName = process.env.REACT_APP_UNIT;
		}

		if (unitName) {
			unit = Number.parseInt(unitName);
			if (Number.isInteger(unit) === false) {
				if (unitName === '百灵威') {
					unit = 24;
				}
			}
		}
		if (!unit) unit = 0;
	}
    let lang: string, district: string;
    let language = (navigator.languages && navigator.languages[0])  // Chrome / Firefox
        || navigator.language; // ||   // All browsers
    //navigator.userLanguage; // IE <= 10
    if (!language) {
        lang = 'zh';
        district = 'CN';
    }
    else {
        let parts = language.split('-');
        lang = parts[0];
        if (parts.length > 1) district = parts[1].toUpperCase();
    }
	return {unit, testing, params, lang, district};
}
