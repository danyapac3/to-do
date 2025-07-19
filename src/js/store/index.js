import Store from './store.js';
import state from './state.js';
import mutations from './mutations.js';
import actions from './actions.js';

export default new Store({
  actions,
  mutations,
  state
});