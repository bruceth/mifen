import * as React from 'react';
import Loadable from 'react-loadable';
import { Loading } from 'tonva';

export const meTab = () => {
    let LoadableComponent = Loadable({
        loader: () => import('./tab'),
        loading: Loading
    });
    return <LoadableComponent />;
}
