import {nav} from 'tonva';

export interface HttpChannelUI {
    startWait():void;
    endWait():void;
    showError(error:any):Promise<void>;
}

export class HttpChannelNavUI implements HttpChannelUI {
    startWait() {
        nav.startWait();
    }
    endWait() {
        nav.endWait();
    }
    async showError(error:any):Promise<void> {
        nav.endWait();
        /*
        if (error.name === 'SyntaxError') {
            error = {
                name: error.name,
                message: error.message,
            }
        }*/
        await nav.onError(error);
    }
}

