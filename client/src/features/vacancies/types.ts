export interface Vacancy {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface VacancyRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export interface UpdateVacancyRequest {
  id: string;
  body: Partial<VacancyRequest>;
}

export interface DeleteVacancyResponse {
  message: string;
}
