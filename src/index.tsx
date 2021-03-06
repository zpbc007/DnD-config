import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Router from 'router';
import 'styles/index.less';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Router />,
        document.getElementById('app') as HTMLElement,
    );
});