import { TRole, TGuaranteeType, TRequestCompanyType } from './apiTypes';
import { RATE } from '../ui/Rate';


export interface IUserMeta {
  position?: string;
  patronymic?: string;
  permitionDocumentName?: string;
}

export interface IUserInfo {
  accountId: string;
  businessRoles: Array<TRole>;
  companyId: string;
  companyName: string;
  displayName: string;
  email: string | null;
  firstName: string;
  lastName: string;
  nodeAlias: string;
  participantAddress: string | null;
  participantPublicKey: string | null;
  personId: string;
  phone: string;
  meta: IUserMeta | null;
}

export interface IAccount {
  accountId: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  password: string | null;
  roles: Array<string>;
  username: string;
}

export interface ICompanyMeta {
  bankName: string;
  logo?: string;
  paymentAccount: string;
  directorLastName: string;
  directorFirstName: string;
  directorPatronymic: string;
  correspondentAccount: string;
  bankIdentificationCode: string;

  bik: string;
  address?: string;
  directorFullName?: {
    lastName: string;
    firstName: string;
    middleName: string;
  };
}

export interface ICompany {
  id: string;
  nodeAlias: string;
  name: string;
  shortName: string;
  type: TRole;
  address: string;
  phone: string;
  email: string;
  okpo?: string;
  ogrn: string;
  inn: string;
  kpp: string;
  meta: ICompanyMeta | null;
}

export interface IBusinessRole {
  name: TRole;
  displayName: string;
  description: string;
}

export interface ICompanyType extends IBusinessRole {};

export interface IProcess {
  id: string; //Идентификатор
  type: PROCESS_TYPE; //Тип
  typeName: string; //Тип
  status: string; //Статус
  created: Date; //Дата создания
  daysLeft: number; //Дата создания
  modified: Date; //Дата изменения
  issuerName: string; //Заемщик
  partnerName: string; //Заимодавец
  processId: string;
  claimId: string;
  loanNumber: string | null; //№ договора займа
  oldCommitmentNumb: string; //№ заменяемого договора
  amount: number; //Сумма
  acceptedAmount: number; // Одобренная сумма
  fee: number; //Комиссия
  effectiveAmount: number; // Остаток
  rate: number; //Процентная ставка
  discountValue: number | null; //Ставка дисконтирования
  specialDiscount: number | null; //Особая ставка дисконтирования
  term: number | null; //Срок (дней)
  maturityDate: Date | null; //Дата погашения
  relevanceDate: Date | null; //Дата планируемой новации
  // TODO:
  // Add explicit type for Transaction status
  lastUnsuccessfulTxStatus?: 'PENDING' | 'SUCCESS' | null;
  lastUnsuccessfulTxId?: string | null;

  number: string;
  bankId: string;
  requestedAmount: number;
  companyName: string;
  companyInn: string;
  // period: number;
  // personalCount: number;
  // declineReasonRegulator: string;
  // declineReasonBank: string;
  // declineReasonBank: string;
  bankInnSearch: string;
  fnsStatus: string;
  regulatorStatus: RATE;
  pending: boolean;
  source: SOURCE_TYPE;
  operatorCompanyName: string;

  limitPayout: number;
  multyPayout: number;
  okato: string;
  decreaseCountRisk: string;
}

export interface IProposalBare {
  relevanceDate: Date | null;
  issuerName: string;
  partnerName: string;
  rateList: Array<IRate>;
  amount?: number;
  discountValue: number | null;
  specialDiscount: number | null;
  specialTerm: number | null;
  specialRate: number | null;
  oldCommitmentNumb: string;
  signature: string;
  rejectionReason?: string;
}

export interface ICallFormData {
  commitmentName: string;
  commitmentLink?: string;
  commitmentDateFrom: Date;
  commitmentDateTo: Date;
  commitmentPrice: number | string;
  guaranteeType: TGuaranteeType;
  amount: number | string;
  dateFrom: Date;
  dateTo: Date;
  guarantorName: string;
  beneficiaryName: string;
  relevanceDate: Date;
  attachments: File[];
  signature?: string;
  penalty: string;
  paymentTerm: string;
  requirementDocumentNames?: string[];
}

export interface ICall {
  id: string;
  type: string;
  documentNumber: string;
  created: Date;
  creatorId: string;
  status: TOfferStatus;
  commitmentName: string;
  commitmentLink: string;
  commitmentDateFrom: Date;
  commitmentDateTo: Date;
  commitmentPrice: number;
  commitmentCurrency: string;
  amount: number;
  currency: string;
  dateFrom: Date;
  dateTo: Date;
  guarantorName: string;
  principalName: string;
  beneficiaryName: string;
  relevanceDate: Date;
  attachments?: File[];
  signature: string;
  modified: Date;
  rejectionReason?: string;
  penalty: string;
  paymentTerm: string;
  requirementDocumentNames?: string[];
}

export interface IGuarantee
  extends Pick<
    ICall,
    | 'commitmentName'
    | 'commitmentLink'
    | 'commitmentDateFrom'
    | 'commitmentDateTo'
    | 'commitmentPrice'
  > {
  id: string;
  created: Date;
  modified: Date;
  creatorId: string;
  status: TGuaranteeStatus;
  documentNumber: string;
  type: string;
  amount: number;
  actualAmount: number;
  currency: string;
  fee: number;
  dateFrom: Date;
  dateTo: Date;
  guarantorName: string;
  principalName: string;
  beneficiaryName: string;
  rejectionReason?: string;
  penalty: string;
  paymentTerm: string;
  requirementDocumentNames?: string[];
}

export interface IClaim {
  id: string;
  status: TProcessStatus;
  creatorId: string;
  guaranteeId: string;
  created: Date;
  amount: number;
  currency: string;
  signature?: string;
  documentNumber?: string;
  rejectionReason?: string;
}

export interface IPaymentRequest {
  [name: string]: any;
}

export interface IProposal extends IProposalBare {
  id: string;
  status: TProcessStatus;
}

export interface IDictRate {
  actual: boolean;
  created: Date;
  rateId: IRate;
  modified: Date;
}

export interface IDelayReason {
  actual: boolean;
  created: Date;
  id: number;
  value: string;
}

export interface IDictDiscountRate {
  actual: boolean;
  created: Date;
  modified: Date;
  value: number;
}

export interface IDictIssuer {
  id: string; //Идентификатор записи
  name: string; //Полное наименование
  shortName: string; //Сокращенное наименование
  address: string; //Юридический адрес
  okpo: string; //ОКПО (общероссийский классификатор предприятий и организаций)
  ogrn: string; //ОГРН (сновной государственный регистрационный номер)
  inn: string; //ИНН (идентификационный номер налогоплательщика)
  kpp: string; //КПП (код причины постановки на учет)
  bankName: string; //Расчетный банк
  bankCode: string; //БИК (банковский идентификационный код)
  paymentAccount: string; //Расчетный счет
  corrAccount: string; //Корреспондентский счет
  phone: string; //Телефон
  email: string; //E-mail (адрес электронной почты)
  directorLastName: string; //Фамилия генерального директора
  directorFirstName: string; //Имя генерального директора
  directorPatronymic: string; //Отчество генерального директора
  created: Date; //Дата создания записи
  modified: Date; //Дата изменения записи
  actual: boolean; //Признак актуальности записи
}

export interface IRate {
  value: number;
  term: number;
  amount: number | string;
  reductionValue: number;
  actual?: boolean;
  modified?: Date;
}

export interface IOperationHistory {
  status: TProcessStatus;
  date: Date;
}

export const enum ENTITY_STATUS {
  IN_ACCEPTING = 'IN_ACCEPTING',
  CANCELED = 'CANCELED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT',
  PRINCIPAL_ACCEPTED = 'PRINCIPAL_ACCEPTED',
  GUARANTOR_ACCEPTED = 'GUARANTOR_ACCEPTED',
}

export type TProcessStatus = ENTITY_STATUS;

export const enum PROCESS_TYPE {
  CALL = 'CALL',
  GUARANTEE = 'GUARANTEE',
  CLAIM = 'CLAIM',
  REQUIREMENT = 'REQUIREMENT',
  REQUEST = 'REQUEST',
}

export const enum SOURCE_TYPE {
  BANK = 'BANK',
  OPERATOR = 'OPERATOR',
}

export type TGuaranteeStatus =
  | 'DRAFT'
  | 'IN_ACCEPTING'
  | 'PRINCIPAL_ACCEPTED'
  | 'GUARANTOR_ACCEPTED'
  | 'CANCELED'
  | 'ACCEPTED'
  | 'REJECTED';

export type TOfferStatus = 'IN_ACCEPTING' | 'REJECTED' | 'ACCEPTED';

export type TRequirementStatus =
  | 'IN_PAYING'
  | 'IN_INQUIRING'
  | 'PRINCIPAL_ACCEPTED'
  | 'PRINCIPAL_REJECTED'
  | 'REJECTED'
  | 'DELAYED'
  | 'PAID';

export type TRequestStatus =
  | 'CREATED'
  | 'REGULATOR_APPROVED'
  | 'BANK_DECLINED'
  | 'CANCELED'
  | 'BANK_APPROVED';

export type TRequestFnsStatus = 'CREATED' | 'PROCESSED' | 'CANCELED';

export type TClaimStatus = 'IN_ACCEPTING' | 'ACCEPTED' | 'REJECTED';

export interface IPaymentGraphData {
  loanOutgoingTotal?: number; // Неисполненные обязательства по займам
  dataLoadDate?: Date; // Дата актуальности данных

  graphItems: Array<IPaymentGraphItem>; //График платежей
  tableItems: Array<IPaymentGraphItem>; //Таблица платежей
}

export interface IPaymentGraphItem {
  month: number; //Месяц
  reductionAmount: number; //сумма действующих Гарантий
  currentAmount: number; //сумма действующих Гарантий
}

export interface IGuaranteeGraph {
  companyName: string;
  currentAmount: number;
  reductionAmount: number;
  guaranteeCount: number;
}

export interface IPayment {
  loanId: string; //Идентификатор займа
  loanMaturityDate: Date; //Дата исполнения обязательств
  claimDate: Date; //Дата требования
  partnerName: string; //Займодавец
  loanNumber: string; //Договор займа
  loanIncomingBalance: number; //Сумма обязательств (₽)
  loanPercentAmount: number; //Проценты по займу (₽)
  loanTotalAmount: number; //Общая сумма (₽)
  claimPaymentOnTimeAmount: number; //Сумма исполненных обязательств (₽) - В срок
  claimPrepaymentAmount: number; //Сумма исполненных обязательств (₽) - Досрочно

  forfeitAmount: number; //Сумма неустойки (₽)
  interestPaidAmount: number; //Выплаченные проценты по требованию в срок
  loanOutgoingBalance: number; //Остаток (₽)
}

export interface ICalculatedData {
  loanId?: string;
  amount?: number;
  increaseRateAmount: number;
  calculatedAmount: number | string;
  rate: number;
  newRate: number;
  rateChanged: boolean;
}
export interface ITransactionEvent {
  status: 'PENDING' | 'SUCCESS' | null;
  txId: string;
  timestamp: Date;
  bosy: string;
}

export interface IRequestFormData {
  companyName: string;
  companyInn: string;
  companyKpp: string;
  companyOgrn: string;
  directorFullName: string;

  bankId: string;
  requestedAmount: number;
  period: number;
  personalCount: number;
  declineReasonRegulator: string;
  declineReasonBank: string;

  limitPayout: number;
  multyPayout: number;
  okato: string;
}

export enum REQUEST_STATUS {
  CREATED = 'CREATED',
  REGULATOR_APPROVED = 'REGULATOR_APPROVED',
  REGULATOR_DECLINED = 'REGULATOR_DECLINED',
  BANK_APPROVED = 'BANK_APPROVED',
  BANK_DECLINED = 'BANK_DECLINED',
  CANCELED = 'CANCELED',
}

export interface IOtherRequest {
  bankId: string;
  bankName: string;
  created: Date | string;
  id: string;
  status: REQUEST_STATUS;
}

export interface IRequest {
  bankId: string;
  bankName: string;
  bik: string;
  companyId: string;
  companyInn: string;
  companyKpp: string;
  companyName: string;
  companyOgrn: string;
  companyType: TRequestCompanyType;
  created: Date | string;
  creatorId: string;
  declineReasonBank: string;
  declineReasonRegulator: string;
  decreaseCountRisk: boolean;
  directorFullName: string;
  directorFirstName: string;
  directorLastName: string;
  directorMiddleName: string;
  id: string;
  modified: Date | string;
  number: string;
  pending: boolean;
  period: number;
  personalCount: number;
  requestedAmount: number;
  status: REQUEST_STATUS;
  otherRequests?: IOtherRequest[];
  regulatorStatus: RATE;
  acceptedAmount: number;
  limitPayout: number;
  multyPayout: number;
  okato: string;
  lastUnsuccessfulTxStatus?: 'PENDING' | 'SUCCESS' | null;
  lastUnsuccessfulTxId?: string | null;
}

export interface CompanyQualification {
  enableHelps: boolean;
  activity: boolean;
  needHelpOkfed: boolean;
  presented: boolean;
  listOkfed: Array<any>;
  moreThanYear: boolean;
  typeCompany: number;
  workPerson: number;
  bankruptcy: boolean;
  bankruptcy12Month: boolean;
}

export type TPersonalCount = {
  byMonth: Record<string, number>;
  startCount: number;
}

export enum CallerType {
  'UNKNOWN',
  'UL',
  'IP',
}
