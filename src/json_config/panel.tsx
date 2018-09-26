import classNames from 'classnames';
import * as React from 'react';
import 'styles/json_config/panel/index.scss';

export interface PropsInterface {
    className?: string;
    header?: React.ReactNode;
    bordered?: boolean;
    [key: string]: any;
}

export class Panel<T extends PropsInterface = PropsInterface> extends React.Component<T> {
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

    mainRender(divProps) {
        const {bordered: divBordered, header, className: divClassName, ...props} = divProps;
        const { bordered, className } = this.props;
        const classes = classNames('panel', {
            bordered,
        }, className, divClassName);
        return (
            <div className={classes} {...props}>
                {this.renderHeader()}
                <div className='panel-body'>
                    {this.props.children}
                </div>
            </div>
        );
    }

    render() {
        return this.mainRender(this.props);
    }
}