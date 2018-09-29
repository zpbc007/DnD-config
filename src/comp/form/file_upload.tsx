import * as React from 'react';
import { Button } from 'rsuite';
import { FieldCommonProps } from './type';

export default class FileUpload extends React.PureComponent<FieldCommonProps> {
    render() {
        const { type, format, widget, title, ...props } = this.props;

        return (
            <div {...props}>
                <Button>上传</Button>
            </div>
        );
    }
}