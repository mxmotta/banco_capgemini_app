import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        balance: 0,
        account_id: 0
    },
    getters: {
        getBalance(state){
            return state.balance
        },
        
        getAccountId(state){
            return state.account_id
        }
    },
    mutations: {
        addBalance(state, payload){
            state.balance = payload
        },

        setAccountId(state, payload){
            state.account_id = payload
        }
    }
})