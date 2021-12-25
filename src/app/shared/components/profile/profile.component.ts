import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageService } from '../../../core/services/image/image.service';
import { CameraSource } from '@capacitor/camera';
import { CollectionEnum } from '../../../core/enum/collections.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { Subscription } from 'rxjs';
import { FirestoreUser, User } from '../../../core/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  registerForm: FormGroup;
  validationMessages = {
    firstName: [
      { type: 'required', message: 'נדרש להזין שם פרטי' }
    ],
    lastName: [
      { type: 'required', message: 'נדרש להזין שם משפחה' }
    ],
    phoneNumber: [
      { type: 'required', message: 'נדרש להזין מספר טלפון' },
      { type: 'pattern', message: 'הזינו מספר טלפון תקין' }
    ],
    birthDate: [
      { type: 'required', message: 'נדרש להזין תאריך לידה' }
    ]
  };

  constructor(public modalController: ModalController,
              private imageService: ImageService,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.isLoadingPicture = true;
    this.registerForm = new FormGroup({
      firstName: new FormControl(undefined, [
        Validators.required
      ]),
      lastName: new FormControl(undefined, [
        Validators.required
      ]),
      phoneNumber: new FormControl(undefined, [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^05\d{8}$/),
        Validators.required
      ]),
      email: new FormControl(undefined, [
        Validators.required,
        Validators.email
      ]),
      birthDate: new FormControl(undefined, [
        Validators.required
      ])
    });
    this.subscriptions = [
      this.authService.loggedInUser$.subscribe((user) => {
        this.loggedInUser = user;
        this.firstName.setValue(user.firstName);
        this.lastName.setValue(user.lastName);
        this.birthDate.setValue(user.birthDate);
        this.phoneNumber.setValue(user.phoneNumber);
        this.email.setValue(user.email);
        if (user.profilePicture && this.isLoadingPicture) {
          this.imageService.getImageFromStorage(user.profilePicture).then(profilePicture => {
            this.profilePicture = profilePicture;
            this.isLoadingPicture = false;
          });
        } else if (!user.profilePicture) {
          this.profilePicture = '';
          this.isLoadingPicture = false;
        }
        this.isLoading = false;
      })
    ]
  }

  async getPicture(source: CameraSource) {
    this.imageService.getPicture(source).then(async (dataUrl) => {
      this.isLoadingPicture = true;
      let photoData = await this.imageService.saveImageToStorage(dataUrl,
        `${ CollectionEnum.users }/${ this.loggedInUser.id }`);
      await this.userService.update(this.loggedInUser.id, { profilePicture: photoData.ref.fullPath });
    })
  }

  async updateUser() {
    const { firstName, lastName, phoneNumber, email, birthDate } = this.registerForm.value;
    const userNewData: Partial<FirestoreUser> = {
      firstName,
      lastName,
      phoneNumber,
      email,
      birthDate
    };
    await this.userService.update(this.loggedInUser.id, userNewData);
    this.modalController.dismiss();
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get birthDate() {
    return this.registerForm.get('birthDate');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
