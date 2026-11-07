/**
 * CameraService - Unified Centralized Camera Service for PEK Science Quest
 *
 * Implements strict constraints, permission checks, secure context diagnostics,
 * device enumeration, fallback negotiation, frame capturing, and QR decoding.
 */

import jsQR from 'jsqr';

export interface CameraEnvironmentDiagnostic {
  protocol: string;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  permissionState: 'granted' | 'denied' | 'prompt' | 'unknown' | 'unsupported';
  isSafeForCamera: boolean;
  warningMessage?: string;
}

export interface CameraTestResult {
  passed: boolean;
  deviceLabel?: string;
  deviceId?: string;
  width?: number;
  height?: number;
  trackState?: string;
  facingMode?: string;
  errorType?: string;
  errorMessage?: string;
}

export interface CameraFrameData {
  dataUrl: string;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
}

export type SpecificCameraErrorType =
  | 'NotAllowedError'
  | 'NotFoundError'
  | 'NotReadableError'
  | 'OverconstrainedError'
  | 'SecurityError'
  | 'AbortError'
  | 'TypeError'
  | 'InsecureContextError'
  | 'UnknownError';

export interface FormattedCameraError {
  type: SpecificCameraErrorType;
  rawName: string;
  title: string;
  message: string;
  suggestedAction: string;
}

class CameraService {
  private activeStream: MediaStream | null = null;
  private currentFacingMode: 'environment' | 'user' = 'environment';
  private currentDeviceId: string | null = null;
  private barcodeDetectorInstance: any = null;
  private isBarcodeDetectorChecked: boolean = false;

  constructor() {
    this.initBarcodeDetector();
  }

  /**
   * Khởi tạo BarcodeDetector nếu trình duyệt hỗ trợ native
   */
  private initBarcodeDetector() {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const BD = (window as any).BarcodeDetector;
        this.barcodeDetectorInstance = new BD({ formats: ['qr_code'] });
        this.isBarcodeDetectorChecked = true;
      } catch {
        this.barcodeDetectorInstance = null;
        this.isBarcodeDetectorChecked = true;
      }
    } else {
      this.isBarcodeDetectorChecked = true;
    }
  }

  /**
   * 1. Kiểm tra môi trường (Secure Context, HTTPS, MediaDevices API)
   */
  public checkEnvironment(): CameraEnvironmentDiagnostic {
    if (typeof window === 'undefined') {
      return {
        protocol: 'ssr',
        isSecureContext: false,
        hasMediaDevices: false,
        hasGetUserMedia: false,
        permissionState: 'unknown',
        isSafeForCamera: false,
        warningMessage: 'Môi trường SSR không hỗ trợ camera.',
      };
    }

    const protocol = window.location.protocol;
    const isSecure = window.isSecureContext ?? (protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const hasMediaDevices = !!(navigator.mediaDevices);
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    let isSafe = isSecure && hasMediaDevices && hasGetUserMedia;
    let warningMessage: string | undefined;

    if (!isSecure) {
      warningMessage = 'Camera yêu cầu môi trường HTTPS hoặc localhost.';
    } else if (!hasGetUserMedia) {
      warningMessage = 'Trình duyệt hiện tại không hỗ trợ navigator.mediaDevices.getUserMedia.';
    }

    return {
      protocol,
      isSecureContext: isSecure,
      hasMediaDevices,
      hasGetUserMedia,
      permissionState: 'unknown',
      isSafeForCamera: isSafe,
      warningMessage,
    };
  }

  /**
   * 2. Kiểm tra quyền truy cập camera (Permissions API)
   */
  public async checkCameraPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unknown' | 'unsupported'> {
    if (typeof navigator === 'undefined' || !navigator.permissions || !navigator.permissions.query) {
      return 'unsupported';
    }

    try {
      // @ts-ignore
      const status = await navigator.permissions.query({ name: 'camera' });
      return status.state as 'granted' | 'denied' | 'prompt';
    } catch {
      return 'unknown';
    }
  }

  /**
   * 3. Liệt kê danh sách camera vật lý khả dụng
   */
  public async getAvailableVideoDevices(): Promise<MediaDeviceInfo[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((d) => d.kind === 'videoinput');
    } catch {
      return [];
    }
  }

  /**
   * 4. Bắt đầu Camera với cơ chế fallback tự động:
   * Bước 1: Thử camera với facingMode mong muốn (environment / user)
   * Bước 2 (Fallback): Thử constraints tối giản { video: true, audio: false }
   */
  public async startCamera(options?: {
    facingMode?: 'environment' | 'user';
    deviceId?: string;
  }): Promise<MediaStream> {
    const env = this.checkEnvironment();
    if (!env.isSafeForCamera) {
      const err = new Error(env.warningMessage || 'Môi trường không an toàn để mở camera.');
      err.name = 'InsecureContextError';
      throw err;
    }

    // Luôn dừng stream cũ trước khi xin stream mới
    this.stopCamera();

    const targetFacing = options?.facingMode || this.currentFacingMode || 'environment';
    const targetDeviceId = options?.deviceId || this.currentDeviceId;

    let stream: MediaStream | null = null;
    let primaryError: any = null;

    // CỐ GẮNG LẦN 1: Thử với ideal parameters (không dùng exact để tránh OverconstrainedError)
    try {
      const firstConstraints: MediaStreamConstraints = {
        audio: false,
        video: targetDeviceId
          ? { deviceId: { ideal: targetDeviceId } }
          : { facingMode: { ideal: targetFacing } },
      };

      stream = await navigator.mediaDevices.getUserMedia(firstConstraints);
    } catch (err: any) {
      primaryError = err;
      console.warn('Camera primary constraints failed, trying minimal fallback...', err);
    }

    // CỐ GẮNG LẦN 2 (FALLBACK): Constraints tối giản hoàn toàn { video: true, audio: false }
    if (!stream) {
      try {
        const fallbackConstraints: MediaStreamConstraints = {
          audio: false,
          video: true,
        };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      } catch (fallbackErr: any) {
        // Ném lỗi chi tiết đã được format
        throw this.formatError(fallbackErr || primaryError);
      }
    }

    this.activeStream = stream;
    this.currentFacingMode = targetFacing;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
      if (settings.deviceId) {
        this.currentDeviceId = settings.deviceId;
      }
    }

    return stream;
  }

  /**
   * 5. Gắn stream vào video element và chờ video sẵn sàng
   */
  public async attachToVideoElement(
    videoElement: HTMLVideoElement,
    stream: MediaStream
  ): Promise<boolean> {
    if (!videoElement || !stream) return false;

    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.muted = true;

    try {
      await videoElement.play();
    } catch (playErr) {
      console.warn('video.play() warning:', playErr);
    }

    // Chờ video load dữ liệu khung hình (readyState >= 2 và videoWidth > 0)
    return new Promise((resolve) => {
      if (videoElement.readyState >= 2 && videoElement.videoWidth > 0) {
        resolve(true);
        return;
      }

      let timeoutId: any;
      const onLoadedData = () => {
        clearTimeout(timeoutId);
        videoElement.removeEventListener('loadeddata', onLoadedData);
        videoElement.removeEventListener('canplay', onLoadedData);
        resolve(videoElement.videoWidth > 0);
      };

      videoElement.addEventListener('loadeddata', onLoadedData);
      videoElement.addEventListener('canplay', onLoadedData);

      // Chờ tối đa 3 giây
      timeoutId = setTimeout(() => {
        videoElement.removeEventListener('loadeddata', onLoadedData);
        videoElement.removeEventListener('canplay', onLoadedData);
        resolve(videoElement.readyState >= 2 && videoElement.videoWidth > 0);
      }, 3000);
    });
  }

  /**
   * 6. Kiểm tra xem Video và Stream có thực sự READY không
   */
  public isCameraReady(videoElement: HTMLVideoElement | null): boolean {
    if (!this.activeStream || !videoElement) return false;

    const videoTracks = this.activeStream.getVideoTracks();
    const hasLiveTrack = videoTracks.some((t) => t.readyState === 'live' && t.enabled);

    const hasVideoData =
      videoElement.readyState >= 2 &&
      videoElement.videoWidth > 0 &&
      videoElement.videoHeight > 0 &&
      !videoElement.paused;

    return hasLiveTrack && hasVideoData;
  }

  /**
   * 7. Dừng toàn bộ camera và giải phóng tài nguyên
   */
  public stopCamera(): void {
    if (this.activeStream) {
      try {
        this.activeStream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {
            // Ignored
          }
        });
      } catch {
        // Ignored
      }
      this.activeStream = null;
    }
  }

  /**
   * 8. Khởi động lại Camera
   */
  public async restartCamera(): Promise<MediaStream> {
    this.stopCamera();
    return this.startCamera({ facingMode: this.currentFacingMode });
  }

  /**
   * 9. Đổi Camera (Trước / Sau hoặc qua enumerateDevices)
   */
  public async switchCamera(): Promise<MediaStream> {
    const devices = await this.getAvailableVideoDevices();

    if (devices.length > 1 && this.currentDeviceId) {
      // Tìm camera kế tiếp trong danh sách
      const currentIdx = devices.findIndex((d) => d.deviceId === this.currentDeviceId);
      const nextIdx = (currentIdx + 1) % devices.length;
      const nextDevice = devices[nextIdx];
      this.currentDeviceId = nextDevice.deviceId;
      return this.startCamera({ deviceId: nextDevice.deviceId });
    }

    // Fallback đổi facingMode
    const nextFacing = this.currentFacingMode === 'environment' ? 'user' : 'environment';
    return this.startCamera({ facingMode: nextFacing });
  }

  /**
   * 10. Chụp một khung hình từ video element
   * Dữ liệu chỉ dùng tạm thời để đọc QR hoặc nhận diện Vision, sau đó tự động giải phóng.
   */
  public captureFrame(videoElement: HTMLVideoElement): CameraFrameData | null {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return null;
    }

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(videoElement, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    return {
      dataUrl,
      width,
      height,
      canvas,
    };
  }

  /**
   * 11. Quét mã QR từ video element hoặc canvas
   * Sử dụng Native BarcodeDetector nếu có, fallback sang jsQR
   */
  public async scanQRCode(videoElement: HTMLVideoElement): Promise<{ data: string } | null> {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return null;
    }

    // Cách 1: Native BarcodeDetector (siêu nhanh)
    if (this.barcodeDetectorInstance) {
      try {
        const barcodes = await this.barcodeDetectorInstance.detect(videoElement);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          return { data: barcodes[0].rawValue.trim() };
        }
      } catch {
        // Fallback sang jsQR nếu BarcodeDetector gặp lỗi
      }
    }

    // Cách 2: jsQR fallback với canvas tạm
    try {
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      ctx.drawImage(videoElement, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);

      // @ts-ignore
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        return { data: code.data.trim() };
      }
    } catch {
      // Ignored
    }

    return null;
  }

  /**
   * 12. Chạy bài Test Camera toàn diện (dành cho nút test & Game Master diagnostics)
   */
  public async runCameraDiagnosticTest(testVideoElement?: HTMLVideoElement): Promise<CameraTestResult> {
    this.stopCamera();

    try {
      const stream = await this.startCamera();
      const videoTrack = stream.getVideoTracks()[0];

      if (!videoTrack) {
        return {
          passed: false,
          errorType: 'NotFoundError',
          errorMessage: 'MediaStream không chứa video track nào.',
        };
      }

      const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
      let width = settings.width || 0;
      let height = settings.height || 0;

      if (testVideoElement) {
        await this.attachToVideoElement(testVideoElement, stream);
        width = testVideoElement.videoWidth || width;
        height = testVideoElement.videoHeight || height;
      }

      return {
        passed: true,
        deviceLabel: videoTrack.label || 'Camera Thiết Bị',
        deviceId: settings.deviceId,
        width,
        height,
        trackState: videoTrack.readyState,
        facingMode: settings.facingMode || this.currentFacingMode,
      };
    } catch (err: any) {
      const formatted = this.formatError(err);
      return {
        passed: false,
        errorType: formatted.type,
        errorMessage: formatted.message,
      };
    }
  }

  public getCurrentStream(): MediaStream | null {
    return this.activeStream;
  }

  public getCurrentFacingMode(): 'environment' | 'user' {
    return this.currentFacingMode;
  }

  /**
   * Format lỗi camera chi tiết và gợi ý khắc phục chuẩn xác
   */
  public formatError(err: any): FormattedCameraError {
    const rawName = err?.name || '';
    const rawMsg = err?.message || String(err);

    switch (rawName) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return {
          type: 'NotAllowedError',
          rawName,
          title: 'Quyền Camera Bị Chặn',
          message: 'Website chưa được cấp quyền camera hoặc bạn đã từ chối quyền truy cập.',
          suggestedAction: 'Bấm biểu tượng ổ khóa hoặc camera trên thanh địa chỉ trình duyệt, chọn "Cho phép (Allow)" quyền Camera, sau đó bấm Thử lại.',
        };

      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return {
          type: 'NotFoundError',
          rawName,
          title: 'Không Tìm Thấy Camera',
          message: 'Hệ thống không tìm thấy thiết bị camera khả dụng trên máy.',
          suggestedAction: 'Vui lòng kiểm tra cáp cắm webcam hoặc bật công tắc camera vật lý trên máy.',
        };

      case 'NotReadableError':
      case 'TrackStartError':
        return {
          type: 'NotReadableError',
          rawName,
          title: 'Camera Đang Bận Hoặc Bị Khóa',
          message: 'Camera có thể đang được ứng dụng khác (Zoom, Teams, Meet, ứng dụng Camera...) sử dụng.',
          suggestedAction: 'Hãy đóng các ứng dụng hoặc tab trình duyệt khác đang mở camera rồi bấm "Thử Lại Camera".',
        };

      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError':
        return {
          type: 'OverconstrainedError',
          rawName,
          title: 'Cấu Hình Camera Không Thỏa Mãn',
          message: 'Yêu cầu độ phân giải hoặc góc quay camera quá cụ thể.',
          suggestedAction: 'Hệ thống sẽ tự động kích hoạt chế độ cấu hình dự phòng mặc định.',
        };

      case 'SecurityError':
      case 'InsecureContextError':
        return {
          type: 'SecurityError',
          rawName,
          title: 'Môi Trường Không An Toàn',
          message: 'Camera yêu cầu môi trường HTTPS bảo mật hoặc localhost.',
          suggestedAction: 'Vui lòng truy cập qua đường dẫn HTTPS an toàn để cấp quyền camera.',
        };

      case 'AbortError':
        return {
          type: 'AbortError',
          rawName,
          title: 'Khởi Động Bị Hủy',
          message: 'Yêu cầu truy cập camera bị gián đoạn do thao tác chuyển đổi.',
          suggestedAction: 'Vui lòng bấm "Thử Lại Camera".',
        };

      case 'TypeError':
        return {
          type: 'TypeError',
          rawName,
          title: 'API Camera Không Khả Dụng',
          message: 'Trình duyệt hoặc môi trường iframe hiện tại chưa hỗ trợ API camera này.',
          suggestedAction: 'Vui lòng sử dụng trình duyệt Chrome, Edge, Safari hoặc Firefox phiên bản mới nhất.',
        };

      default:
        return {
          type: 'UnknownError',
          rawName: rawName || 'Error',
          title: 'Không Thể Mở Camera',
          message: rawMsg || 'Đã xảy ra sự cố khi kết nối camera.',
          suggestedAction: 'Vui lòng tải lại trang hoặc kiểm tra quyền riêng tư của hệ điều hành.',
        };
    }
  }
}

export const cameraService = new CameraService();
