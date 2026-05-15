// 🏗️ INFRASTRUCTURE SERVICES - Upload Service
// PROPÓSITO: Manejar uploads de archivos a servicios externos (Cloudinary, AWS S3, etc)

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';

export interface UploadResponse {
  url: string;
  publicId: string;
  fileName: string;
  size: number;
  format: string;
}

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Configurar Cloudinary si están disponibles las credenciales
    const cloudinaryName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const cloudinaryKey = this.configService.get('CLOUDINARY_API_KEY');
    const cloudinarySecret = this.configService.get('CLOUDINARY_API_SECRET');

    if (cloudinaryName && cloudinaryKey && cloudinarySecret) {
      cloudinary.v2.config({
        cloud_name: cloudinaryName,
        api_key: cloudinaryKey,
        api_secret: cloudinarySecret,
      });
    }
  }

  /**
   * Subir una imagen a Cloudinary
   * @param file - Buffer del archivo
   * @param fileName - Nombre del archivo
   * @param folder - Carpeta en Cloudinary (ej: "products")
   */
  async uploadImage(
    file: Buffer,
    fileName: string,
    folder: string = 'products',
  ): Promise<UploadResponse> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            filename_override: fileName,
          },
          (error, result) => {
            if (error) {
              reject(new Error(`Upload failed: ${error.message}`));
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                fileName: result.original_filename,
                size: result.bytes,
                format: result.format,
              });
            }
          },
        );

        uploadStream.end(file);
      });
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Subir múltiples imágenes
   */
  async uploadMultipleImages(
    files: Buffer[],
    fileNames: string[],
    folder: string = 'products',
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, fileNames[index], folder),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Eliminar una imagen de Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Transformar URL de Cloudinary (redimensionar, cambiar calidad, etc)
   */
  getTransformedUrl(
    url: string,
    width?: number,
    height?: number,
    quality?: number,
  ): string {
    if (!url.includes('cloudinary')) {
      return url;
    }

    let transformedUrl = url;

    if (width || height || quality) {
      const transforms = [];

      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      if (width || height) transforms.push('c_fill');
      if (quality) transforms.push(`q_${quality}`);

      const transform = transforms.join(',');
      transformedUrl = url.replace('/upload/', `/upload/${transform}/`);
    }

    return transformedUrl;
  }
}
