import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { JobCategories } from './JobCategories.jsx';
import { Salary } from './Salary.jsx';
import { Location } from './Location.jsx';

export class JobDetailsCard extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.updateJob = this.updateJob.bind(this);
    }

    handleChange(event) {
        // Clone jobDetails from parent state
        const data = { ...this.props.jobDetails };
        const { name, id, type, checked, value } = event.target;

        if (type === "checkbox") {
            const subData = data[id] || [];
            if (checked) {
                if (!subData.includes(name)) subData.push(name);
            } else {
                const index = subData.indexOf(name);
                if (index !== -1) subData.splice(index, 1);
            }
            data[id] = subData;
        } else {
            data[name] = value;
        }

        // Update parent state
        this.props.updateStateData({ target: { name: "jobDetails", value: data } });
    }

    handleChangeDate(date, name) {
        if (name === 'expiryDate') {
            this.props.updateStateData({ target: { name: "expiryDate", value: date } });
        } else {
            const data = { ...this.props.jobDetails };
            data[name] = date;
            this.props.updateStateData({ target: { name: "jobDetails", value: data } });
        }
    }

    updateJob() {
        // Optional: Validate before saving
        const jd = this.props.jobDetails;
        if (!jd.categories.category || !jd.jobType.length || !jd.location.country || !jd.location.city) {
            alert("Please fill all required fields: Category, Job Type, and Location.");
            return;
        }

         {
            if (typeof this.props.createJob === 'function') {
                this.props.createJob();
            } else {
                console.error("createJob prop missing!", this.props);
            }
        }
    }

    render() {
        const { jobDetails } = this.props;
        const { jobType } = jobDetails;

        // Default expiry date 14 days ahead
        //const expiryDate = this.props.expiryDate instanceof moment
        //    ? this.props.expiryDate
        //    : moment().add(14, 'days');
        const expiryDate =
            jobDetails.expiryDate instanceof Date && !isNaN(jobDetails.expiryDate)
                ? jobDetails.expiryDate
                : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        return (
            <div className="ui segment">
                <div className="content">
                    <div className="header">Job Details</div>
                </div>

                <div className="content">
                    <div className="ui form">
                        <div className="ui small feed">

                            {/* Category */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Category:
                                        <JobCategories
                                            categories={jobDetails.categories}
                                            handleChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Job Type */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Job Type: <br />
                                        <div className="ui form">
                                            <div className="ui multi checkbox grouped fields">
                                                {["fullTime", "partTime", "contract"].map(type => (
                                                    <div className="ui checkbox field" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            name={type}
                                                            id="jobType"
                                                            onChange={this.handleChange}
                                                            checked={jobType.includes(type)}
                                                        />
                                                        <label>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Start Date:
                                        <br />
                                        {/*<DatePicker*/}
                                        {/*    selected={jobDetails.startDate}*/}
                                        {/*    onChange={date => this.handleChangeDate(date, "startDate")}*/}
                                        {/*    minDate={new Date()}*/}
                                        {/*/>*/}
                                        <DatePicker
                                            selected={
                                                jobDetails.startDate instanceof Date && !isNaN(jobDetails.startDate)
                                                    ? jobDetails.startDate
                                                    : null
                                            }
                                            onChange={date => this.handleChangeDate(date, "startDate")}
                                            minDate={new Date()}
                                        />
                                    </div>
                                    <div className="summary">
                                        End Date:
                                        <br />
                                        {/*<DatePicker*/}
                                        {/*    selected={jobDetails.endDate}*/}
                                        {/*    onChange={date => this.handleChangeDate(date, "endDate")}*/}
                                        {/*    minDate={new Date()}*/}
                                        {/*/>*/}<DatePicker
                                            selected={
                                                jobDetails.endDate instanceof Date && !isNaN(jobDetails.endDate)
                                                    ? jobDetails.endDate
                                                    : null
                                            }
                                            onChange={date => this.handleChangeDate(date, "endDate")}
                                            minDate={new Date()}
                                        />
                                    </div>
                                    <div className="summary">
                                        *Expiry Date:
                                        <br />
                                        {/*<DatePicker*/}
                                        {/*    selected={expiryDate}*/}
                                        {/*    onChange={date => this.handleChangeDate(date, "expiryDate")}*/}
                                        {/*    minDate={new Date()}*/}
                                        {/*/>*/}
                                        <DatePicker
                                            selected={expiryDate}
                                            onChange={date => this.handleChangeDate(date, "expiryDate")}
                                            minDate={new Date()}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        Salary Per Annum:
                                        <br />
                                        <Salary
                                            salary={jobDetails.salary}
                                            handleChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Location:
                                        <Location
                                            location={jobDetails.location}
                                            handleChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        <button
                                            type="button"
                                            className="fluid ui teal button"
                                            onClick={this.updateJob}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
