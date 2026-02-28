import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    render() {
        
            const { job } = this.props; // expecting a job object as prop
            if (!job) return null;

            return (
                <div className="job-summary-card" style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '12px' }}>
                    <h3>{job.title}</h3>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Posted:</strong> {moment(job.postedDate).fromNow()}</p>

                    <Popup
                        content="Click to close this job"
                        trigger={
                            <Button color="red" onClick={() => this.selectJob(job.id)}>
                                Close Job
                            </Button>
                        }
                    />
                </div>
            );
        }
    }
    
}