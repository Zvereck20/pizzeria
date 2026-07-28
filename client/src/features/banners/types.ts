export interface Banner {
  _id: string;
  name: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface UpdateBannerRequest {
  id: string;
  body: FormData;
}

export interface DeleteBannerResponse {
  message: string;
}
