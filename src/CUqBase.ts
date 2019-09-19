import { CBase, CSub } from 'tonva';
import { UQs } from './uqs';

export abstract class CUqBase extends CBase {
  protected get uqs() : UQs {return this._uqs as UQs};
}

export abstract class CUqSub extends CSub {
  protected get uqs() : UQs {return this._uqs as UQs};
  protected readonly owner: any;
}
