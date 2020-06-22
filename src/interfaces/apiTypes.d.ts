export type TRole =
  | 'PRINCIPAL'
  | 'BENEFICIARY'
  | 'GUARANTOR'
  | 'ADMINISTRATOR'
  | 'REGULATOR'
  | 'BANK'
  | 'CALLER'
  | 'CORRECTOR'
  | 'OBSERVER';

export type TAccountRole =
  | 'WE_IDENTITY_READ'
  | 'WE_IDENTITY_WRITE'
  | 'WE_OAUTH2_READ'
  | 'WE_OAUTH2_WRITE';

export type TProcessType =
  | 'CALL' //Заявка
  | 'GUARANTEE' //Гарантия
  | 'CLAIM' // Заявка на снижение суммы
  | 'REQUIREMENT' // Требование на погашение суммы
  | 'REQUEST'; // Заяление

// export type TCompanyType = 'PRINCIPAL' | 'BENEFICIARY' | 'GUARANTOR' | 'REGULATOR' | 'BANK';

export type TRequestCompanyType = 'LEGAL_ENTITY' | 'INDIVIDUAL_ENTREPRENEUR';

export type TGuaranteeType = 'USUAL';
