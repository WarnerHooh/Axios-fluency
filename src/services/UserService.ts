import axios from '../utils/axios';
import loading from '../utils/loading';
import {User} from '@/model/User';
import {Body, DELETE, FluentHttp, GET, Header, Path, POST, Query} from '@/utils/FluentHttp';

export default class UserService extends FluentHttp {
  public static isTestable = false;

  constructor() {
    super(axios)
  }

  @loading(false)
  @GET('http://localhost:8882/users')
  public fetchUsers() {
  }

  @loading()
  @DELETE('http://localhost:8882/user/:id')
  public deleteUser(@Path('id') id: number) {
  }

  @loading(false)
  @POST('http://localhost:8882/user')
  public createUser(@Body user: User) {
  }
}
