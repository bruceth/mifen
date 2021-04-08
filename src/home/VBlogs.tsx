import { EasyTime, List, LMR, VPage } from "tonva-react";
import { Blog } from "uq-app/uqs/BruceYuMi";
import { CHome } from "./CHome";

export class VBlogs extends VPage<CHome> {
	header() {
		return "米投博客";
	}
	/*
	<LMR className="d-flex px-3 py-2 my-1 cursor-pointer bg-white"
	onClick={this.controller.showIntroduction}
	right={right}>
	<div className="">
		米投体系概念
	</div>
	</LMR>
	*/
	content() {
		let right = <small className="text-muted align-self-center"><EasyTime date={new Date(2021, 1, 1, 12, 0, 0)} /></small>;
		return <div className="pb-3">
			<LMR className="d-flex px-3 py-2 mt-1 mb-3 cursor-pointer bg-white"
				onClick={this.controller.cApp.cMe.showAbout}
				right={right}>
				<div className="">
					关于本APP
				</div>
			</LMR>

			<List items={this.controller.blogs} item={{render: this.renderBlog, onClick: this.onClickBlog}} />
		</div>
	}

	private renderBlog = (blog: Blog, index: number) => {
		let {caption, $create} = blog;
		let right = <small className="text-muted"><EasyTime date={$create} /></small>
		return <LMR className="px-3 py-2" right={right}>
			{caption}
		</LMR>;
	}

	private onClickBlog = (blog: Blog) => {
		this.controller.onClickBlog(blog);
	}
}
