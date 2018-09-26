import classNames from 'classnames';
import * as React from 'react';
import 'styles/json_config/panel/index.scss';

export interface PropsInterface {
    className?: string;
    header?: React.ReactNode;
    bordered?: boolean;
    [key: string]: any;
}

export class Panel extends React.PureComponent<PropsInterface> {
    renderHeader = () => {
        const { header } = this.props;
        if (!header) {
            return null;
        }

        return (
            <div className='panel-header'>
                {header}
            </div>
        );
    }

    render() {
        const {bordered, header, className, ...props} = this.props;
        const classes = classNames('panel', {
            bordered,
        }, className);
        return (
            <div className={classes} {...props}>
                {this.renderHeader()}
                <div className='panel-body'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}