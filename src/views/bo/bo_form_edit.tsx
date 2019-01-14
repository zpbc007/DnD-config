import { withStore } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Panel } from 'rsuite';
import { BoFormEditStore } from './bo_form_edit.store';

interface Params {
    ttid: string;
}

interface PropsInterface extends RouteComponentProps<Params> {
    store: BoFormEditStore;
}

@observer
class BoFormEdit extends React.Component<PropsInterface> {
    render() {
        return (
            <Panel
                bordered={true}
                header={<h3>编辑布局配置</h3>}
            >
                bo
            </Panel>
        );
    }

    componentDidMount() {
        const { match } = this.props;

        this.props.store.fetchJsonSchema(match.params.ttid, 'form');
    }
}

export default compose(
    withRouter,
    withStore(BoFormEditStore)(),
)(BoFormEdit);