export enum ConstsUser {
  PASSWORD_MIN_CHAR = 4,
}

export enum UserRole {
  NONE = 'none',
  OWNER = 'owner',
  EMPLOYEE = 'employee',
  SUPERADMIN = 'superadmin',
}

export enum UserType {
  VISITOR = 'visitor',
  RESTAURANT_USER = 'restaurent-user',
  ADMIN = 'admin',
}

export enum CurrentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OBSOLETE = 'obsolete',
  EXPERIMENTAL = 'experimental',
  WAITING = 'waiting',
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  UNAUTHORIZED = 401,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  INTERNAL_SERVER = 500,
}

export enum TourType {
  YURTDISI = 'yurtdisi',
  YURTICI = 'yurtici',
  GUNUBIRLIK = 'gunubirlik',
}
export enum PublishStatus {
  PUBLISH = 'publish',
  DRAFT = 'draft',
  UNPUBLISH = 'unpublish',
}

export enum Currency {
  TRY = 'try',
  USD = 'usd',
  EUR = 'eur',
}

export enum ServiceType {
  INCLUDED = 'included',
  INHERIT = 'inherit',
  EXCLUDED = 'excluded',
}

export enum Country {
  TURKEY = 'Türkiye',
}

export enum Language {
  TR = 'turkish',
  EN = 'english',
}

export enum StaticPageType {
  PageAboutUs = 'page-about-us',
  PageSecretPolicy = 'page-secret-policy',
  PageUsagePolicy = 'page-usage-policy',
  PageInformationSecurityPolicy = 'page-information-security-policy',
  PageKVKKPolicy = 'page-kvkk-policy',
  PageCookiePolicy = 'page-cookie-policy',
  PageMembershipAgreementPolicy = 'page-membership-agreement-policy',
  PageHumanResources = 'page-human-resources',
  PageTourPacketAgreement = 'tour-packet-agreement',
}

export enum EmailTemplateEnum {
  USER_WELCOME = 'USER_WELCOME',
  ADMIN_NEW_USER = 'ADMIN_NEW_USER',
  USER_TOUR_REGISTRATION = 'USER_TOUR_REGISTRATION',
  ADMIN_TOUR_NOTIFICATION = 'ADMIN_TOUR_NOTIFICATION',
  USER_CONTACT_FORM_RECEIVED = 'USER_CONTACT_FORM_RECEIVED',
  USER_CONTACT_FORM_ANSWERED = 'USER_CONTACT_FORM_ANSWERED',
  ADMIN_CONTACT_NOTIFICATION = 'ADMIN_CONTACT_NOTIFICATION',
}
