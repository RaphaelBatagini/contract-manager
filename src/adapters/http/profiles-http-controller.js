const depositAmountIntoBalanceFactory = require("../../application/use-cases/deposit-amount-into-balance/factory");
const ClientNotFoundError = require("../../application/errors/client-not-found-error");
const DepositAmountExceedsLimitError = require("../../application/errors/deposit-amount-exceeds-limit-error");
const httpStatus = require("http-status");
const bestProfessionFactory = require("../../application/use-cases/best-profession/factory");
const NoJobFoundInPeriodError = require("../../application/errors/no-job-found-in-period-error");

class ProfilesHttpController {
  async deposit(request, response) {
    const { profile } = request;
    const { userId: clientId } = request.params;
    const { depositAmount } = request.body;

    const depositAmountIntoBalance = depositAmountIntoBalanceFactory();

    try {
      const jobs = await depositAmountIntoBalance.execute(
        profile.id,
        clientId,
        depositAmount
      );
      return response.json(jobs);
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        return response.status(httpStatus.NOT_FOUND).end(error.message);
      }

      if (error instanceof DepositAmountExceedsLimitError) {
        return response
          .status(httpStatus.BAD_REQUEST)
          .end(error.message);
      }

      return response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .end("internal server error");
    }
  }

  async bestProfession(request, response) {
    const { start, end } = request.query;

    const bestProfession = bestProfessionFactory();

    try {
      const profession = await bestProfession.execute(start, end);
      return response.json({ profession });
    } catch (error) {
      if (error instanceof NoJobFoundInPeriodError) {
        return response.status(httpStatus.NOT_FOUND).end(error.message);
      }

      return response.status(500).end("internal server error");
    }
  }
}

module.exports = ProfilesHttpController;
