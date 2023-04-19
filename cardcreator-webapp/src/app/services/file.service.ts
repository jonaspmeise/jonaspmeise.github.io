import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileList: Map<string, string>;

  constructor() {
    this.fileList = new Map<string, string>(); 
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
            const content = reader.result as string;
            this.fileList.set(file.webkitRelativePath, content);
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

  fetchBase64(fileName: string): string | undefined {
    return this.fileList.get(fileName);
  }
}