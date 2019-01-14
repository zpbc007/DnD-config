import * as React from 'react';
import { ButtonGroup, ButtonToolbar } from 'rsuite';
import 'styles/comp/card.scss';

interface CardPorps {
    actions?: React.ReactElement<any>[];
    body: React.ReactElement<any>;
    title?: string;
    style?: React.CSSProperties;
    [key: string]: any;
}

export class Card extends React.Component<CardPorps, any>{
    static defaultProps: CardPorps = {
        style: {
            width: '300px',
        },
        body: null,
    };

    renderTitle() {
        if (this.props.title) {
            return (
                <div className='card-title'>
                    {this.props.title}
                </div>
            );
        } else {
            return null;
        }
    }

    renderActions() {
        const { actions } = this.props;
        if (actions && actions.length > 0) {
            return (
                <div className='card-actions'>
                    <ButtonToolbar>
                        <ButtonGroup justified={true}>
                            {this.props.actions.map((action, index) => {
                                return action;
                            })}
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        const {
            style,
            body,
            actions,
            title,
            ...otherProps
        } = this.props;
        return (
            <div
                className='card-container'
                style={style}
                {...otherProps}
            >
                {this.renderTitle()}
                <div className='card-body'>
                    {body}
                </div>
                {this.renderActions()}
            </div>
        );
    }
}
