import { Controller } from "../components";
import { IConstructor } from "./CAppBase";

export abstract class CBase extends Controller {
    protected readonly _uqs: any;
    readonly cApp: any;

    constructor(cApp: any) {
        super(undefined);
        this.cApp = cApp;
        this._uqs = cApp.uqs;
        this.init();
    }

    protected get uqs(): any {return this._uqs}

    protected init() {}

    protected newC<T extends CBase>(type: IConstructor<T>):T {
        return new type(this.cApp);
    }

    protected newSub<T extends CSub>(type: IConstructor<T>):T {
        return new type(this);
    }
}

export abstract class CSub extends CBase {
    protected readonly owner: CBase;

    constructor(owner: CBase) {
        super(owner.cApp);
        this.owner = owner;
    }
}
