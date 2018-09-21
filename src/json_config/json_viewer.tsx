import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

const cmOptions = {
    theme: 'default',
    height: 'auto',
    viewportMargin: Infinity,
    mode: {
      name: 'javascript',
      json: true,
      statementIndent: 2,
    },
    lineNumbers: true,
    lineWrapping: true,
    indentWithTabs: false,
    tabSize: 2,
};

export default class JsonViewer extends React.Component<{value: any}, {value: any}> {
    handleCodeChange = () => {
    }

    handleBeforeChange = (editor, data, value) => {
    }

    toJson = val => JSON.stringify(val, null, 2);

    render() {
        return (
            <CodeMirror
                value={this.toJson(this.props.value)}
                options={cmOptions}
                onBeforeChange={this.handleBeforeChange}
                onChange={this.handleCodeChange}
            />
        );
    }
}