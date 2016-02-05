import React, { PropTypes } from 'react';
import moment from 'moment';
import purebem from 'purebem';


const block = purebem.of('list-dates');

const ListDates = React.createClass({

    propTypes: {
        dates: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            dates: []
        };
    },

    handleClick(date) {
        this.props.onClick(date);
    },

    renderDate(date, index) {
        let m = moment(moment().year() + date, 'YYYYMMDD');
        return (
            <div className={ block('date') } key={ index } onClick={ this.handleClick.bind(this, date) }>
                <div className={ block('month') }>{ m.format('MMM') }</div>
                <div className={ block('day') }>{ m.format('D') }</div>
            </div>
        );
    },

    render() {
        return (
            <div className={ block() }>
                {
                    [].map.call(this.props.dates, this.renderDate)
                }
            </div>
        );
    }
});

export default ListDates;
