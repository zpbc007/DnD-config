import { EditorConfiguration } from 'codemirror';
import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/ttcn.css';

import 'styles/json_viewer.scss';

const cmOptions: EditorConfiguration = {
    theme: 'default',
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

interface PropsInterface {
    value: any;
    className?: string;
}

/**
 * 展示json组件
 */
export default class JsonViewer extends React.PureComponent<PropsInterface> {
    handleCodeChange = () => {
    }

    handleBeforeChange = (editor, data, value) => {
    }

    toJson = val => JSON.stringify(val, null, 2);

    render() {
        return (
            <div className={this.props.className}>
                <CodeMirror
                    className='json-viewer'
                    value={this.toJson(this.props.value)}
                    options={{...cmOptions, theme: 'solarized'}}
                    onBeforeChange={this.handleBeforeChange}
                    onChange={this.handleCodeChange}
                />
            </div>
        );
    }
}