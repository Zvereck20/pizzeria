import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

interface AdminImageUploadProps {
  currentImage?: string;
  currentImageAlt?: string;
  error?: boolean;
  helperText?: string;
  onImageChange: (file: File | null) => void;
}

export const AdminImageUpload: FC<AdminImageUploadProps> = ({
  currentImage,
  currentImageAlt = "Current image",
  error,
  helperText,
  onImageChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState<string | null>(
    null,
  );

  const imagePreviewUrl = selectedFilePreviewUrl || currentImage;

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFilePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setSelectedFilePreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    onImageChange(file);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    onImageChange(null);
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      {imagePreviewUrl && (
        <Box
          component="img"
          src={imagePreviewUrl}
          alt={selectedFile?.name ?? currentImageAlt}
          sx={{
            width: 150,
            height: 150,
            objectFit: "cover",
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
          }}
        />
      )}

      <Stack spacing={1} alignItems="flex-start">
        <Button component="label" variant="outlined">
          Upload image
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        {selectedFile && (
          <>
            <Typography variant="body2">{selectedFile.name}</Typography>
            <Button type="button" size="small" onClick={handleClearImage}>
              Clear selected image
            </Button>
          </>
        )}
        {helperText && (
          <Typography color={error ? "error" : "text.secondary"} variant="body2">
            {helperText}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
