import { EasyTime, LMR, VPage } from "tonva-react";
import { CHome } from "./CHome";

export class VBlogs extends VPage<CHome> {
	header() {
		return "米投博客";
	}

	content() {
		let right = <small className="text-muted align-self-center"><EasyTime date={new Date(2021, 1, 1, 12, 0, 0)} /></small>;
		return <div className="pb-3">
			<LMR className="d-flex px-3 py-2 my-1 cursor-pointer bg-white"
				onClick={this.controller.showIntroduction}
				right={right}>
				<div className="">
					米投体系概念
				</div>
			</LMR>
			<LMR className="d-flex px-3 py-2 my-1 cursor-pointer bg-white"
				onClick={this.controller.cApp.cMe.showAbout}
				right={right}>
				<div className="">
					关于本APP
				</div>
			</LMR>
		</div>
	}
}
