<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>{{ foo }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import User from '../services/User';
import {convoy} from '../utils/axios';


@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  public data() {
      return {
          foo: 'foo',
      };
  }

  public created() {
    this.fetch();
  }

  @convoy
  public fetch() {
    const user = new User();

    return user.fetchUser()
        .then((data) => console.log(data));

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
