export interface Manifest {
  fileName: string;
  fileSize: number;
  chunkCount: number;
  chunks: { index: number; md5: string }[];
}
