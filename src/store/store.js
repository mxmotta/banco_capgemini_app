import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        balance: 0
    },
    getters: {
        getBalance(state){
            return state.balance
        }
    },
    mutations: {
        addBalance(state, payload){
            state.balance = payload
        }
    }
})