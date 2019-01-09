<template>
  <div class="hello">
    {{msg}}
    <div v-for="user of users" :key="user.id">
      {{user.name}} - {{user.gender}}
    </div>
  </div>
</template>

<script>
import {Component, Prop, Vue} from 'vue-property-decorator';
import User from '../services/User';
import {Convoy} from '../utils/axios';

export default {
  data() {
    return {
      msg: '1',
      users: []
    }
  },

  created() {
    this.msg = '456';
    console.log(this)
    this.fetch();
  },

  methods: {
    @Convoy
    fetch() {
      const user = new User();
      return user.fetchUser()
        .then((resp) => {
          console.log(this)
          this.users = resp.data;
        });

    }
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
