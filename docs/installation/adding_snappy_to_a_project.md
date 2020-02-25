---
layout: page
title: Adding Snappy to a Project
parent: Installation
nav_order: 3
permalink: /adding_snappy_to_a_project/
---

# Adding Snappy to a Project


We recommend using one of our starters which comes already prepared to dinamycally generate screens and components using [hygen](https://www.hygen.io/).

---

To install Snappy using npm run the following command on your project folder.

```bash
$ npm i -s git+ssh://git@gitlab.ubiwhere.com:knowledge-base/frontend/Starters/snappy.git
```

If you prefer to use yarn run the following command instead.

```bash
$ yarn add git+ssh://git@gitlab.ubiwhere.com:knowledge-base/frontend/Starters/snappy.git
```

---

After setting up your project to use [react-native](https://reactnative.dev/docs/getting-started) with the **react-native CLI** and [react-native-navigation](https://wix.github.io/react-native-navigation/#/docs/Installing) you should change your index.js file to look like something like this:

```javascript
import { SnappyNavigation } from 'snappy'

import Screens from 'src/navigation/screens'
import Translations from 'src/translations'
import Theme from 'src/ui/theme'

// Register all screens on launch and attach the theme and app internationalization
SnappyNavigation.registerScreens(Screens, Theme.darkMode, Translations, () => {
	console.log("APP HAS BEEN STARTED")
})
```

instead of this:

```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```


Notice here that we are importing **3** very important files: [Screens](#screens), [Translations](#translations) and [Theme](#theme).
These **3** files are the only configuration you'll need in order to setup your project. Bear in mind that the Screens will be automatically generated for you, so no need to worry about all the [react-native-navigation](https://wix.github.io/react-native-navigation/#/) fuzz of registering your components. 

Only when connecting Snappy's logic to a screen component will you be able to access to Snappy's methods. These are all the methods and classes which are binded as props:

* **screens** - collection of all the available screens
* **navigate** - a set of methods abstracted from [react-native-navigation](https://wix.github.io/react-native-navigation/#/) to navigate between the screens. Follows the same logics as [react-native-navigation](https://wix.github.io/react-native-navigation/#/) and requires the **componentId** to be passed as a prop for certain methods, but don't worry each screen as its own **componentId** defined as a **prop**:
	* **goToNavigation** - equivalent of ***setNavigationRoot***
	* **goToNavigationModal** - equivalent of ***showModal***
	* **dismissNavigationModal** - equivalent of ***dismissModal***
	* **goToTabNavigation** - equivalent of ***setNavigationRoot*** with ***bottomTabs*** structure
	* **goToScreen** - equivalent of ***push***
	* **showOverlay** - equivalent of ***showOverlay***
	* **dismissOverlay** - equivalent of ***dismissOverlay***
	* **goBack** - equivalent of ***pop***
	* **goBackTo** - equivalent of ***popTo***
	* **goToRoot** - equivalent of ***popToRoot***
* **actions** - all the actions created inside the Logic file plus some Snappy default built-in actions such as:
  * **set_theme** - changes the current theme and saves it in memory
  * **change_locale** - changes the current locale and saves it in memory
  * **set_locale** - changes the current locale but doesn't save it in memory
* **theme** - access to the currently set theme
* **i18n** - all of i18n methods, but most importantly ***i18n.t()***

---
## Connecting Logic to a Screen

First step to to connect a logic to a Screen Component would be to create a logic file.

Snappy's logic structure can be found at the [Logic](/logic) section.

A component connected to Snappy should look like something like this:

```javascript
import React from 'react'
import { View, Text } from 'react-native'

import snappy, { SnappyComponents } from 'snappy'
import Logic from './logic'

const YourComponent = props => {
  const { screens, actions, navigate, theme } = props

  return (
    <View>
      <Text>YourComponent</Text>
    </View>
  )
}


export default snappy(Logic)(YourComponent)
```

Basically here Snappy is working as an Higher-Order Component (HOC) which handles all the store creations for each component due to the fact that with [react-native-navigation](https://wix.github.io/react-native-navigation/#/) each screen ends up having it's own store for perfomance purposes.

and its logic to something very close to this:

```javascript
import { SnappyEffects } from 'snappy'

export default {

  sagas: {
    //insert sagas here
  },

  reducers: {
    //insert reducers here
  }

}
```

For more details about Snappy's logic visit the [Logic](/logic) section.

---

## Screens

A Screens file would be a collection of screens where each defined screen should have **3** core components. It's **id**, the **component** to be registered and a **structure**

The **structure** object must be a function with at least 1 parameter, the props parameter which will be passed from the navigation methods down to the the component it self. This object follows the same rules as [react-native-navigation layout types](https://wix.github.io/react-native-navigation/#/docs/layout-types).

 Because Snappy is still in development this process requires the screen's id to be repeated twice. Both inside and outside the structure object. 

```javascript
import YourScreen from 'src/ui/screens/YourScreen'

export default {
  YOUR_SCREEN: {
    id: 'YourScreen',
    component: YourScreen,
    structure: (props, options = {}) => ({
      component: {
        id: 'YourScreen',
        name: 'YourScreen',
        passProps: {
          ...props
        },
        options: {
          topBar: {
            visible: false,
            animate: false,
            elevation: 0,
            drawBehind: true,
            background: {
              color: 'transparent'
            },
            backButton: { visible: false },
          }
        }
      }
    })
  }
}
```

So if for instance you would like to navigate to the previous screen and pass a prop you would do something as follows:

```javascript
navigate.goToScreen(screens.YOUR_SCREEN, { componentId, title: 'SOME_TITLE_PROP' })
```

---

## Translations

Snappy is configured to use [react-i18next](https://react.i18next.com/) for translations and [react-native-localize](https://github.com/react-native-community/react-native-localize) to detect your initial language if none was set.

When changing a language Snappy will automatically set the new values as default when reopening the application.

```javascript
import en from './en-US.json'
import pt from './pt-PT.json'
import pt from './es-ES.json'

export default {
  en,
  pt,
  es
}
```

```json
{
  "translation": {
    "hello_snappy": "Oh hi Mark"
  }
}
```

```json
{
  "translation": {
    "hello_snappy": "Olá Mark"
  }
}
```

```json
{
  "translation": {
    "hello_snappy": "Hola Mark"
  }
}
```

---

## Theme

The imported file with themes must consist of a collection of one or more themes.


When changing a theme Snappy will automatically set the new value as default when reopening the application.


```javascript
export default {
  darkMode: {
    font: {
      bold: "BlissBold",
      light: "BlissLight",
      medium: "BlissMedium",
      regular: "BlissRegular"
    },
    colors: {
      main: {
        white: "#FFFFFF",
        blue: "#51B8EA",
      },
      palette: {
        grey: ["#B2B2B2", "#161616"],
        blue: ["#9CB0D5", "#5174B1", "#1B4794"],
      },
      gradients: {
       blue: ["#51B8EA", "#1B4794"],
      }
    }
  }
}
```