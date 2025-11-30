import { useState } from 'react';
import styles from './CloudinaryUpload.module.css';

interface CloudinaryUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const CloudinaryUpload = ({ onImageUploaded, currentImageUrl }: CloudinaryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState('');

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setError('');
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      onImageUploaded(data.secure_url);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError('Error al subir imagen. Intenta nuevamente.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <label htmlFor="imageInput" className={styles.uploadLabel}>
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <div className={styles.changeOverlay}>
              <i className="fa-solid fa-camera"></i>
              <span>Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className={styles.uploadPlaceholder}>
            <i className="fa-solid fa-cloud-upload-alt"></i>
            <p>Haz clic para subir imagen</p>
            <small>JPG, PNG, GIF (máx. 5MB)</small>
          </div>
        )}
      </label>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className={styles.fileInput}
      />

      {uploading && (
        <div className={styles.uploading}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <span>Subiendo imagen...</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <i className="fa-solid fa-exclamation-triangle"></i>
          {error}
        </div>
      )}
    </div>
  );
};