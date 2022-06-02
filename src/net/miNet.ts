import { consts } from "net/consts";
import { User } from "tonva-react";
import { MiApi } from "./miApi";

export class MiNet {
	private miApi: MiApi;
	private user: User;

	constructor(user: User) {
		let miHost = consts.miApiHost;
		if (document.baseURI.indexOf('localmiserver') > 0) {
			miHost = consts.miApiHostDebug;
		}
		this.user = user;
		this.miApi = new MiApi(miHost, 'miscan/', 'miapi', user.token, false);
	}

	get userId():number {return this.user.id;}

	async process(proc:any, params:any[]) {
		return await this.miApi.process(proc, params);
	}

	async q_marketpe(param:any):Promise<{day:number, pe:number, e:number}[]> {
		let rets = await this.miApi.query('q_marketpe', param) as {day:number, pe:number, e:number}[];
		return rets;
	}

	async t_toppredictavg$query(day:any):Promise<any[]> {
		let ret = await this.miApi.call('t_toppredictavg$query', [day]);
		return ret;
	}

	async q_stocks$page(p:any, pageStart:any, pageSize:any):Promise<any> {
		let ret = await this.miApi.page('q_stocks$page', p, pageStart, pageSize);
		return ret;
	}

	async q_stockallinfo(id:any, day:any) {
		return this.miApi.query('q_stockallinfo', [id, day]);
	}

	async q_stockallinfotrack(id:any, day:any) {
		return this.miApi.query('q_stockallinfo@track', [id, day]);
	}

    async t_tagstock$query(tagId:any, id:any) {
		return this.miApi.query('t_tagstock$query', [this.user.id, tagId, id]) //this.uqs.mi.TagStock.query({ user: nav.user.id, stock: id })
	}

	async t_tag$all() {
		return await this.miApi.query('t_tag$all', [this.user.id]);
	}

	async t_tag$save(name:string) {
		return await this.miApi.call('t_tag$save', [this.user.id, undefined, name]);
	}

	async t_tagstock$add(tagId:any, baseId:any) {
		return await this.miApi.call('t_tagstock$add', [this.user.id, tagId, baseId]); //.uqs.mi.TagStock.add(param);
	}

	async t_tagstock$del(tagId:any, baseId:any) {
		return await this.miApi.call('t_tagstock$del', [this.user.id, tagId, baseId]); // //await this.uqs.mi.TagStock.del(param);
	}

	async t_stockwarning$all() {
		return await this.miApi.call('t_stockwarning$all', [this.user.id]);//await this.uqs.mi.StockWarningAll.query(undefined);
	}

	async t_stockwarning$add(id:any, type:any, price:any) {
		return await this.miApi.call('t_stockwarning$add', [this.user.id, id, type, price]);
	}

	async t_usersettings$save(v:string) {
		return await this.miApi.call('t_usersettings$save', [this.user.id, 'config', v]);
	}

	async t_usersettings$query() {
		return await this.miApi.query('t_usersettings$query', [this.user.id, 'config']);
	}

	// async t_allaccounts() {
	// 	return await this.miApi.query('t_allaccounts', [this.user.id]);
	// }

	async q_getlasttradeday() {
		return await this.miApi.call('q_getlasttradeday', []);
	}

    async q_getnexttradedays(day: number) {
        return await this.miApi.call(`q_tradedays`, [day]);
    }

    async q_searchstock(day: number, user: number, pageStart: any, pageSize: number, orderSwitch?: string, key?: string, market?: string, smooth?: number) {
        let ret = await this.miApi.call(`tv_searchstock`, [user, pageStart, pageSize, orderSwitch, key, market, smooth, day]);
        if (Array.isArray(ret)) {
            return {$page: ret};
        }
        else {
            return { $page: [] };
        }
    }
}
