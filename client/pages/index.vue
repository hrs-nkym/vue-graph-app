<template>
  <div>
    <button @click="isShowEditArea = true">
      Add
    </button>
    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Mail</th>
        <th>Age</th>
        <th>-</th>
      </tr>
      <tr v-for="item in users" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.age }}</td>
        <td>
          <button @click="editItem(item)">
            edit
          </button>
          <button @click="deleteItem(item)">
            delete
          </button>
        </td>
      </tr>
    </table>

    <div v-if="isShowEditArea">
      <h2>{{ formTitle }}</h2>
      <div>
        <input v-model="editedItem.name" type="text" placeholder="name">
      </div>
      <div>
        <input v-model="editedItem.email" type="email" placeholder="mail">
      </div>
      <div>
        <input v-model="editedItem.age" type="number" placeholder="age">
      </div>
      <div>
        <button @click="close">
          cancel
        </button>
        <button @click="save">
          save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import getUsersGql from '~/apollo/queries/getUsers.gql';

import createUserGql from '~/apollo/mutations/createUser.gql';
import updateUserGql from '~/apollo/mutations/updateUser.gql';
import deleteUserGql from '~/apollo/mutations/deleteUser.gql';

export default {
  data() {
    return {
      users: [],
      isShowEditArea: false,
      editedIndex: -1,
      editedItem: {
        id: null,
        name: null,
        email: null,
        age: null
      },
      defaultEditedItem: {
        id: null,
        name: null,
        email: null,
        age: null
      }
    }
  },
  
  computed: {
    formTitle() {
      return this.editedIndex === -1
      ? 'user add'
      : 'user update'
    }
  },

  apollo: {
    users: {
      query: getUsersGql
    }
  },

  methods: {
    async createItem({
      name,
      email,
      age
    }) {
      const { error } = await this.$apollo.mutate({
        mutation: createUserGql,
        variables: {
          name,
          email,
          age
        },
        refetchQueries: [{
          query: getUsersGql
        }]
      })

      if (error) {
        console.log('create failure.');
      }

      this.close()
    },

    async updateItem({
      id,
      name,
      email,
      age
    }) {
      const { error } = await this.$apollo.mutate({
        mutation: updateUserGql,
        variables: {
          id,
          name,
          email,
          age
        },
        refetchQueries: [{
          query: getUsersGql
        }]
      })

      if (error) {
        console.log('update failure.');
      }

      this.close()
    },

    async deleteItem(item) {
      if (!confirm(`delete user? ${item.name}`)) {
        return
      }

      const { error } = await this.$apollo.mutate({
        mutation: deleteUserGql,
        variables: {
          id: item.id
        },
        refetchQueries: [{
          query: getUsersGql
        }]
      })

      if ( error ) {
        console.log('delete failure.');
      }
    },

    editItem(item) {
      console.log('hoge1: ');
      console.log(item);
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log('hoge2: ');
      console.log(this.editedItem);
      this.isShowEditArea = true
    },

    close() {
      this.isShowEditArea = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultEditedItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        this.updateItem(this.editedItem)
      } else {
        this.createItem(this.editedItem)
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
