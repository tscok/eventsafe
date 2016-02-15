import React, { PropTypes } from 'react';
import purebem from 'purebem';


const block = purebem.of('navigation');

const Navigation = React.createClass({

    propTypes: {
        onUpdate: PropTypes.func.isRequired
    },

    render() {
        return (
            <header className={ block() }>
                <nav className={ block('navbar') }>
                    <a href="#" className={ block('link') } onClick={ () => this.props.onUpdate({ showCreate: true }) }>New Event</a>
                    <a href="#" className={ block('link') }>Upcoming</a>
                </nav>
            </header>
        );
    }

});

export default Navigation;
