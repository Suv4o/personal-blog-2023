---
title: The Right Way to Handle Hover in CSS Across Devices
description: Learn the right way to handle hover effects in CSS across devices. Discover why methods like screen-size queries, touch detection, and user-agent sniffing fail, and how @media (hover) provides a cleaner, more reliable solution for responsive, accessible designs.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1758442342/blog/the-right-way-to-handle-hover-in-css-across-devices/the-right-way-to-handle-hover-in-css-across-devices_j4pxou
keywords:
    - CSS hover
    - CSS media queries
    - detect hover devices
    - CSS @media hover
    - hover effects mobile
    - responsive CSS hover
    - touch vs hover
    - hover detection
    - cross-device CSS
    - CSS accessibility
type: page
blog: post
published: 21st September 2025
readTime: 5
author: Aleksandar Trpkovski
articleTags:
    - CSS
    - FrontEnd
    - JavaScript
---

# The Right Way to Handle Hover in CSS Across Devices

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1758442342/blog/the-right-way-to-handle-hover-in-css-across-devices/the-right-way-to-handle-hover-in-css-across-devices_j4pxou)

In today's diverse technological landscape, browsers run on a wide variety of devices, but hover functionality isn't universally supported across all of them. For example, mobile phones and tablets don't support hover functionality, so hover animations on buttons or cards don't make sense in CSS for these devices. In some cases, you might have devices that support hover when using a mouse but not when using touch screens.

In the past, we used different techniques to address this issue. We'll examine these common approaches that are still used even today. Later, we'll see how we can replace these less-than-ideal solutions with a neat feature that I personally wasn't aware existed and is well-supported in all browsers, I just learned about it recently.

## Why We Need to Detect Hover-Capable Devices

- **Avoid broken experiences on touch devices.**
  Some hover effects (like dropdown menus or tooltips) don't work well on mobile. Using appropriate detection lets you provide alternative behaviour (like showing the menu on tap instead of hover).
- **Improve accessibility & usability**
  Mobile users don't have hover, so a hover-only interaction could confuse them. With proper detection, you can design for both input types.
- **Performance optimisation**
  On touch devices, you might not want heavy hover animations (like transitions that never get triggered). Using hover detection, you can remove them for better performance.

## Using CSS media queries with `min-width` and `max-width`

Developers traditionally relied on screen size as a proxy for hover capability. Smaller screens were assumed to be touch-only devices without hover support, while larger ones were presumed to have hover functionality.

```css
/* Assume desktop supports hover */
@media (min-width: 769px) {
    .button:hover {
        background-color: #2980b9;
    }
}

/* Assume mobile doesn't support hover */
@media (max-width: 768px) {
    .button:active {
        background-color: #2980b9;
    }
}
```

However, this approach is unreliable. Screen size doesn't always correlate with input type, small laptops support hover, while large tablets typically don't. At best, it's an imprecise assumption.

## Using JavaScript (`ontouchstart`)

Another approach was to check if the device supported touch events. If it did, developers assumed no hover.

```js
const hasTouch = "ontouchstart" in window && navigator.maxTouchPoints > 0;

if (hasTouch) {
    document.body.classList.add("no-hover");
} else {
    document.body.classList.add("hover");
}
```

```css
body.hover .button:hover {
    background-color: #2980b9;
}

body.no-hover .button:active {
    background-color: #2980b9;
}
```

Hybrid devices (like laptops with touchscreens) break this logic. They support touch and hover, and forcing them into one category creates inconsistent behaviour.

## Using User-Agent Sniffing

A particularly fragile approach was examining the user agent string to determine whether a device was mobile or desktop.

```js
const isTouchDevice = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

if (isTouchDevice) {
    document.body.classList.add("no-hover");
} else {
    document.body.classList.add("hover");
}
```

```css
body.hover .button:hover {
    background-color: #2980b9;
}

body.no-hover .button:active {
    background-color: #2980b9;
}
```

## Why These Solutions Felt Problematic

All three approaches: screen size, touch detection, and user-agent sniffing were valid attempts, but they all made assumptions instead of directly asking the device: _“Can you hover?”_

As a result, they often failed in edge cases like hybrid devices, unusual screen sizes, or browsers that changed behaviour over time.

## The Right Solution: `@media (hover)`

Modern CSS gives us a direct, declarative way to handle hover capability with the `@media (hover)` feature. No guessing, no JavaScript, no hacks.

```css
/* Devices that support hover (e.g. mouse, trackpad) */
@media (hover: hover) {
    .button:hover {
        background-color: #2980b9;
    }
}

/* Devices that don’t support hover (e.g. touchscreens) */
@media (hover: none) {
    .button:active {
        background-color: #2980b9;
    }
}
```

This solution is cleaner, more reliable, and future-proof. It explicitly queries the device’s primary input mechanism, so you know exactly what you’re working with.

## Browser Support

`@media (hover)` is widely supported across all modern browsers and we can safely use without worrying about compatibility.

- Chrome: 38+
- Firefox: 64+
- Safari: 9+
- Edge: 12+
- Opera: 25+

## Conclusion

The `@media (hover)` feature query has been with us for a while now, even though many developers (myself included) aren't aware of it and continue using less reliable alternatives. This powerful CSS feature provides a direct way to detect hover capability without making assumptions based on screen size, touch support, or user agent strings.

By using `@media (hover)`, we can create truly responsive designs that adapt to the user's input method rather than their device type.

The wide browser support makes it a practical solution we can implement today, helping us build more accessible, performant, and user-friendly interfaces across all devices.

### Useful Resources

- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover" target="_blank" rel="noopener noreferrer">MDN: @media (hover)</a>
- <a href="https://www.smashingmagazine.com/2022/03/guide-hover-pointer-media-queries/" target="_blank" rel="noopener noreferrer">Smashing Magazine: A Guide To Hover And Pointer Media Queries</a>
- The code of this examples can we find in the following <a href="https://github.com/Suv4o/the-right-way-to-handle-hover-in-css-across-devices" target="_blank" rel="noopener noreferrer">GitHub</a> repo.
