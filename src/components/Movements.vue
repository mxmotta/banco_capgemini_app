<template>
  <div>
    <v-row class="ma-1">
      <v-card
          class="pa-2 col-4"
          outlined
          tile
          @click="openMovementDialog('deposit')"
        >
        Depositar
      </v-card>
      <v-card
          class="pa-2 col-4"
          outlined
          tile
          @click="openMovementDialog('withdraw')"
        >
        Sacar
      </v-card>
      <v-card
          class="pa-2 col-4"
          outlined
          tile
          @click="fetchMovements"
        >
        Atualizar
      </v-card>
    </v-row>

    <v-data-table
    :headers="headers"
    :items="account_movement"
    :items-per-page="5"
    sort-by="id"
    sort-desc=""
    outlined
    :loading=loading
    loading-text="Carregando..."
    mobile-breakpoint=100
    >
    <template v-slot:item.direction="{ item }">
      <v-icon :class="action(item)">{{ item.type | direction_icon }}</v-icon>
    </template>
    <template v-slot:item.date="{ item }">
      {{ item.created_at | date }}
    </template>
    <template v-slot:item.value="{ item }">
      <span :class="action(item)">{{ item.value | money }}</span>
    </template>
    </v-data-table>

    <v-dialog
      v-model="movement_form.status"
      width="400"
    >
    <v-card>
        <v-card-title class="headline">Realizar um {{ movement_form.title }}</v-card-title>
        <v-card-text>
          <v-text-field
            label="Informe o valor desejado"
            prepend-icon="mdi-cash"
            prefix="R$"
            v-model="movement_form.value"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="movement_form.status = false">Fechar</v-btn>
          <v-btn color="blue darken-1" text 
            @click="sendMovemet({ type: movement_form.direction, value: movement_form.value })">
            {{ movement_form.title }}
          </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>

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
  </div>
</template>

<script>
import { movements, addMovements, balance } from "../services/domain/account";
import { mapGetters, mapMutations } from 'vuex'
import moment from "moment";
export default {
    name: 'Movements',

    props: ['account_id'],

    computed:{
        ...mapGetters({
            balance: 'getBalance'
        })
    },

    data: () => ({
      loading: true,
      dialog: {
          status: false,
          title: '',
          message: ''
      },
      movement_form: {
        status: false,
        title: '',
        direction: '',
        value: 0
      },
      account_movement: [],
      headers: [
          { text: '', value: 'direction', align: 'center', width: 50},
          { text: 'Data', value: 'date', align: 'start'},
          { text: 'Valor', value: 'value', align: 'end' }
      ],
      rules: {
          required: value => !!value || 'Campo obrigatório.'
      }
    }),

    mounted(){
      this.fetchMovements()
    },

    methods:{
      ...mapMutations(['addBalance']),
      fetchMovements(){
          movements(this.account_id)
          .then((res) => {
            this.loading = true
            this.account_movement = res.data.data
          })
          .then(() =>{
            this.accountBalance()
            this.loading = false
          })
          .catch(() => {
              this.dialog.status = true
              this.dialog.title = 'Error!'
              this.dialog.message = 'Ocorreu um erro ao criar sua conta. Aguarde um pouco e tente novamente mais tarde.'
          })
      },
      sendMovemet(data){
        addMovements(this.account_id, data)
          .then(() => {
            this.movement_form.status = false,
            this.movement_form.title = '',
            this.movement_form.direction = '',
            this.movement_form.value = 0
          })
          .then(() => {
              this.dialog.status = true
              this.dialog.title = 'Successo!'
              this.dialog.message = 'Transação efetuada com sucesso.'
          })
          .then(() => {
            this.fetchMovements()
            this.accountBalance()
          })
          .then(() =>{
            this.loading = false
          })
          .catch(() => {
              this.dialog.status = true
              this.dialog.title = 'Error!'
              this.dialog.message = 'Ocorreu um erro ao criar sua conta. Aguarde um pouco e tente novamente mais tarde.'
          })
      },
      action(item) {
        if(item.type == 'deposit')
          return 'green--text'
        return 'red--text'
      },
      openMovementDialog(method){
        this.movement_form.status = true
        this.movement_form.direction = method
        this.movement_form.title = method == 'deposit' ? 'Depósito' : 'Saque'
      },
      accountBalance(){
        balance(this.account_id)
        .then((res) => {
            this.addBalance(res.data.data)
        })
      }
    },
    filters:{
      money(value){
        return parseFloat(value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
      },
      date(date){
          return moment(date).format('D/MM/Y H:m')
      },
      direction_icon(direction){
        if(direction == 'deposit')
          return 'mdi-arrow-down-bold'
        return 'mdi-arrow-up-bold'
      }
    }
}
</script>

<style>

</style>