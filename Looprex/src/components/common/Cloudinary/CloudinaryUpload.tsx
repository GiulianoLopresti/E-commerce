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
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    // Verificar variables de entorno
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Error de configuración: Variables de entorno no encontradas');
      console.error('Cloudinary config:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
      });
      return;
    }

    setError('');
    setUploading(true);

    // Mostrar preview inmediato
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Preparar FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      console.log('Subiendo a Cloudinary:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      // Log de respuesta para debugging
      console.log('Respuesta status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de Cloudinary:', errorData);
        throw new Error(errorData.error?.message || 'Error al subir imagen');
      }

      const data = await response.json();
      console.log('Imagen subida exitosamente:', data.secure_url);
      
      onImageUploaded(data.secure_url);
      
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(`Error al subir imagen: ${err.message}`);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded('');
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
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveImage();
              }}
              className={styles.removeButton}
              title="Eliminar imagen"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
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
      
      {/* Ayuda de configuración */}
      {!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET ? (
        <div className={styles.error}>
          <i className="fa-solid fa-gear"></i>
          <strong>Configuración requerida:</strong>
          <br />
          Crea un archivo <code>.env</code> con:
          <br />
          <code>VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name</code>
          <br />
          <code>VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset</code>
        </div>
      ) : null}
    </div>
  );
};