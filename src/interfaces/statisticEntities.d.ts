export interface IBankInfo {
  bankId: string;
  bik: string;
  value: number;
}

export interface IAllBankInfo {
  bankId: string;
  bik: string;
  acceptedAmountSum: number;
  acceptedRequests: number;
  requestsByBank: number;
}

interface IFNSStatistic {
  totalProcessed: number;
  aaaCount: number;
  aaCount: number;
  acount: number;
  bcount: number;
  ccount: number;
  dcount: number;
}

export interface IGeneralStatistic {
  approvedAmountSum: number;
  approvedAmountSumAvg: number;
  approvedOrDeclinedRequests: number;
  approvedRequestsPercent: number;
  bankApprovedRequests: number;
  bankDeclinedRequests: number;
  callers: number;
  createdRegulatorRequests: number;
  processedRequests: number;
  canceledRequests: number;
  regulatorApprovedRequests: number;
  requestedAmountSum: number;
  requestedAmountSumAvg: number;
  requests: number;
  top5AcceptedAmountSum: Array<IBankInfo>;
  top5BankByApprovedRequestsPercent: Array<IBankInfo>;
  fnsStatistics: IFNSStatistic;
  sourceBankRequests: number;
  sourceOperatorRequests: number;
  requestsByBank: Array<IBankInfo>;
  allByBank: Array<IAllBankInfo>;
}

// export interface IBankStatistic {
//   allRequests: number;
//   approvedOrDeclinedRequests: number;
//   approvedRequestsPercent: number;
//   bik: string;
//   requestedAmountSum: number;
//   uniqueRequests: number;
// }

export interface IBankStatistic {
  approvedAmountSum: number;
  approvedAmountSumAvg: number;
  approvedOrDeclinedRequests: number;
  approvedRequestsPercent: number;
  bankApprovedRequests: number;
  bankDeclinedRequests: number;
  callers: number;
  canceledRequests: number;
  createdRegulatorRequests: number;
  regulatorApprovedRequests: number;
  fnsStatistics: IFNSStatistic;
  requestedAmountSum: number;
  requestedAmountSumAvg: number;
  requests: number;
  sourceBankRequests: number;
  sourceOperatorRequests: number;
}

export interface IFNSStatistic {
  allRequests: number;
  approvedOrDeclinedRequests: number;
  approvedRequestsPercent: number;
  bik: string;
  requestedAmountSum: number;
  uniqueRequests: number;
}
