import { VPage } from "tonva-react";
import { marked } from 'marked';
import { CHome } from "./CHome";

export class VBlog extends VPage<CHome> {
    header() { return this.controller.blog.caption; }
    content() {
        let { content } = this.controller.blog;
        return <div className="p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
    }
}