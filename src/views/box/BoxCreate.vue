<template>
  <div class="page-container">
    <v-app class="app-background">
      <v-container fluid>
        <div>
          <h1 class="rubikMonoOne">BOX CREATE</h1>
        </div><br><br>
        <v-row justify="center">
          <v-col cols="12" sm="4" md="6">
            <v-card>
              <v-card-title class="text-h5 text-center">
                BOX CREATION
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="boxCreate" ref="form" lazy-validation>
                  <v-text-field label="BOX NAME" :rules="name_rule" v-model="name" placeholder="박스 이름을 입력해주세요." prepend-icon="mdi-home"
                    required></v-text-field>

                  <v-text-field label="BOX ADDRESS" v-model="address" placeholder="박스의 주소를 입력해주세요."
                    prepend-icon="mdi-map-marker" required></v-text-field>

                  <v-file-input label="BOX LOGO" :rules="logoPath_rule" accept="image/*" @change="fileUpdate" required></v-file-input>

                  <v-textarea label="TIME" v-model="operatingHours" placeholder="박스 이용시간을 입력해주세요." rows="2"
                    prepend-icon="mdi-clock-outline"></v-textarea>

                  <v-textarea label="PRICE" v-model="fee" placeholder="₩ 가격을 입력해주세요." rows="2"
                    prepend-icon="mdi-currency-krw"></v-textarea>

                  <v-textarea label="INTRODUCTION" v-model="intro" placeholder="박스를 소개하는 문구를 적어주세요." rows="4"
                    prepend-icon="mdi-pencil-outline"></v-textarea>

                  <v-card-actions>
                    <v-row justify="center" class="w-100">
                      <v-col cols="4" class="d-flex justify-center">
                        <v-btn type="submit" class="hover-btn mx-auto" style="width: 100%;">CREATE</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="400px">
          <v-card>
            <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
              <v-btn class="hover-btn" text @click="dialog = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-app>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  data() {
    return {
      name: '',
      address: '',
      operatingHours: '',
      fee: '',
      intro: '',
      logoPath: null,
      dialog: false,
      dialogTitle: '',
      dialogText: '',
      name_rule: [
        v => !!v || '박스 이름을 입력해주세요.',
      ],
      logoPath_rule: [
        v => !!v || '박스 로고를 선택해주세요.',
      ],
    };
  },
  methods: {
    fileUpdate(event) {
      this.logoPath = event.target.files[0];
    },
    async boxCreate() {
      const form = this.$refs.form;
      if (form) {
        try {
          if (!this.name) {
            this.dialogTitle = 'box name is none';
            this.dialogText = 'BOX 이름을 입력해주세요.';
            this.dialog = true;
            return;
          }

          if (!this.logoPath) {
            this.dialogTitle = 'box logo is none';
            this.dialogText = 'BOX 로고를 선택해주세요.';
            this.dialog = true;
            return;
          }

          let registerData = new FormData();
          registerData.append("name", this.name);
          registerData.append("address", this.address);
          registerData.append("operatingHours", this.operatingHours);
          registerData.append("fee", this.fee);
          registerData.append("intro", this.intro);
          registerData.append("logoPath", this.logoPath);

          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/box/create`, registerData);
          this.$router.push('/box/success');
        } catch (e) {
          this.dialogTitle = 'Error';
          this.dialogText = '회원님은 이미 다른 Box를 가지고 있습니다.';
          this.dialog = true;
        }
      }
    },
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap');


.app-background {
  background-color: #D9D9D9;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.hover-btn {
  background-color: white;
  color: black;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.hover-btn:hover {
  background-color: black;
  color: white;
}
</style>
