import React, { PropTypes } from 'react';
import moment from 'moment';
import purebem from 'purebem';


const block = purebem.of('list-events');

const ListEvents = React.createClass({

    propTypes: {
        events: PropTypes.array.isRequired
    },

    getDefaultProps() {
        return {
            events: []
        };
    },

    componentWillMount() {
        moment.locale('en', {
            calendar : {
                lastDay : '[Yesterday]',
                sameDay : '[Today]',
                nextDay : '[Tomorrow]',
                lastWeek : '[last] dddd',
                nextWeek : 'dddd',
                sameElse : 'L'
            }
        });
    },

    renderEvent(item, index) {
        // console.log(item);
        // let year = moment().format('YYYY');
        // let date = moment(`${year}${item}`, 'YYYY-MM-DD');
        return (
            <li key={ index }></li>
        );
    },

    render() {
        // console.log(this.props.events);
        return (
            <ul className={ block() }>
                {
                    [].map.call(this.props.events, this.renderEvent)
                }
            </ul>
        );
    }
});

export default ListEvents;
