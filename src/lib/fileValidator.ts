// src/lib/fileValidator.ts

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates the file extension, MIME type, and size constraints.
 * @param file The browser File object
 * @param allowedExtensions List of allowed extensions (lowercase, without dots)
 * @param allowedMimes List of allowed MIME types
 * @param maxSizeMb Maximum allowed size in Megabytes (defaults to 100MB)
 */
export function validateFileConstraints(
  file: File,
  allowedExtensions: string[],
  allowedMimes: string[],
  maxSizeMb: number = 100
): FileValidationResult {
  // 1. File Size Verification
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${maxSizeMb}MB.`,
    };
  }

  // 2. File Extension Verification
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file format. Allowed: ${allowedExtensions.map(e => `.${e}`).join(', ')}`,
    };
  }

  // 3. MIME Type Verification (as a fallback, since some OS fail to populate file.type)
  if (allowedMimes.length > 0 && file.type) {
    const isMimeMatch = allowedMimes.some(mime => {
      if (mime.endsWith('/*')) {
        const prefix = mime.split('/')[0];
        return file.type.startsWith(`${prefix}/`);
      }
      return file.type === mime;
    });

    if (!isMimeMatch) {
      return {
        valid: false,
        error: `Invalid file MIME type: ${file.type}.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Async check of magic header bytes to verify if the file content matches its extension.
 * This is crucial to detect masqueraded executable files (e.g. malware.exe renamed to document.pdf).
 * @param file The browser File object
 * @param expectedType Expected type: 'pdf' | 'png' | 'jpeg' | 'zip' | 'gif'
 */
export async function verifyFileMagicBytes(
  file: File,
  expectedType: 'pdf' | 'png' | 'jpeg' | 'zip' | 'gif'
): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onloadend = (e) => {
      if (!e.target || !e.target.result) {
        resolve({ valid: false, error: 'Could not parse file header bytes.' });
        return;
      }

      const bytes = new Uint8Array(e.target.result as ArrayBuffer);
      let isValid = false;
      let error = '';

      switch (expectedType) {
        case 'pdf':
          // PDF starts with '%PDF-' -> 25 50 44 46
          isValid = bytes.length >= 4 &&
                    bytes[0] === 0x25 &&
                    bytes[1] === 0x50 &&
                    bytes[2] === 0x44 &&
                    bytes[3] === 0x46;
          error = 'Malformed PDF structure detected. Header signature verification failed.';
          break;
        case 'png':
          // PNG starts with 89 50 4E 47 0D 0A 1A 0A
          isValid = bytes.length >= 4 &&
                    bytes[0] === 0x89 &&
                    bytes[1] === 0x50 &&
                    bytes[2] === 0x4E &&
                    bytes[3] === 0x47;
          error = 'Malformed PNG detected. Image signature verification failed.';
          break;
        case 'jpeg':
          // JPEG starts with FF D8 FF
          isValid = bytes.length >= 3 &&
                    bytes[0] === 0xFF &&
                    bytes[1] === 0xD8 &&
                    bytes[2] === 0xFF;
          error = 'Malformed JPEG detected. Image signature verification failed.';
          break;
        case 'gif':
          // GIF starts with GIF87a or GIF89a -> 47 49 46 38 37/39 61
          isValid = bytes.length >= 4 &&
                    bytes[0] === 0x47 &&
                    bytes[1] === 0x49 &&
                    bytes[2] === 0x46 &&
                    bytes[3] === 0x38;
          error = 'Malformed GIF detected. Image signature verification failed.';
          break;
        case 'zip':
          // ZIP starts with 'PK' -> 50 4B 03 04
          isValid = bytes.length >= 4 &&
                    bytes[0] === 0x50 &&
                    bytes[1] === 0x4B &&
                    bytes[2] === 0x03 &&
                    bytes[3] === 0x04;
          error = 'Malformed ZIP archive detected. Archive signature verification failed.';
          break;
        default:
          isValid = true;
      }

      resolve(isValid ? { valid: true } : { valid: false, error });
    };

    reader.onerror = () => {
      resolve({ valid: false, error: 'File read error during security verification.' });
    };

    // Slice the first 8 bytes for verification
    const blobSlice = file.slice(0, 8);
    reader.readAsArrayBuffer(blobSlice);
  });
}
