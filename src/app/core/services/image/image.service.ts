import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/storage';
import { CollectionEnum } from '../../enum/collections.enum';
import { storage } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private platform: Platform,
              private angularFireStorage: AngularFireStorage) {
  }

  async getPicture(source: CameraSource) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source,
      quality: 40,
      allowEditing: true
    });
    return capturedPhoto.dataUrl;
  }

  saveImageToStorage(fileData: string, folderName: CollectionEnum | string): Promise<storage.UploadTaskSnapshot> {
    return fetch(fileData).then((res) => res.blob().then((fileBlob) => {
        const randomId = Math.random().toString(36).substring(2, 8);
        return this.angularFireStorage.upload(`${folderName}/${new Date().getTime()}_${randomId}`, fileBlob);
      }));
  }

  async getImageFromStorage(imagePath: string) {
    return this.angularFireStorage.ref(imagePath).getDownloadURL().toPromise();
  }
}
