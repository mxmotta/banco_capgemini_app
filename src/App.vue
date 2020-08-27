<template>
  <v-app>
    <v-app-bar
      app
      color="#30275b"
      dark
    >
      <v-toolbar-title>Banco Capgemini</v-toolbar-title>
    </v-app-bar>

    <v-main class="px-5 container text-center">
      <v-row>
      <div v-if="!hasAccount" class="col-md-6 offset-md-3 align-center">
        <v-img src="./assets/welcome.png" alt="welcome"></v-img>
        <p>
          Seja bem vindo ao nosso banco! <br>
          Abra agora a sua conta.
        </p>
        <v-btn color="#30275b" block style="color: #fff;" @click="createAccount">Abrir conta</v-btn>
      </div>
      </v-row>
      <div v-if="hasAccount">
        <Balance :account_id='account_id' :account_number='account_number'></Balance>
        <Movements :account_id='account_id'></Movements>
      </div>
    </v-main>

    <v-dialog
        v-model="dialog.status"
        max-width="290"
        >
        <v-card>
        <v-card-title class="headline">{{ dialog.title }}</v-card-title>
        <v-card-text>
        {{ dialog.message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
            color="green darken-1"
            text
            @click="dialog.status = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
  </v-app>
</template>

<script>

import { create } from "./services/domain/account";
import { mapMutations, mapGetters } from "vuex";
import Balance from "./components/Balance";
import Movements from "./components/Movements";

export default {
  name: 'App',

  computed: {
    ...mapGetters({
      account_id: 'getAccountId'
    }),
    account_number(){
      return `${localStorage.account}-${localStorage.digit}`
    }
  },

  components: {
    Balance,
    Movements
  },

  data: () => ({
    hasAccount: false,
    dialog: {
        status: false,
        title: '',
        message: ''
    }
  }),

  mounted(){
    if(this.account_id == 0){
      this.setAccountId(localStorage.account_id)
      this.hasAccount = true
    }
  }, 

  methods:{
    ...mapMutations(['setAccountId']),
    createAccount(){
        create()
        .then((res) => {
            localStorage.account = res.data.data.account
            localStorage.digit = res.data.data.digit
            localStorage.account_id = res.data.data.id
        })
        .then(() => {
            this.dialog.status = true
            this.dialog.title = 'Sucesso!'
            this.dialog.message = 'Sua conta foi criada com sucesso'
        })
        .then(() => {
          this.setAccountId(localStorage.account_id)
          this.hasAccount = true
        })
        .catch(() => {
            this.dialog.status = true
            this.dialog.title = 'Error!'
            this.dialog.message = 'Ocorreu um erro ao criar sua conta. Aguarde um pouco e tente novamente mais tarde.'
        })
    }
  },
  filters:{
    money(value){
      return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    }
  }
};
</script>
