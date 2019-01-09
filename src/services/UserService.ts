import axios from '../utils/axios';
import loading from '../utils/loading';
import {User} from '@/model/User';
import {FluentHttp, GET, Path, Query} from '@/utils/FluentHttp';

export default class UserService extends FluentHttp {
  public static isTestable = false;

  constructor() {
    super(axios)
  }

  @loading(false)
  @GET('http://localhost:8882/users')
  public fetchUsers() {
  }

  @loading(false)
  @GET('http://localhost:8882/users/:id')
  public fetchUser(@Path('id') id: number, @Query('gender') gender: string) {
  }

  @loading()
  public deleteUser(id: number) {
    return axios.delete(`http://localhost:8882/user/${id}`);
  }

  @loading(false)
  public createUser(user: User) {
    return axios.post(`http://localhost:8882/user?a=2&b=2`, user);
  }
}
