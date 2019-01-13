import axios from '../utils/axios';
import {User} from '@/model/User';
import {Body, DELETE, FluentHttp, GET, Header, Path, POST, Query, Headers, RequestOptions} from '@/utils/FluentHttp';
import Loading from '@/utils/Loading';

export default class UserService extends FluentHttp {
  public static isTestable = false;

  constructor() {
    super(axios);
  }

  @GET('/users')
  public fetchUsers() {
  }

  @DELETE('/user/:id')
  public deleteUser(@Path('id') id: number) {
  }

  @POST('/user')
  public createUser(@Body user: User) {
  }
}
