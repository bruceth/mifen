import React from 'react';
import { observer } from 'mobx-react';
import { Image, VPage, nav, IconText, PropGrid, LMR, FA, Prop, Page } from 'tonva-react';
import { CMe } from './CMe';
import { appConfig } from '../appConfig';
import { VFaq } from './VFaq';

export class VMe extends VPage<CMe> {
	header() {return this.t('me')}

	content() {
        const { user } = nav;
        let aboutRows: Prop[] = [
            '',
            {
                type: 'component',
                component: <LMR className="w-100" onClick={this.faq}
					right={<FA className="align-self-center" name="angle-right" />}>
                    <IconText iconClass="text-info mr-2" icon="comments-o" text={this.t('基本概念')} />                    
                </LMR>,
            },
            {
                type: 'component',
                component: <LMR className="w-100" onClick={this.aboutMe}
					right={<FA className="align-self-center" name="angle-right" />}>
                    <IconText iconClass="text-info mr-2" 
						icon="smile-o" 
						text={<>{this.t('aboutTheApp')} <small>版本 {appConfig.version}</small></>} />                    
                </LMR>,
            },
        ];

        let rows: Prop[];
        if (user === undefined) {
            rows = aboutRows;
            rows.push(
                {
                    type: 'component',
                    component: <button className="btn btn-success w-100 my-2" onClick={() => nav.logout()}>
                        <FA name="sign-out" size="lg" /> {this.t('pleaseLogin')}
                    </button>
                },
            );
        }
        else {
            let logOutRows: Prop[] = [
				/*
                '',
                {
                    type: 'component',
                    bk: '',
                    component: <button className="btn btn-danger w-100" onClick={this.onExit}>
                        <FA name="sign-out" size="lg" /> {this.t('logout')}
                </button>
                },
				*/
            ];

            rows = [
                '',
                {
                    type: 'component',
                    component: <this.meInfo />
                },
				/*
                '',
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="key" text={this.t('changePassword')} />,
                    onClick: this.changePassword
                },*/
            ]
            rows.push(...aboutRows, ...logOutRows);
        }
        return <PropGrid rows={[...rows]} values={{}} />;
	}
/*
	private onExit = () => {
        nav.showLogout();
    }

    private changePassword = async () => {
        await nav.changePassword();
    }
*/
    private meInfo = observer(() => {
        let { user } = nav;
        if (user === undefined) return null;
        let { id, name, nick, icon } = user;
        return <LMR className="py-2 cursor-pointer w-100"
            left={<Image className="w-3c h-3c mr-3" src={icon || '.user-o'} />}
            right={<FA className="align-self-end" name="angle-right" />}
            onClick={this.controller.showEditMe}>
            <div>
                <div>{userSpan(name, nick)}</div>
                <div className="small"><span className="text-muted">ID:</span> {id > 10000 ? id : String(id + 10000).substr(1)}</div>
            </div>
        </LMR>;
    });

	private faq = () => {
		this.openVPage(VFaq);
	}

	private aboutMe = () => {
		this.openPageElement(<Page header="关于APP">
			<div className="py-5 px-3 my-3 w-max-30c mx-auto bg-white">				
				<div className="text-center mb-5 position-relative">
					<small className="text-muted position-absolute"
						style={{right:'0', top:'-2.8rem'}}>
						版本: {appConfig.version}
					</small>
					<i className="text-danger position-absolute top-0 start-0 fa fa-fire fa-2x" 
						style={{left:'2rem', top:'0.5rem'}} />
					<b className="text-danger h5 mb-0">
						<span className="text-primary">鱼</span>
						<b className="mx-1">米</b>
						<span className="text-success">乡</span>
					</b>
					<br/>
					<small className="text-info">私享投资圈</small>
				</div>
				<ul>
					<li>跟家人和好友一起分享投资思考。</li>
					<li>世界级投资大师年化收益率11%。</li>
					<li>全球最大的成长经济体GDP增长率高于5%。</li>
					<li>以10%为基础，期待<b className="text-danger mx-1">15%以上</b>的高水平。</li>
				</ul>
				<div className="mt-5 text-center">
					<small className="text-muted mr-2">by</small>
					Bruce 
					<small className="text-warning mx-2">
						<FA name="handshake-o" />
					</small>
					Henry
				</div>
			</div>
		</Page>);
	}
}

function userSpan(name: string, nick: string): JSX.Element {
    return nick ?
        <><b>{nick} &nbsp; <small className="muted">{name}</small></b></>
        : <b>{name}</b>
}
