import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { LoggerService } from 'src/app/services/logger.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './login.service';
import { setToken } from 'src/app/model/user';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public c = "";
  public username: string = '';
  public password: string = '';
  public captcha_val: string = '';
  public encryptedUsername: any;
  public encryptedPassword: any;
  public rmCheck: any;
  error1 = false;
  error2 = false;
  error = false;

  public loader = 'none';
  public main_opc = 1;


  notavailable = false;
  credentials = [] as any;

  public w = "";
  public v1 = "";
  public v2 = "";
  public v3 = "";
  public v4 = "";
  public v5 = "";
  public v6 = "";
  public v7 = "";

  public attempts = 5;
  public lock = "NO";

  public flag1 = 0;
  public flag2 = 0;
  public flag3 = 0;

  public passStatus: any = 'visibility';
  public showtooltip: any = 'Show Password'

  show: boolean = false;

  constructor(public dialog: MatDialog, private router: Router, private connection: LoginService, private logger: LoggerService) { }

  ngOnInit(): void {

    this.w = this.captcha();
    this.rmCheck = false;

    if (localStorage.checkbox) {
      this.username = localStorage.username;
      this.rmCheck = localStorage.checkbox;
    }
    setTimeout(() => {
      this.logger.info(this.username, "Login Screen Has Opened");
    },
      100);
  }

  public captcha() {

    var temp_array = new Uint8Array(1)

    this.v1 = Math.floor(Number(crypto.getRandomValues(temp_array)) % 10).toString();

    this.v2 = Math.floor(Number(crypto.getRandomValues(temp_array)) % 10).toString();

    this.v6 = String.fromCharCode(Number(crypto.getRandomValues(temp_array)) % 26 + 65);

    this.v3 = Math.floor(Number(crypto.getRandomValues(temp_array)) % 10).toString();

    this.v4 = Math.floor(Number(crypto.getRandomValues(temp_array)) % 10).toString();

    this.v5 = String.fromCharCode(Number(crypto.getRandomValues(temp_array)) % 26 + 65);

    this.v7 = String.fromCharCode(Number(crypto.getRandomValues(temp_array)) % 26 + 65);

    var val = this.v1 + this.v2 + this.v6 + this.v3 + this.v4 + this.v5 + this.v7;

    return val;

  }

  public refresh_captcha() {
    var newcap = this.captcha()
    this.w = newcap
    this.captcha_val = ""
  }


  showpassword() {
    this.show = !this.show;
    if (this.show) { this.passStatus = 'visibility_off'; this.showtooltip = 'Hide Password' }
    else { this.passStatus = 'visibility'; this.showtooltip = 'Show Password' }
  }

  public f_pw() {
    Swal.fire({
      text: 'Please contact the Administrator for resetting your password',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok',
    });
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.onLogin();

    }
  }
  public info_pop() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        closeButton: 'swal-cross',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      html: '\
      <div id="carouselExampleControls" class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="carousel-item active"> <img class="d-block w-100" src=".\\assets\\img\\popup_acou.png" alt="AcousticsSetup" style="width:950px;height: 500px;" alt="First slide"> </div> <div class="carousel-item"> <img class="d-block " src=".\\assets\\wavplot\\acc.png" alt="AcousticsSetup" style="width:900px;height: 500px; margin-left: 85px; " alt="Second slide"> </div>  </div> <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" style="filter: invert(1);"aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"> <span class="carousel-control-next-icon" style="filter: invert(1);" aria-hidden="true"></span> <span style="filter: invert(1)" class="sr-only">Next</span> </a></div>\
        ',

      showClass: {
        popup: 'animated fadeIn',
        icon: 'animated heartBeat delay-1s',
      },
      hideClass: {
        popup: 'animated fadeOut',
      },
      confirmButtonColor: '#3085d6',
      showCloseButton: true,
      showConfirmButton: false,
      width: 1100,
    });
  }


  onLogin() {
    // this.router.navigate(['fatigue']);
    this.loader = 'block';
    this.main_opc = 0.5;
    // this.c="#750244";
    var userid = this.username;
    this.logger.info(this.username, "Log In Attempt");
    if (this.username == '' || this.password == '' || this.username == undefined || this.password == undefined || this.captcha_val == '' || this.captcha_val == undefined) {
      this.loader = 'none';
      this.main_opc = 1;
      this.notavailable = true;
      Swal.fire({
        text: 'Invalid Username or Password or Captcha',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
      });
      this.logger.warn(this.username, "Invalid Username or Password or Captcha");
      this.c = "";
    }
    else if (this.w == this.captcha_val) {

      this.notavailable = false;
      let secret = environment.APP_SECRET
      let salt = environment.APP_SALT
      let iterations = 128;
      let bytes = CryptoJS.PBKDF2(secret, salt, { keySize: 48, iterations: iterations });
      let iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
      let key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));

      this.encryptedUsername = CryptoJS.AES.encrypt(this.username, key, { iv: iv });
      this.encryptedPassword = CryptoJS.AES.encrypt(this.password, key, { iv: iv });

      this.connection.getLoginVerification(this.encryptedUsername.toString(), this.encryptedPassword.toString()).subscribe(
        (res: any) => {

          this.logger.info(this.username, 'info: ' + res.status);
          if (res.status == 'success') {
            this.logger.info(this.username, "Successfully Logged In");
            if (this.rmCheck) {

              localStorage.username = this.username;
              localStorage.checkbox = this.rmCheck;
            }
            else {
              this.c = "";
              localStorage.clear();
            }
            setToken(res.token);
            this.loader = 'none';
            this.main_opc = 1;
            this.router.navigate(['home']);
          }
          else if (res.status == "lock") {
            this.logger.warn(this.username, "Unable to Log In due to Password Lock");
            this.error = true;
            this.loader = 'none';
            this.main_opc = 1;
            Swal.fire({
              text: '5 Unsuccessful attempts. Profile Locked for ' + this.username + ". Please contact the Administrator for resetting your password",

              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });

          }
          else if (res.status == "Expired") {
            this.logger.warn(this.username, "Unable to Log In as Password is Expired");
            this.error = true;
            this.loader = 'none';
            this.main_opc = 1;
            Swal.fire({
              text: 'Password Expired for ' + this.username + " for not Login in Last 30 days. Please contact the Administrator for resetting your password",

              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });

          }

          else {
            console.log(res.status)
            this.logger.warn(this.username, "Unable to Log In due to Wrong Password");
            this.error = true;
            this.loader = 'none';
            this.main_opc = 1;
            Swal.fire({
              text: 'Invalid Username or Password',

              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });


          }

        },
        (er: any) => {
          // this.logger.error(this.username,"Unable to Log In due to API Error. Error: "+JSON.stringify(er));
          var einfo = JSON.stringify(er)
          einfo = einfo.replace(/"/g, "'")
          this.logger.error(this.username, "Unable to Log In due to API Error. Error: " + einfo);
        })


    }

    else {

      this.logger.warn(this.username, "Unable to Log In due to Wrong Password");
      // this.error=true;
      this.loader = 'none';
      this.main_opc = 1;
      Swal.fire({
        text: 'Invalid Username or Password',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
      });
    }

    this.error = false;

  }

  public validate_credentials() {
    var username = (document.getElementById("uid") as HTMLInputElement).value;
    var usererr = (document.getElementById("usererr") as HTMLDivElement);
    var login_btn = (document.getElementById("login_btn") as HTMLInputElement);

    var password = (document.getElementById("pwd") as HTMLInputElement).value;
    var show_user_input_error = (document.getElementById("show_user_input_error") as HTMLDivElement);
    var format = new RegExp(/[~!@#\$;%\^&.\*\-\=]/);
    var captcha = (document.getElementById("value_cap") as HTMLInputElement).value;
    var captcha_correct = this.w;
    var caperr = (document.getElementById("caperr") as HTMLDivElement);

    var login_btn = (document.getElementById("login_btn") as HTMLInputElement);

    if ((/^[A-Za-z]+$/.test(username)) == true || username == '') {
      usererr.style.display = "none";
      if (username != '') {
        this.flag1 = 1;
      }
      else {
        this.flag1 = 0;;
      }
    }
    else {
      usererr.style.display = "block";
      usererr.innerHTML = "*Only English Alphabets allowed\n\n";
      usererr.style.marginBottom = "5px";
      usererr.style.marginTop = "0px";
      this.flag1 = 0;
    }


    if ((/[A-Z]/.test(password)) == true || password == '') {
      if ((/[0-9]/.test(password)) == true || password == '') {
        if (format.test(password) || password == '') {
          if (password.length >= 8 && password.length <= 15 || password == '') {
            show_user_input_error.style.display = "none";
            if (password != '') {
              this.flag2 = 1;
            }
            else {
              this.flag2 = 0;;
            }
          }
          else {
            show_user_input_error.style.display = "block";
            // show_user_input_error.style.marginBottom = "5px"; 
            show_user_input_error.style.marginTop = "0px";
            show_user_input_error.innerHTML = "*Should have 8 - 15 characters";
            this.flag2 = 0;
          }
        }
        else {
          show_user_input_error.style.display = "block";
          // show_user_input_error.style.marginBottom = "5px"; 
          show_user_input_error.style.marginTop = "0px";
          show_user_input_error.innerHTML = "*At least one special character required";
          this.flag2 = 0;

        }
      }
      else {
        show_user_input_error.style.display = "block";
        // show_user_input_error.style.marginBottom = "5px"; 
        show_user_input_error.style.marginTop = "0px";
        show_user_input_error.innerHTML = "*At least one numeric value required";
        this.flag2 = 0;

      }
    }
    else {
      show_user_input_error.style.display = "block";
      // show_user_input_error.style.marginBottom = "5px"; 
      show_user_input_error.style.marginTop = "0px";
      show_user_input_error.innerHTML = "*At least one capital letter required";
      this.flag2 = 0;
    }


    if (captcha == captcha_correct || captcha == '') {
      caperr.style.display = "none";
      if (captcha != '') {
        this.flag3 = 1;
      }
      else {
        this.flag3 = 0;;
      }
    }
    else {
      caperr.style.display = "block";
      caperr.innerHTML = "*Captcha Not Correct";
      // caperr.style.marginBottom = "5px"; 
      // caperr.style.marginTop = "-5px"; 
      this.flag3 = 0;
    }

    // console.log("username", username)
    //   console.log("this.flag1==1 && this.flag2==1 && this.flag3==1", this.flag1, this.flag2, this.flag3)

    if (this.flag1 == 1 && this.flag2 == 1 && this.flag3 == 1) {
      // console.log("%%%%%%%% DONE")
      login_btn.disabled = false;
      login_btn.style.backgroundColor = "aliceblue"
      login_btn.style.color = "black"
      login_btn.style.cursor = "pointer"
    }
    else {
      login_btn.disabled = true;
    }

  }

}
