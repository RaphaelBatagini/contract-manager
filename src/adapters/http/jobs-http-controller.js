const listUnpaidJobsFactory = require("../../application/use-cases/list-unpaid-jobs/factory");
const payJobFactory = require("../../application/use-cases/pay-job/factory");
const JobNotFoundError = require("../../application/errors/job-not-found-error");
const UserCannotAccessJobError = require("../../application/errors/user-cannot-access-job-error");
const JobAlreadyPaidError = require("../../application/errors/job-already-paid-error");
const InsufficientFundsError = require("../../application/errors/insufficient-funds-error");
const httpStatus = require("http-status");

class JobsHttpController {
  async listUnpaid(request, response) {
    const { profile } = request;

    const listUnpaidJobs = listUnpaidJobsFactory();

    try {
      const jobs = await listUnpaidJobs.execute(profile.id);
      return response.json(jobs);
    } catch (error) {
      return response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .end("internal server error");
    }
  }

  async pay(request, response) {
    const { profile } = request;
    const { id } = request.params;

    const payJob = payJobFactory();

    try {
      const job = await payJob.execute(id, profile.id);
      return response.json(job);
    } catch (error) {
      if (error instanceof JobNotFoundError) {
        return response.status(httpStatus.NOT_FOUND).end(error.message);
      }

      if (error instanceof UserCannotAccessJobError) {
        return response.status(httpStatus.FORBIDDEN).end(error.message);
      }

      if (error instanceof JobAlreadyPaidError) {
        return response.status(httpStatus.BAD_REQUEST).end(error.message);
      }

      if (error instanceof InsufficientFundsError) {
        return response.status(httpStatus.BAD_REQUEST).end(error.message);
      }

      return response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .end("internal server error");
    }
  }
}

module.exports = JobsHttpController;
