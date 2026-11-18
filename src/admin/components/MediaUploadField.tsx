import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Film } from 'lucide-react';
import { uploadMediaFile, deleteStorageObject } from '../../firebase/storage';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';

interface MediaUploadFieldProps {
  label: string;
  value: string;
  storagePath?: string;
  folder: string;
  acceptedCategory?: 'image' | 'video' | 'any';
  placeholder?: string;
  disabled?: boolean;
  onChange: (url: string, newStoragePath?: string) => void;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  value,
  storagePath,
  folder,
  acceptedCategory = 'image',
  placeholder = 'https://...',
  disabled = false,
  onChange,
}) => {
  const { addMediaItem, showToast } = usePortfolio();
  const { user, canWrite, hasPermission } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState(false);

  const canUpload =
    !disabled && canWrite && (hasPermission('manage_media') || hasPermission('manage_portfolio') || hasPermission('manage_videos') || hasPermission('manage_services') || hasPermission('manage_case_studies') || hasPermission('manage_testimonials'));

  const acceptAttr =
    acceptedCategory === 'image'
      ? 'image/*'
      : acceptedCategory === 'video'
      ? 'video/*'
      : 'image/*,video/*,application/pdf';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);
    setJustUploaded(false);
    setProgress(0);
    setIsUploading(true);

    const previousStoragePath = storagePath;

    try {
      const uploaded = await uploadMediaFile(file, folder, {
        acceptedCategory,
        onProgress: (pct) => setProgress(pct),
      });

      // Register permanent download URL & metadata in Firestore Media Library
      await addMediaItem({
        fileName: uploaded.fileName,
        fileUrl: uploaded.downloadUrl,
        storagePath: uploaded.storagePath,
        fileType: uploaded.fileType,
        fileSize: uploaded.fileSize,
        uploadedBy: user?.email || 'admin',
      });

      onChange(uploaded.downloadUrl, uploaded.storagePath);
      setJustUploaded(true);

      // Delete old Storage file ONLY AFTER replacement uploaded and registered successfully
      if (previousStoragePath && previousStoragePath !== uploaded.storagePath) {
        await deleteStorageObject(previousStoragePath);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setUploadError(msg);
      showToast(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInputChange = (nextUrl: string) => {
    setUploadError(null);
    setJustUploaded(false);
    if (nextUrl.startsWith('blob:') || nextUrl.startsWith('data:')) {
      setUploadError('Temporary local blob/data preview URLs cannot be saved permanently. Please upload the file.');
      return;
    }
    onChange(nextUrl, nextUrl === value ? storagePath : undefined);
  };

  const isVideoValue =
    acceptedCategory === 'video' ||
    /\.(mp4|webm|mov)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-slate-300">{label}</label>
        {justUploaded && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Uploaded to Firebase Storage
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          disabled={disabled || isUploading}
          onChange={(e) => handleUrlInputChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500 disabled:opacity-60"
        />

        {canUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{progress}%</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload {acceptedCategory === 'video' ? 'Video' : 'File'}</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {isUploading && (
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#10B981] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {value && !uploadError && (
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800/80">
          {isVideoValue ? (
            <div className="w-14 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Film className="w-4 h-4" />
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-14 h-10 rounded-lg object-cover border border-slate-800 bg-slate-950 shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
              <ImageIcon className="w-3 h-3 text-emerald-400" />
              <span>{storagePath ? 'Stored in Firebase Storage' : 'External / Static URL'}</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
};
