import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageService } from '../../../core/services/image/image.service';
import { CameraSource } from '@capacitor/camera';
import { CollectionEnum } from '../../../core/enum/collections.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  cameraSource = CameraSource;
  loggedInUser: User;
  isLoading: boolean;
  subscriptions: Array<Subscription>;
  profilePicture: string;
  isLoadingPicture: boolean;
  pictureHasChanged: boolean;

  constructor(public modalController: ModalController,
              private imageService: ImageService,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.isLoadingPicture = true;
    this.pictureHasChanged = true;
    this.subscriptions = [
      this.authService.loggedInUser$.subscribe((user) => {
        this.loggedInUser = user;
        if (user.profilePicture && this.pictureHasChanged) {
          this.imageService.getImageFromStorage(user.profilePicture).then(profilePicture => {
            this.profilePicture = profilePicture;
            this.isLoadingPicture = false;
            this.pictureHasChanged = false;
          });
        } else if (!user.profilePicture) {
          this.profilePicture = '';
          this.isLoadingPicture = false;
          this.pictureHasChanged = false;
        }
        this.isLoading = false;
      })
    ]
  }

  async getPicture(source: CameraSource) {
    this.pictureHasChanged = true;
    this.isLoadingPicture = true;
    let photoData = await this.imageService.saveImageToStorage(await this.imageService.getPicture(source),
      `${ CollectionEnum.users }/${this.loggedInUser.id}`);
    await this.userService.update(this.loggedInUser.id, { profilePicture: photoData.ref.fullPath });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
