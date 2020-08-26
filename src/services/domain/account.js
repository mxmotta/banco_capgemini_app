import http from '../Http';

export const list = () => http.get('/accounts')
export const balance = (account_id) => http.get(`/accounts/${account_id}/balance`)
export const movements = (account_id) => http.get(`/accounts/${account_id}/movements`)
export const addMovements = (account_id, data) => http.post(`/accounts/${account_id}/movements`, data)
export const create = () => http.post('/accounts')
