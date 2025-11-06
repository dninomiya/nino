import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// R2クライアントの初期化
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

/**
 * DataURLからBase64データとMIMEタイプを抽出
 */
function parseDataUrl(dataUrl: string): {
  data: Buffer;
  mimeType: string;
  extension: string;
} {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid data URL format");
  }

  const mimeType = matches[1] || "image/jpeg";
  const base64Data = matches[2] || "";
  const data = Buffer.from(base64Data, "base64");

  // MIMEタイプから拡張子を決定
  let extension = "jpg";
  if (mimeType.includes("png")) {
    extension = "png";
  } else if (mimeType.includes("webp")) {
    extension = "webp";
  } else if (mimeType.includes("gif")) {
    extension = "gif";
  }

  return { data, mimeType, extension };
}

/**
 * 画像をR2にアップロード
 * @param dataUrl - Base64エンコードされたData URL
 * @param path - アップロード先のパス（例: "avatars/user123/image.jpg"）
 * @returns 公開URL
 */
export async function uploadImage(
  dataUrl: string,
  path: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME environment variable is not set");
  }

  const { data, mimeType } = parseDataUrl(dataUrl);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: data,
    ContentType: mimeType,
  });

  await r2Client.send(command);

  // 公開URLを返す
  const publicUrl = PUBLIC_URL
    ? `${PUBLIC_URL}/${path}`
    : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${path}`;

  return publicUrl;
}

/**
 * R2から画像を削除
 * @param path - 削除する画像のパス
 */
export async function deleteImage(path: string): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME environment variable is not set");
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await r2Client.send(command);
}

/**
 * R2の画像を更新（古い画像を削除して新しい画像をアップロード）
 * @param dataUrl - Base64エンコードされたData URL
 * @param oldPath - 古い画像のパス（削除する）
 * @param newPath - 新しい画像のパス（アップロードする）
 * @returns 公開URL
 */
export async function updateImage(
  dataUrl: string,
  oldPath: string,
  newPath: string
): Promise<string> {
  // 古い画像を削除（エラーが発生しても続行）
  try {
    await deleteImage(oldPath);
  } catch (error) {
    console.error(`Failed to delete old image at ${oldPath}:`, error);
  }

  // 新しい画像をアップロード
  return uploadImage(dataUrl, newPath);
}

/**
 * R2のパスから公開URLを生成
 * @param path - R2内のパス
 * @returns 公開URL
 */
export function getPublicUrl(path: string): string {
  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${path}`;
  }
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${path}`;
}
