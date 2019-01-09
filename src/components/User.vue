<template>
  <div class="hello">
    {{msg}}
    <div v-for="user of users" :key="user.id">
      {{user.name}} - {{user.gender}}
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import User from "../services/User";
import {Convoy} from "../utils/axios";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  public users = [];

  public created() {
    console.log(this);
    this.fetch();
  }

  @Convoy
  public fetch() {
    const user = new User();
    return user.fetchUser()
      .then((resp) => {
        this.users = resp.data;
      });

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
