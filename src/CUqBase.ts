import { CBase, CSub } from 'tonva';
import { UQs } from './uqs';
import { CMiApp } from './CMiApp';

export abstract class CUqBase extends CBase {
  protected get uqs() : UQs {return this._uqs as UQs};
  get cApp(): CMiApp { return this._cApp as CMiApp };
}

export abstract class CUqSub extends CSub {
  protected get uqs() : UQs {return this._uqs as UQs};
  protected readonly owner: any;
}
