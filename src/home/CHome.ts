import { IObservableArray, makeObservable, observable } from "mobx";
import { BruceYuMi, CApp, CUqBase } from "uq-app";
import { Blog, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { VHome } from "./VHome";
import { CAccount } from "./account";
import { VBlogs } from "./VBlogs";
import { PageItems } from "tonva-react";
import { VBlog } from "./VBlog";

export class CHome extends CUqBase {
	readonly cAccount: CAccount;
	stocks: IObservableArray<Stock & StockValue> = null;
	listCaption: string = null;
	blogs: BlogPageItems;
	blog: Blog;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			stocks: observable.ref,
			listCaption: observable,
		});
		this.cAccount = this.newSub(CAccount);
	}

	protected async internalStart(param: any) {
		this.openVPage(VHome);
	}

	tab = () => {
		return this.renderView(VHome);
	}

	onStockClick = async (stock: Stock) => {
		this.cApp.cCommon.showStock(stock);
	}

	showBlogs = async () => {
		this.blogs = new BlogPageItems(this.uqs.BruceYuMi);
		this.openVPage(VBlogs);
		await this.blogs.first(undefined);
	}

	onClickBlog(blog: Blog) {
		this.blog = blog;
		this.openVPage(VBlog);
	}

	showIntroduction = () => {
		this.cApp.cMe.showFaq();
	}

    onSearch = async (key: string) => {
        this.cApp.cFind.onSearch(key);
	}

}


export class BlogPageItems extends PageItems<Blog> {
	private yumi: BruceYuMi.UqExt;

	constructor(yumi: BruceYuMi.UqExt) {
		super(false);
		this.yumi = yumi;
		this.firstSize = 30;
		this.pageSize = 10;
	}
	
	protected getPageId(item:Blog):any {
		return item?.id;
	}

	protected async loadResults (param:undefined, pageStart:any, pageSize:number):Promise<{[name:string]:any[]}> {
		let ret = await this.yumi.ID<Blog>({
			IDX: this.yumi.Blog,
			id: undefined,
			order: 'desc',
			page: {start: pageStart, size: pageSize},
		});
		return {$page: ret};
	}
}
