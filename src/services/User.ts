import axios from '../utils/axios';
import loading from '../utils/loading';

export default class User {
    public static isTestable = false;

    @loading('')
    public fetchUser() {
        return axios.get('/users');
    }
}
