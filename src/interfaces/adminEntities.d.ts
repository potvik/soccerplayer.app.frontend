import { TCompanyType } from './apiTypes';

export interface IAdminCompanyMeta {
  bankName?: string;
  paymentAccount: string;
  correspondentAccount: string;
  bankIdentificationCode: string;

  directorInfo: {
    inn: string;
    fullName: {
      lastName: string;
      firstName: string;
      middleName: string;
    };
  };
}

export interface IAdminCompany {
  id?: string;
  nodeAlias?: string;

  name: string;
  shortName: string;
  type: TCompanyType;
  address: string;
  phone: string;
  email: string;
  okpo: string;
  ogrn: string;
  inn: string;
  kpp: string;

  meta: IAdminCompanyMeta | null;
}

export interface IAdminUser {
  account: {
    username: string;
    password: string;
  };
  person: {
    firstName: string;
    lastName: string;
    meta: {
      permitionDocumentName: string;
      position: string;
      patronymic: string;
    };
  };
}
