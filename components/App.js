import React from 'react';
import Firebase, { ReactFireMixin } from 'firebase';
import moment from 'moment';

import Navigation from './Navigation';
import CreateEvent from './CreateEvent';
import ListDates from './ListDates';
import ListEvents from './ListEvents';
import SectionHeader from './SectionHeader';


const App = React.createClass({

    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            coming: [],
            dates: [],
            events: [],
            isValidDate: false,
            isValidName: false,
            showComing: false,
            showCreate: false
        };
    },

    componentWillMount() {
        this.firebaseRef = new Firebase('https://eventsafe.firebaseio.com/dates');
        this.getComing();
        this.getDates();
    },

    getComing() {
        const m = moment();
        const today = m.format('MMDD');
        const nextMonth = m.add(1, 'months').format('MMDD');
        const endAt = nextMonth < today ? '1231' : nextMonth;

        const mostRef = this.firebaseRef.orderByKey().startAt(today).endAt(endAt);
        const someRef = this.firebaseRef.orderByKey().startAt(nextMonth).endAt(nextMonth);

        let mostDates = [], someDates = [];

        mostRef.on('value', (snap) => {
            mostDates.length = 0;
            mostDates = this.getList(snap);
            this.setState({ coming: mostDates.concat(someDates) });
        });

        someRef.on('value', (snap) => {
            if (today < nextMonth) {
                return;
            }
            someDates.length = 0;
            someDates = this.getList(snap);
            this.setState({ coming: mostDates.concat(someDates) });
        });
    },

    getDates() {
        let dates = [];
        this.firebaseRef.on('value', (snap) => {
            dates.length = 0;
            snap.forEach((date) => {
                dates.push({ date: date.key(), events: date.numChildren() });
            });
            this.setState({ dates });
        });
    },

    getEvents(date) {
        this.selectedDateRef = this.firebaseRef.orderByKey().equalTo(date);
        this.selectedDateRef.on('value', this.handleEvents);
    },

    getList(snap) {
        let arr = [];
        snap.forEach((date) => {
            date.forEach((data) => {
                let obj = data.val();
                obj.uid = data.key();
                obj.date = date.key();
                arr.push(obj);
            })
        });
        return arr;
    },

    handleEvents(snap) {
        let events = this.getList(snap);
        this.setState({ events });
    },

    handleDropEvents() {
        this.selectedDateRef.off('value', this.handleEvents);
        this.setState({ events: [] });
    },

    handleStateUpdate(state) {
        this.setState(state);
    },

    onFormReset() {
        this.setState({ isValidDate: false, isValidName: false });
    },

    onFormSubmit(date, data) {
        return this.firebaseRef.child(date).push(data);
    },

    onRemoveEvent(date, id) {
        this.firebaseRef.child(date).child(id).remove();
        this.firebaseRef.child(date).once('value', (snap) => {
            if (snap.numChildren() === 0) {
                this.handleDropEvents();
            }
        })
    },

    renderDates() {
        return (
            <section className="container">
                <ListDates
                    dates={ this.state.dates }
                    onClick={ this.getEvents } />
            </section>
        );
    },

    renderEvents() {
        if (this.state.events.length === 0) {
            return null;
        }

        return (
            <section>
                <SectionHeader
                    hasButton={ true }
                    headerText="Events on …"
                    onClose={ this.handleDropEvents } />
                <ListEvents
                    events={ this.state.events }
                    onRemove={ this.onRemoveEvent } />
            </section>
        );
    },

    renderComing() {
        if (this.state.coming.length === 0 || this.state.showComing === false) {
            return null;
        }

        return (
            <section>
                <SectionHeader
                    hasButton={ false }
                    headerText="Coming Events" />
                <ListEvents
                    events={ this.state.coming }
                    onRemove={ this.onRemoveEvent } />
            </section>
        );
    },

    renderCreate() {
        if (this.state.showCreate === false) {
            return null;
        }

        return (
            <section className="create-event">
                <CreateEvent
                    isToggled={ this.state.showCreate }
                    isValidDate={ this.state.isValidDate }
                    isValidName={ this.state.isValidName }
                    onReset={ this.onFormReset }
                    onSubmit={ this.onFormSubmit }
                    onUpdate={ this.handleStateUpdate } />
            </section>
        );
    },

    render() {
        return (
            <div className="wrapper">
                { this.renderCreate() }
                <main className="page">
                    <Navigation className="navbar" onUpdate={ this.handleStateUpdate } />
                    { this.renderDates() }
                    { this.renderEvents() }
                    { this.renderComing() }
                </main>
            </div>
        );
    }

});

export default App;
