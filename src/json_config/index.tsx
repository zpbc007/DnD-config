import * as React from 'react';
import JsonViewer from './json_viewer';

export default class JsonConfig extends React.Component<any, {json: any}> {
    constructor(props) {
        super(props);

        this.state = {
            json: {
                a: 1,
                b: 2,
            },
        };
    }
    render() {
        return (
            <JsonViewer
                value={this.state.json}
            />
        );
    }
}