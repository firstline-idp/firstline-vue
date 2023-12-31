# Firstline Vue

This library enables you to add authentication to your Vue app.

## Helpful resources

- [Quick setup](https://docs.firstline.sh/quicksetup/vue) - our guide for quickly adding login, logout and user information to a Vue app using Firstline.
- [Vue sample app](https://github.com/firstline-idp/sample-firstline-vue) - a full-fledged Vue application integrated with Firstline.
- [Firstline docs](https://docs.firstline.sh) - explore our docs site and learn more about Firstline.

## Getting started

### 1. Setup Firstline Application & API

1. Follow the [Quick setup](ttps://docs.firstline.sh/quicksetup/vue) to configure a Firstline Application.
2. Add a Firstline API as shown in [Secure API](https://docs.firstline.sh/secureapi).

**Important:** Don't forget to configure the Application URIs.

### 2. Installation

Using npm:

```sh
npm install @first-line/firstline-vue
```

Using yarn:

```sh
yarn add @first-line/firstline-vue
```

### 3. Configuration

Add the following code to your Vue project. Replace **DOMAIN**, **API_IDENTIFIER** and **CLIENT_ID** with the settings you configured in the setup step. You can also find them in the Application's and API's "Configure" tab in your dashboard.

```ts
// main.ts
import { createFirstline } from "@first-line/firstline-vue";

const app = createApp(App);

app.use(
  createFirstline({
    domain: 'DOMAIN',
    audience: 'API_IDENTIFIER',  // = audience
    client_id: 'CLIENT_ID',
    redirect_uri: window.location.origin,
    logout_uri: `${window.location.origin}/logout`,  // or window.location.origin to redirect back to home after logout
  })
);

app.mount('#app');
```

### 4. Add login & logout to your application

Implement the following component in your frontend and you have a fully functional login/logout.

```html
<!-- Component.vue -->
<template>
  <div>
    <p v-if="isLoading">Loading ...</p>
    <div v-if="!isAuthenticated">
      <button @click.prevent="login">Login</button>
    </div>
    <div v-if="isAuthenticated">
      <p>{{ user.email }}</p>
      <button @click.prevent="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useFirstline } from '@first-line/firstline-vue';

export default {
  name: "Component",
  setup() {
    const firstline = useFirstline();
    
    return {
      isAuthenticated: firstline.isAuthenticated,
      isLoading: firstline.isLoading,
      user: firstline.user,
      login() { firstline.loginWithRedirect(); },
      logout() { firstline.logout(); }
    };
  }
};
</script>
```

You can call useFirstline() from anywhere in your application to
- log in
- log out
- check if the user is signed in
- retrieve the logged in user

### 5. Make a secured backend call

Here is sample code on how to make an API request to a secured endpoint.

```html
// CallAPIComponent.vue
<template>
  <button @click="loadPosts">Load</button>
  <p>{{errorMessage}}</p>
  <ul>
    <li v-for="post in posts">
      {{ post.text }}
    </li>
  </ul>
</template>

<script lang="ts">
import { useFirstline } from "@first-line/firstline-vue";
import { ref } from "vue";

export default {
  name: "api-call",
  setup() {
    const firstline = useFirstline();
    const errorMessage = ref("");
    const posts = ref([]);
    return {
      errorMessage,
      posts,
      async loadPosts() {
        const accessToken = await firstline.getAccessToken();
        try {
          const response = await fetch("http://localhost:8080/posts", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          posts.value = await response.json();
          errorMessage.value = "";
        } catch (e: any) {
          errorMessage.value = `Error: the server responded with '${e.response.status}: ${e.response.statusText}'`;
        }
      },
    };
  },
};
</script>
```

In this example, we assume that the API endpoint http://localhost:8080/posts exists.

**Important:** The user must be logged in when calling `getAccessToken()`. Therefore, use `isAuthenticated`.
