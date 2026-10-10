export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  yearOfStudy: string;
  note?: string;
}

export interface RegistrationRecord {
  eventId: string;
  formData: RegistrationFormData;
  registeredAt: string;
}

export interface RegistrationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  yearOfStudy?: string;
}
