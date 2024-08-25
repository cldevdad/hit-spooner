/**
 * Interface representing a qualification requirement for a HIT.
 */
export interface IQualification {
  /**
   * The unique identifier for the qualification type.
   */
  qualification_type_id: string;

  /**
   * The comparator used to evaluate the qualification.
   */
  comparator: QualificationComparator;

  /**
   * The action that triggers the qualification check (e.g., "AcceptHit").
   */
  worker_action: string;

  /**
   * The qualification values required to meet the qualification.
   */
  qualification_values: string[];

  /**
   * Indicates whether the caller meets the qualification requirement.
   */
  caller_meets_requirement: boolean;

  /**
   * Detailed information about the qualification type.
   */
  qualification_type: IQualificationType;

  /**
   * The qualification value of the caller (if applicable).
   */
  caller_qualification_value?: IQualificationValue;

  /**
   * The URL to request the qualification.
   */
  qualification_request_url: string;
}

/**
 * Type representing the qualification comparator options.
 */
export type QualificationComparator =
  | "GreaterThanOrEqualTo"
  | "LessThanOrEqualTo"
  | "EqualTo";

/**
 * Interface representing detailed information about a qualification type.
 */
export interface IQualificationType {
  /**
   * The unique identifier for the qualification type.
   */
  qualification_type_id: string;

  /**
   * The name of the qualification.
   */
  name: string;

  /**
   * Indicates whether the qualification is visible.
   */
  visibility: boolean;

  /**
   * Description of the qualification.
   */
  description: string;

  /**
   * Indicates whether a test is required to obtain the qualification.
   */
  has_test: boolean;

  /**
   * Indicates whether the qualification can be requested.
   */
  is_requestable: boolean;

  /**
   * Keywords associated with the qualification.
   */
  keywords: string;
}

/**
 * Interface representing the qualification value of the caller.
 */
export interface IQualificationValue {
  /**
   * The integer value of the qualification.
   */
  integer_value: number;

  /**
   * The locale value of the qualification.
   */
  locale_value?: ILocaleValue;
}

/**
 * Interface representing the locale value for a qualification.
 */
export interface ILocaleValue {
  /**
   * The country associated with the locale (if applicable).
   */
  country?: string | null;

  /**
   * The subdivision (e.g., state or province) associated with the locale (if applicable).
   */
  subdivision?: string | null;
}
