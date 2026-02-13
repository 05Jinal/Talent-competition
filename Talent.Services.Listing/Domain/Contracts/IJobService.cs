using System.Collections.Generic;
using System.Threading.Tasks;
using Talent.Common.Models;
using Talent.Services.Listing.Controllers;

namespace Talent.Services.Listing.Domain.Contracts
{
    public interface IJobService
    {
        string CreateJob(Job jobData);
        void UpdateJob(Job jobData);
        Task<Job> GetJobByIDAsync(string id);
        Task<Job> GetJobForTalentMatching(string id, string recruiterId);
        Task<IEnumerable<Job>> GetEmployerJobsAsync(string employerId);
        Task UpdateJobStatusAsync(string jobId, JobStatus status);
        Task CreateUpdateJob(JobData job);
        Task CreateUpdateJob(Job job);
    }

    public class JobData
    {
    }
}
