import React, { PropTypes } from 'react';
import purebem from 'purebem';

import CloseButton from './CloseButton';


const block = purebem.of('section-header');

const SectionHeader = React.createClass({

    propTypes: {
        headerText: PropTypes.string.isRequired,
        onClose: PropTypes.func
    },

    renderButton() {
        if (!this.props.onClose) {
            return null;
        }

        return (
            <CloseButton
                className={ block('button') }
                onClick={ this.props.onClose } />
        );
    },

    render() {
        return (
            <header className={ block() }>
                <div className={ block('title') }>{ this.props.headerText }</div>
                { this.renderButton() }
            </header>
        );
    }

});

export default SectionHeader;
