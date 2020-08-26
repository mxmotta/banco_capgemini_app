<template>
  <v-card
    class="ma-1"
    outlined
    >
        <v-card-title class="headline">Saldo</v-card-title>
        <v-card-subtitle class="text-left">
        <strong>{{ balance | money }}</strong>
        </v-card-subtitle>
        <v-card-text class="text-left">
        <strong>Conta:</strong> {{ account_number }}
        </v-card-text>

    </v-card>
</template>

<script>
import { balance } from "../services/domain/account";
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'Balance',

    data: () => ({
        // balance: 0
    }),

    props: ['account_id', 'account_number'],

    computed:{
        ...mapGetters({
            balance: 'getBalance'
        })
    },

    mounted(){
      this.accountBalance()
    },

    methods:{
        ...mapMutations(['addBalance']),
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
        }
    }
}
</script>