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

    renderDate(item, index) {
        let today = moment();
        let date = moment(today.year() + item.date, 'YYYYMMDD');
        return (
            <div className={ block('item') } key={ index } onClick={ () => this.handleClick(item.date) }>
                <div className={ block('date') }>
                    <div className={ block('month') }>{ date.format('MMM') }</div>
                    <div className={ block('day') }>{ date.format('D') }</div>
                </div>
                <div className={ block('info') }>
                    <div className={ block('events') }>{ item.events } Event{ item.events > 1 ? 's' : '' }</div>
                    <div className={ block('days') }>{ today.to(date) }</div>
                </div>
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
