import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileList: Map<string, Blob>;

  constructor() {
    this.fileList = new Map<string, Blob>(); 
  }

  upload(files: File[] | FileList): Promise<File[]> {
    const promises: Promise<File>[] = [];

    console.log(files);

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];

      promises.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], { type: file.type });

            this.fileList.set(file.webkitRelativePath, blob);
            resolve(file);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        })
      );
    }

    return Promise.all(promises);
  }

  fetchBlob(fileName: string): Blob | undefined {
    return this.fileList.get(fileName);
  }
}