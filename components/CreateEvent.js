import React, { PropTypes } from 'react';
import serialize from 'form-serialize';
import moment from 'moment';
import purebem from 'purebem';


const block = purebem.of('create-event');

const CreateEvent = React.createClass({

    propTypes: {
        isValidDate: PropTypes.bool.isRequired,
        isValidName: PropTypes.bool.isRequired,
        onInputDate: PropTypes.func.isRequired,
        onInputName: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    },

    handleSubmit(evt) {
        evt.preventDefault();
        let data = serialize(this.EventForm, { hash: true });
        data.timestamp = moment(data.date, 'YYYYMMDD').unix();
        data.date = moment(data.date).format('MMDD');

        this.props.onSubmit(data)
            .then(() => {
                this.EventForm.reset();
                this.EventDate.focus();
                this.props.onReset();
            });
    },

    handleInputDate(evt) {
        this.props.onInputDate(evt.target.value);
    },

    handleInputName(evt) {
        this.props.onInputName(evt.target.value);
    },

    render() {
        let { isValidDate, isValidName } = this.props;
        return (
            <form name="EventForm" className={ block() } onSubmit={ this.handleSubmit } ref={ (ref) => this.EventForm = ref }>
                <div className={ block('input-group') }>
                    <label>Date</label>
                    <input type="number" name="date" autoComplete="off" placeholder="YYYYMMDD" onInput={ this.handleInputDate } ref={ (ref) => this.EventDate = ref }/>
                </div>
                <div className={ block('input-group') }>
                    <label>Name</label>
                    <input type="text" name="name" placeholder="John Doe" onInput={ this.handleInputName } ref={ (ref) => this.EventName = ref }/>
                </div>
                <div className={ block('input-group') }>
                    <label>Type</label>
                    <select name="type">
                        <option>Birthday</option>
                        <option>Conference</option>
                        <option>Anniversary</option>
                        <option>Shitty day…</option>
                    </select>
                </div>
                <div className={ block('buttons') }>
                    <button type="submit" className="button-primary" disabled={ !isValidDate || !isValidName }>Save Event</button>
                </div>
            </form>
        );
    }
});

export default CreateEvent;
