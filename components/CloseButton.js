import React, { PropTypes } from 'react';


const CloseButton = React.createClass({

    propTypes: {
        onClick: PropTypes.func.isRequired
    },

    render() {
        return (
            <div { ...this.props }>
                <div className="icon"></div>
            </div>
        );
    }

});

export default CloseButton;
