import { MenuConfig, MenuItemInterface } from 'common/menu';
import { Card } from 'comp/card';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Icon } from 'rsuite';
import 'styles/views/menu.scss';

interface PropsInterface extends RouteComponentProps {

}

export class Menu extends React.Component<PropsInterface> {
    handleCardItemClick(cardItem: MenuItemInterface) {
        const {
            history,
        } = this.props;

        history.push(cardItem.path);
    }

    render() {
        return (
            <div className='menu-wrapper'>
                {MenuConfig.map((item, index) => {
                    return (
                        <Card
                            key={item.path}
                            style={{
                                display: 'inline-block',
                                width: '300px',
                                margin: '10px 20px',
                                textAlign: 'left',
                                cursor: 'pointer',
                            }}
                            body={(
                                <div className='menu-card-body'>
                                    <div className='card-icon'>
                                        <Icon icon={item.icon} size='3x' />
                                    </div>
                                    <div className='card-text'>
                                        <div className='text-title'>
                                            {item.name}
                                        </div>
                                        <div className='text-desc'>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            )}
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => this.handleCardItemClick(item)}
                        />
                    );
                })}
            </div>
        );
    }
}