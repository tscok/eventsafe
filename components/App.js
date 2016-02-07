import React from 'react';
import Firebase, { ReactFireMixin } from 'firebase';
import moment from 'moment';

import CreateEvent from './CreateEvent';
import ListDates from './ListDates';
import ListEvents from './ListEvents';


const App = React.createClass({

    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            currentDates: [],
            displayDates: [],
            displayEvents: [],
            isValidDate: false,
            isValidName: false
        };
    },

    componentWillMount() {
        this.firebaseRef = new Firebase('https://eventsafe.firebaseio.com/dates');

        /* --- ALL DATES --- */
        let displayDates = [];
        this.firebaseRef.on('value', (snap) => {
            displayDates.length = 0;
            snap.forEach((date) => {
                displayDates.push(date.key());
            });
            this.setState({ displayDates });
        });

        /* --- CURRENT DATES --- */
        let m = moment();
        let thisDate = m.format('MMDD');
        let nextDate = m.add(1, 'months').format('MMDD');
        let endAt = nextDate < thisDate ? '1231' : nextDate;

        console.log('thisDate:', thisDate, 'nextDate:', nextDate, 'endAt:', endAt);

        let normalDates = [];
        let specialDates = [];
        
        // normal case
        this.firebaseRef.orderByKey().startAt(thisDate).endAt(endAt).on('value', (snap) => {
            normalDates.length = 0;
            snap.forEach((date) => {
                date.forEach((data) => {
                    let obj = data.val();
                    obj.uid = data.key();
                    obj.date = date.key();
                    normalDates.push(obj);
                });
            });
            this.setState({ currentDates: normalDates.concat(specialDates) });
        });

        // special case
        this.firebaseRef.orderByKey().startAt(nextDate).endAt(nextDate).on('value', (snap) => {
            if (nextDate > thisDate) {
                return;
            }
            specialDates.length = 0;
            snap.forEach((date) => {
                date.forEach((data) => {
                    let obj = data.val();
                    obj.uid = data.key();
                    obj.date = date.key();
                    specialDates.push(obj);
                });
            });
            this.setState({ currentDates: normalDates.concat(specialDates) });
        });
    },

    handleDateClick(date) {
        let displayEvents = []
        let clicked = this.firebaseRef.orderByKey().equalTo(date);
        let getEvents = (snap) => {
            snap.forEach((date) => {
                date.forEach((data) => {
                    let obj = data.val();
                    obj.uid = data.key();
                    obj.date = date.key();
                    displayEvents.push(obj);
                });
            });
            this.setState({ displayEvents });
        };
        clicked.on('value', getEvents);
        clicked.off('value', getEvents);
    },

    handleInputName(isValidName) {
        this.setState({ isValidName });
    },

    handleInputDate(isValidDate) {
        this.setState({ isValidDate });
    },

    handleReset() {
        this.setState({
            isValidDate: false,
            isValidName: false
        });
    },

    handleRemove(date, id) {
        this.firebaseRef.child(date).child(id).remove();
    },

    handleSubmit(date, data) {
        return this.firebaseRef.child(date).push(data);
    },

    renderEventsOn() {
        if (this.state.displayEvents.length === 0) {
            return null;
        }
        return (
            <section>
                <h5>Events on…</h5>
                <ListEvents
                    events={ this.state.displayEvents }
                    remove={ this.handleRemove } />
            </section>
        );
    },

    renderUpcoming() {
        if (this.state.currentDates.length === 0) {
            return null;
        }
        return (
            <section>
                <h5>Upcoming Events</h5>
                <ListEvents
                    events={ this.state.currentDates }
                    remove={ this.handleRemove } />
            </section>
        );
    },

    render() {
        return (
            <main>
                <section>
                    <ListDates
                        dates={ this.state.displayDates }
                        onClick={ this.handleDateClick } />
                </section>
                { this.renderEventsOn() }
                { this.renderUpcoming() }
                <section>
                    <h5>Add Event</h5>
                    <CreateEvent
                        isValidDate={ this.state.isValidDate }
                        isValidName={ this.state.isValidName }
                        onInputDate={ this.handleInputDate }
                        onInputName={ this.handleInputName }
                        onReset={ this.handleReset }
                        onSubmit={ this.handleSubmit } />
                </section>
            </main>
        );
    }

});

export default App;
