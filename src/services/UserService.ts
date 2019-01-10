import axios from '../utils/axios';
import {User} from '@/model/User';
import {Body, DELETE, FluentHttp, GET, Header, Path, POST, Query, Headers} from '@/utils/FluentHttp';
import Loading from '@/utils/Loading';

export default class UserService extends FluentHttp {
  public static isTestable = false;

  constructor() {
    super(axios);
  }

  @Loading(false)
  @GET('http://localhost:8882/users')
  public fetchUsers() {
  }

  @DELETE('http://localhost:8882/user/:id')
  public deleteUser(@Path('id') id: number) {
  }

  @POST('http://localhost:8882/user')
  public createUser(@Body user: User) {
  }
}
