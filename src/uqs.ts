import { Tuid, Action, Query, Map } from 'tonva';

export interface UQs {
    mi: {
        Tag: Tuid;
        TagStock: Map;
        SaveTag: Action;
        AllTags: Query;
    }
}
