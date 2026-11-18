import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export interface UploadedStorageResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

export function validateMediaFile(file: File, acceptedCategory: 'image' | 'video' | 'any' = 'any'): void {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isPdf = file.type === 'application/pdf';

  if (acceptedCategory === 'image' && !isImage) {
    throw new Error('Please choose a valid image file (PNG, JPG, WebP, GIF, or SVG).');
  }
  if (acceptedCategory === 'video' && !isVideo) {
    throw new Error('Please choose a valid video file (MP4, WebM, or MOV).');
  }
  if (acceptedCategory === 'any' && !isImage && !isVideo && !isPdf) {
    throw new Error('Unsupported file type. Upload an image, video, or PDF.');
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(
      `File "${file.name}" exceeds the ${isVideo ? '100MB' : '15MB'} upload limit.`
    );
  }
}

export async function uploadMediaFile(
  file: File,
  folder: string,
  options?: {
    acceptedCategory?: 'image' | 'video' | 'any';
    onProgress?: (percent: number) => void;
  }
): Promise<UploadedStorageResult> {
  validateMediaFile(file, options?.acceptedCategory || 'any');

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `public/${safeFolder}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise<UploadedStorageResult>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0 && options?.onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          options.onProgress(pct);
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(
          new Error(
            error.message ||
              'Failed to upload file to Firebase Storage. Verify permissions and connection.'
          )
        );
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            storagePath,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            fileSize: file.size,
          });
        } catch (err) {
          reject(
            err instanceof Error
              ? err
              : new Error('Upload finished, but retrieving the Firebase Storage download URL failed.')
          );
        }
      }
    );
  });
}

export async function deleteStorageObject(storagePath?: string): Promise<void> {
  if (!storagePath || !storagePath.startsWith('public/')) return;
  try {
    const targetRef = ref(storage, storagePath);
    await deleteObject(targetRef);
  } catch (err) {
    // Non-blocking if object was already deleted or externally hosted
    console.warn('Could not remove previous storage object:', storagePath, err);
  }
}
