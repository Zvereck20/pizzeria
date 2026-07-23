import type { Banner } from "@/features/banners";

export interface BannerFormValues extends Pick<Banner, "name" | "link" | "isActive"> {}

interface BuildBannerFormDataParams {
  values: BannerFormValues;
  image: File | null;
}

export const buildBannerFormData = ({ values, image }: BuildBannerFormDataParams) => {
  const body = new FormData();

  body.append("name", values.name);
  body.append("link", values.link);
  body.append("isActive", String(values.isActive));

  if (image) {
    body.append("image", image);
  }

  return body;
};
