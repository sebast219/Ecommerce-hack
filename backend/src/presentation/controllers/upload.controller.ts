// 🏗️ PRESENTATION CONTROLLERS - Upload
// PROPÓSITO: Manejar endpoints para upload de imágenes

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from '../../infrastructure/services/upload.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  /**
   * Upload single product image
   */
  @Post('product-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Only image files are allowed'), false);
          return;
        }

        const maxSizeMB = 10;
        if (file.size > maxSizeMB * 1024 * 1024) {
          callback(
            new BadRequestException(
              `Image size must not exceed ${maxSizeMB}MB`,
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a product image (Admin only)' })
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const result = await this.uploadService.uploadImage(
        file.buffer,
        file.originalname,
        'products',
      );

      return {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          fileName: result.fileName,
          size: result.size,
          format: result.format,
        },
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Upload failed: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Upload multiple product images
   */
  @Post('product-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Only image files are allowed'), false);
          return;
        }

        const maxSizeMB = 10;
        if (file.size > maxSizeMB * 1024 * 1024) {
          callback(
            new BadRequestException(
              `Image size must not exceed ${maxSizeMB}MB`,
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple product images (Admin only)' })
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      const results = await this.uploadService.uploadMultipleImages(
        files.map((f) => f.buffer),
        files.map((f) => f.originalname),
        'products',
      );

      return {
        success: true,
        data: results.map((result) => ({
          url: result.url,
          publicId: result.publicId,
          fileName: result.fileName,
          size: result.size,
          format: result.format,
        })),
        message: `${results.length} images uploaded successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        `Upload failed: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete product image
   */
  @Post('delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product image (Admin only)' })
  async deleteImage(body: { publicId: string }) {
    try {
      if (!body.publicId) {
        throw new BadRequestException('publicId is required');
      }

      await this.uploadService.deleteImage(body.publicId);

      return {
        success: true,
        message: 'Image deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Delete failed: ${error.message || 'Unknown error'}`,
      );
    }
  }
}
