# Create NpOS App
Nuxt integration into PlatformOS
<!-- [![NPM version](https://img.shields.io/npm/v/create-nuxt-app.svg?style=flat)](https://npmjs.com/package/create-nuxt-app)
[![NPM downloads](https://img.shields.io/npm/dm/create-nuxt-app.svg?style=flat)](https://npmjs.com/package/create-nuxt-app)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt/create-nuxt-app/master.svg?style=flat)](https://circleci.com/gh/nuxt/create-nuxt-app/master) -->
<!-- > Create a [Nuxt.js](https://github.com/nuxt/nuxt.js) project for platformOS in seconds -->
<!-- <details><summary>Preview</summary>
![preview](https://ooo.0o0.ooo/2017/08/05/5984b16ed9749.gif)
</details> -->

## Links

- 📘 Nuxt Documentation: [https://nuxtjs.org](https://nuxtjs.org)

## Usage
1. Create a PlatformOS instance at https://partners.platform-os.com/
   
2. Setup your PlatformOS instance ready to deploy https://documentation.platform-os.com/get-started

3. Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since [npm](https://www.npmjs.com/get-npm) `5.2.0`)

    ```bash
    npx create-npos-app nuxt/<my-project>
    ```

    Or starting with npm v6.1 you can do:

    ```bash
    npm init npos-app nuxt/<my-project>
    ```

    Or with [yarn](https://yarnpkg.com/en/):

    ```bash
    yarn create npos-app nuxt/<my-project>
    ```

10. Update enviroment variable CDN
   
    Currently the only way to get the CDN's url is to use this liquid `{{ '' | asset_url }}`. To make this easier for your staging instance run `marketplace-kit sync staging` save marketplace_builder/views/pages/index.html.liquid. Next view your staging instance and copy the CDN URL. Then locate the .env file in the yourProject/nuxt/<my-project> update the stagingCDN variable to your instance CDN. 
    For a production site you will currently have to manually produce find and replace the .env variable.

Note: Run all commands discussed in this tutorial in the project root directory, i.e. one level above the marketplace_builder directory.

Note: After installation, run nuxt commands e.g. `npm run dev` from the relavent directory i.e. yourProject/nuxt/<my-project>

## Features :tada:

1. Check the features needed for your project:
    - [PWA](https://pwa.nuxtjs.org/)
    - Linter / Formatter
    - [Prettier](https://prettier.io/)
2. Choose your favorite UI framework:
    - None (feel free to add one later)
    - [Bootstrap](https://github.com/bootstrap-vue/bootstrap-vue)
    - [Vuetify](https://github.com/vuetifyjs/vuetify)
    - [Bulma](https://github.com/jgthms/bulma)
    - [Tailwind](https://github.com/tailwindcss/tailwindcss)
    - [Element UI](https://github.com/ElemeFE/element)
    - [Ant Design Vue](https://github.com/vueComponent/ant-design-vue)
    - [Buefy](https://buefy.github.io)
    - [iView](https://www.iviewui.com/)
    - [Tachyons](https://tachyons.io)

3. Adds `<pos>` block to .vue files allowing PlatformOS frontmatter and liquid markup

4. Uses Nuxt generate to automatically compile, format and move generated output into PlatformOS

## Recommend Visual Studio extensions
If using VSCode I recommend the following or similiar extensions
 - Vetur 
 - DotENV

## Credits
This module is forked from create-nuxt-app. So the most credit is due those working on create-nuxt-app.

- [egoist](https://github.com/egoist)
- [clarko](https://github.com/clarkdo)
- All the contributors ([list](https://github.com/nuxt/create-nuxt-app/contributors))

nuxt-platformOS intergration
- [digitalfuel](https://github.com/digitalfuel)
