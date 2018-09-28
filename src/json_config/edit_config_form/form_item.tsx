import * as React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'rsuite';

interface PropsInterface {
    label: string;
    name: string;
    accepter: React.ComponentClass | any;
}

export default class FormItem extends React.Component<PropsInterface> {
    render() {
        const { label, name, accepter, ...props } = this.props;
        return (
            <FormGroup>
                <ControlLabel>{label} </ControlLabel>
                <FormControl
                    name={name}
                    accepter={accepter}
                    {...props}
                />
            </FormGroup>
        );
    }
}