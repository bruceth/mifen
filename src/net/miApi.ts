import _ from 'lodash';
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { ApiBase } from './apiBase';

let channelUIs: { [name: string]: HttpChannel } = {};
let channelNoUIs: { [name: string]: HttpChannel } = {};

class MiApiChannel extends ApiBase {
  private apiName: string;
  url: string;

  constructor(url: string, basePath: string, apiName: string, uqToken: string, showWaiting?: boolean) {
    super(basePath, showWaiting);
    this.showWaiting = showWaiting;
    this.apiName = apiName;
    this.token = uqToken;
    this.url = url;
  }

  protected async getHttpChannel(): Promise<HttpChannel> {
    let channels: { [name: string]: HttpChannel };
    let channelUI: HttpChannelNavUI;
    if (this.showWaiting === true || this.showWaiting === undefined) {
      channels = channelUIs;
      channelUI = new HttpChannelNavUI();
    }
    else {
      channels = channelNoUIs;
    }
    let channel = channels[this.apiName];
    if (channel !== undefined) return channel;
    channel = new HttpChannel(this.url, this.token, channelUI);
    return channels[this.apiName] = channel;
  }
}

export class MiApi {
  private channel: MiApiChannel;

  constructor(url: string, basePath: string, apiName: string, uqToken: string, showWaiting?: boolean) {
    this.channel = new MiApiChannel(url, basePath, apiName, uqToken, showWaiting);
  }

  async query(name: string, params: any[]): Promise<any> {
    let pbody = { call: name, params: params };
    return await this.channel.post('sql/call', pbody);
  }

  async page(name: string, params: any[], pageStart: number, pageSize: number): Promise<any> {
    let p: any[];
    switch (typeof params) {
      case 'undefined': p = []; break;
      default: p = _.clone(params); break;
    }
    p.push(pageStart);
    p.push(pageSize);
    let pbody = { call: name, params: p };
    return await this.channel.post('sql/call', pbody);
  }

  async process(proc: any, params: any[]): Promise<any> {
    let pbody = { proc: proc, params: params };
    return await this.channel.post('sql/query', pbody);
  }
}
