# IRCCloud Layout experiment/demo

A personal experiment/challenge to try to recreate the [IRCCloud](https://www.irccloud.com/) layout and merge website and Android app into one.

My goal was to keep it as simple as possible while maintaining accuracy to the original app, and doing everything with just CSS.

**Note:** The is an experiment and is just HTML and CSS, but it could benefit from some JavaScript to get this site fully accessible and working better.

## View [Demo/live-site](https://madlittlemods.github.io/irccloud-layout-demo/dist/)


# Overview

 - CSS-only *(no JavaScript)*
 - Responsive
 	 - Merges all of the different platforms(desktop web and Android app) into one.
 - Flex box everywhere
 	 - The `order` property makes it extremely easy to modify the element order. We use this functionality when we need to put the network/channel list on the opposite side of the page when we hit the constrained width (tablet) breakpoint.
 - Expand/Collapse menus
 	 - Accomplished with checkboxes at the top of the body and the `:checked` pseudo selector.
 - Accessible, *see the [Accessibility section](#accessibility)*

## Technology Overview

 - [Gulp](http://gulpjs.com/): Task runner for taking care of build process
 - [PostCSS](https://github.com/postcss/postcss): CSS preprocessor/postprocessor with a variety of plugins
 	 - This project was originally coded in Sass. That code is only slightly outdated from the PostCSS version and remains under `src/scss-legacy`.

### Why PostCSS?

PostCSS reminds me of Gulp. Mix and match plugins to get exactly what you need. If some feature isn't available, you can just develop it yourself in JavaScript!

I chose to move to PostCSS because I was after a certain use-case and the [features needed to implement it](https://github.com/sass/sass/issues/871) are not in Sass/libsass yet. My use-case goal was to slightly widen the widths of the side bars in "narrow vertical (phone)" layout mode but since the layout pieces reference each other, I didn't want to update each-and-every other place that referenced that variable, just because I added another media query. 

I ended up making [my own PostCSS plugin, `postcss-css-variables`](https://www.npmjs.com/package/postcss-css-variables) to cover this feature. The plugin strives to bring as much of CSS4 variables(also known as custom properties) features into PostCSS.



## Target layouts

Responsive breakpoint layout targets were taken from the [IRCCloud website](https://www.irccloud.com/) and the [IRCCloud Android app](https://play.google.com/store/apps/details?id=com.irccloud.android) in landscape and portrait mode on a Nexus 7.

Lots of space and wide (desktop):

![](http://i.imgur.com/bsMvIyq.png)

Constrained wide (tablet):

![](http://i.imgur.com/qOl5ZAh.png)

Narrow vertical (phone):

![](http://i.imgur.com/9EvQERN.gif)


# Accessibility

 - Proper ARIA attributes for screen readers
 	 - Tested with [ChromeVox](http://www.chromevox.com/)
 	 - [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) for chat area log. This will hint a screen reader to announce any new messages politely that get added to the DOM.
 - Skip links for keyboard users to skip focus over potentially long lists of members or channels.
 	 - When tabbing through the site, when you reach the member or network/channel list a small link tab will slide in from the left. Just press enter and it will move your focus over the long list of links.


# Things to Improve

## Textarea

We are using a `contentediable` div instead of a `<textarea>` because it gives us the same neat feature that is on the desktop site, where the textarea height sizes to the content so you can preview your full multiline message. 

We can either add in JavaScript bindings so that pressing `enter`(excluding `shift+enter` for multiline) will send the message.

Or switch over to a `<textarea>` and change the height of the textarea on the `change` event as people are typing.


## One aspect of content reliance/fragility

The `.member-list-wrapper` relies on the number of lines of content in `.channel-header`. But only in the "Lots of space and wide (desktop)" layout mode because we have to tuck the member list below the channel header. Right now it is a "magic" number of `2em` so that it can allow one line of text(`1em`) and the padding all around of `0.5em`.

I couldn't figure out a better way than this to make it foolproof without repeating dom structure. To remedy this reliance on content, it could be fixed by changing `margin-top` of `.member-list-wrapper` whenever switching channels or on a throttled/debounced window resize.


## Swipe in menus

Right now the menus are accessible via `:hover` on either side which doesn't work amazingly well on mobile. There is also a menu toggle for the network/channel list when in the narrow vertical phone layout mode.

But swipe from left or right gestures with JS, just like the native Android app would improve the feel.


## More ARIA

 - Toggle `aria-hidden` attribute on sidebars when hidden with JavaScript.
 - Add live region to network/channel list to announce when there is unread messages in a channel


## Hook it up to the API

Hook up the [IRCCloud API](https://github.com/irccloud/irccloud-tools/wiki/API-Overview) and see how it handles user generated content.


# Browser Support

Browser support is essentially dictacted by [flex-box support](http://caniuse.com/#feat=flexbox) in browsers.

 - Chrome
 - Firefox
 - IE10+