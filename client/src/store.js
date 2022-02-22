import { createStore } from 'redux'

const initialState = {
  sidebarShow: 'responsive',
  companyId: localStorage.getItem('companyId'),
  companyList: []
}
const changeState = (state = initialState, { type, ...rest }) => {
  console.log('state:::::>>in store', state);
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store