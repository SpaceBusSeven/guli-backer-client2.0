import store from 'store'

const USER_KEY = 'user_key'

export default {
  saveUser: function (user) {
    store.set(USER_KEY, user)
  },
  getUser: function () {
    return store.get(USER_KEY) || {}
  },
  removeUser: function () {
    store.remove(USER_KEY)
  },
}
