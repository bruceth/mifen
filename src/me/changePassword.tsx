import * as React from 'react';
import {Page, nav, Form, Context, Schema, UiSchema, UiPasswordItem} from 'tonva';
//import center from './center';

const schema: Schema = [
    {name:'orgPassword', type: 'string', required: true},
    {name:'newPassword', type: 'string', required: true},
    {name:'newPassword1', type: 'string', required: true},
    {name: 'submit', type: 'submit'},
];

const uiSchema: UiSchema = {
    items: {
        orgPassword: {
            widget: 'password',
            label: '原密码',
            maxLength: 60,
            placeholder: '输入原来的密码'
        } as UiPasswordItem,
        newPassword: {
            widget: 'password',
            label: '新密码',
            maxLength: 60,
            placeholder: '输入新设的密码'
        } as UiPasswordItem,
        newPassword1: {
            widget: 'password',
            label: '确认密码',
            maxLength: 60,
            placeholder: '再次输入新设密码'
        } as UiPasswordItem,
        submit: {
            widget: 'button',
            className: 'btn btn-primary',
            label: '提交'
        }
    }
}

export default class ChangePasswordPage extends React.Component {
    private onSubmit = async (name:string, context:Context):Promise<string> => {
        let values:any = context.form.data;
        let {orgPassword, newPassword, newPassword1} = values;
        if (newPassword !== newPassword1) {
            context.setValue('newPassword', '');
            context.setValue('newPassword1', '');
            return '新密码错误，请重新输入';
        }
        let ret = false; //await center.changePassword({orgPassword: orgPassword, newPassword:newPassword});
        if (ret === false) {
            context.setValue('orgPassword', '');
            return '原密码错误';
        }
        nav.replace(<Page header="修改密码" back="close">
            <div className="m-3  text-success">
                密码修改成功！
            </div>
        </Page>);
        return;
    }
    render() {
        return <Page header="修改密码">
            <Form className="m-3"
                schema={schema} uiSchema={uiSchema}
                requiredFlag={false}
                onButtonClick={this.onSubmit} />
        </Page>;
    }
}
