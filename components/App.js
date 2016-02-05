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
            allDates: [],
            displayDates: [],
            upcomingDates: [],
            isValidDate: false,
            isValidName: false
        };
    },

    componentWillMount() {
        this.firebaseRef = new Firebase('https://eventsafe.firebaseio.com/dates');
        this.firebaseRef.orderByChild('date').on('value', this.handleAllDates);

        // let key = moment().format('MMDD');
        // this.firebaseRef.orderByKey().startAt(key).limitToFirst(5)
        //     .on('value', this.handleUpcomingDates);
    },

    handleAllDates(snapshot) {
        let allDates = [];
        snapshot.forEach((item) => {
            if (allDates.indexOf(item.val().date) === -1) {
                allDates.push(item.val().date);
            }
        });
        this.setState({ allDates });
    },

    handleUpcomingDates(snapshot) {
        // let upcomingDates = [];
        // snapshot.forEach((date) => {
        //     date.forEach((child) => {
        //         let obj = child.val();
        //         obj.key = date.key();
        //         obj.uid = child.key();
        //         upcomingDates.push(obj);
        //     });
        // });
        // this.setState({ upcomingDates });
    },

    handleDateClick(date) {
        let displayDates = [];
        this.firebaseRef.orderByChild('date').equalTo(date).on('value', (snapshot) => {
            snapshot.forEach((date) => {
                let obj = date.val();
                obj.key = date.key();
                displayDates.push(obj);
            });
            this.setState({ displayDates });
        });
    },

    handleInputName(value) {
        let isValidName = value !== '' && value.trim() !== '';
        this.setState({ isValidName });
    },

    handleInputDate(value) {
        let isValidDate = value.length === 8 && moment(value, 'YYYYMMDD').isValid();
        this.setState({ isValidDate });
    },

    handleReset() {
        this.setState({
            isValidDate: false,
            isValidName: false
        });
    },

    handleSubmit(data) {
        return this.firebaseRef.push(data);
    },

    render() {
        console.log(this.state.displayDates);
        return (
            <main>
                <section>
                    <h5>My Dates</h5>
                    <ListDates
                        dates={ this.state.allDates }
                        onClick={ this.handleDateClick } />
                </section>
                <section>
                    <h5>Upcoming Events</h5>
                    <ListEvents events={ this.state.upcomingDates } />
                </section>
                <section>
                    <h5>Add Events</h5>
                    <CreateEvent
                        isValidDate={ this.state.isValidDate }
                        isValidName={ this.state.isValidName }
                        onInputDate={ this.handleInputDate }
                        onInputName={ this.handleInputName }
                        onReset={ this.handleReset }
                        onSubmit={ this.handleSubmit }/>
                </section>
            </main>
        );
    }

});

export default App;
