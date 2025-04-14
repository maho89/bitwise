import {ref} from "vue";

export default {
  install(app) {
    let user = ref();
    app.provide('$user', user);
    app.config.globalProperties.$user = user;
    let http = app.config.globalProperties.$http;
    http.get('User/Init').then(res => {
       user.value = res;
    }).catch(err => {
      user.value = false;
    })
  }
};
