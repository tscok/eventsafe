import React, { PropTypes } from 'react';
import moment from 'moment';
import purebem from 'purebem';
import { apostrophe } from './utils';


const block = purebem.of('list-events');

const ListEvents = React.createClass({

    propTypes: {
        events: PropTypes.array.isRequired,
        remove: PropTypes.func.isRequired
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
                nextDay : '[is Tomorrow]',
                lastWeek : '[last] dddd',
                nextWeek : 'dddd',
                sameElse : '[on] MMMM Do'
            }
        });
    },

    handleRemove(date, id) {
        this.props.remove(date, id);
    },

    renderEvent(item, index) {
        let year = moment().year();
        let date = moment(`${year}${item.date}`, 'YYYY-MM-DD');
        let diff = date.diff(moment.unix(item.timestamp), 'years', true);
        let text = '';

        let birthdayText = (
            <span className={ block('data') }>{ apostrophe(item.name) } { item.type }; turns { diff } { date.calendar() }</span>
        );

        switch(item.type) {
            default:
                text = birthdayText;
        }

        return (
            <div key={ index } className={ block('event') }>{ text }
                <span onClick={ () => this.handleRemove(item.date, item.uid) } className={ block('remove') }>Remove</span>
            </div>
        );
    },

    render() {
        return (
            <div className={ block() }>
                {
                    [].map.call(this.props.events, this.renderEvent)
                }
            </div>
        );
    }
});

export default ListEvents;
