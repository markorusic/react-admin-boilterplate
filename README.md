# React Admin Boilterplate

## Setup

```sh
git clone https://github.com/markorusic/react-admin-boilterplate
```

```sh
npm i
```

```sh
npm start
```

## Getting started

Main starting point of app is ```src/main.tsx```. It bootstraps all required providers, global CSS and renders ```App``` component.

```src/app.tsx``` component is responsible for rendering routes and base layout using the ```src/core/navigation.tsx``` module. For every navigation item registered it will create route with base layout and sidebar link. 

All feature code lives in ```src/features``` directory. By default it contains two base feature, user/admin CRUD, and app settings.

## Auth

Check ```src/services/auth.ts``` and update it to meet your auth logic.

Current auth module assumes that cookie based token is sent on successfull login.

TODO: add support for defining custom roles/permissions and token logic

## Localization

Check ```src/lang``` directory for language files.

### Adding new language

* Add new language file to ```src/lang```
* Register new language in ```src/core/localization/lang-provider.tsx```


After you add new entry to default language file (en.json), make sure to run ```npm run gen:trans-types``` to get type safety and code completion for its key.

## Adding new CRUD feature

Run and follow instructions:
```sh
npm run gen:feature
```

It will generate boilterplate code for CRUD feature in defined directory.

If your feature has new page, register it in ```src/app.tsx```

If your feature has MSW mock, register it in ```src/mocks/handlers/index.ts```

## MSW Mockups

By default MSW worker runs in dev mode. Check ```src/main.tsx``` to change that if needed.

All handlers are grouped by feature and stored in ```src/mocks/handlers```.
