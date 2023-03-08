<!-- github -->
![jsDelivr hits (GitHub)](https://img.shields.io/jsdelivr/gh/hm/kylebakerio/aframe-interior-parallax-mapping)

See these rooms? As long as you don't try to go inside them, they look fully 3d. In reality, they're just a plane with a cubemap and a shader, though. This means you can get the appearance of rooms within buildings very cheaply, a la [spiderman](https://www.youtube.com/watch?v=eX7x1mJrQJs).

To use:

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.4.1/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/kylebakerio/aframe-interior-parallax-mapping@1.1.0/interior-parallax.js"></script>
</head>
```

basic proof of concept. See index.html for a guide to use. Just include the single interior-parallax.js file to use the component.

98% a port of the work done by Mohsen Heydari, I just made it a component and changed it from .dds to supporting 6 png and equirectangular images, and made an easy to use aframe component wrapped around it.

## Creating usable equirectangular images / cubemaps for this component / future roadmap

To make this work, I use equirectangular images of interiors that are very carefully taken to work with this illusion. I took 3d rooms, put them in another scene, positioned and scaled them and removed pieces that would break the illusion, and then painstakingly positioned the camera and took a screenshot within aframe to make them.

Not the most ideal method, but coming up with a better method is kind of tricky. I did get better as I was taking the third one.

The key is that you think of the image you're taking in terms of the cubemap it will be turned into; you need to make sure that as much as possible, nothing shows up on more than one face of the cubemap. So, the floor should not leak over from the bottom face of the cubemap to any of the "walls" of the cubemap, and no desk or something can be both on the floor and the wall, and no lights can be on both the ceiling and the wall, and no couch can be on multiple walls, etc. Finally, you need to make sure that the 5 of the 6 sides are perfectly set up and fully 'covered'. (the 6th side is the 'transparent' discarded side that you look in through, the 'window' if you will.

You can bend this rule a bit and get away with it as long as the user doesn't look too close, but for the most part, this is the key to taking picture that look good.

It may make more sense to photoshop cubemap faces directly with these principles in mind; put a floor on one, but decoration on the walls, put lights on the ceiling, and then use those six faces. I'm just not familiar with image editing, so that's not my forte.

It would also be possible to put in some 3d furniture pieces and some floor and wall and ceiling tectures a camera into a 3d scene and have it use some rules to make random rooms and take pictures at perfect scale using a three camera. I think that's probably the ideal option, just more work to do.
Doing that, though, a bunch of images could be used to generate included images that could then be used by everyone, and the tool could be made available to people who want to use other furniture options.

## reflections / window appearance
would like to modify shader to use the reflection techniques described here: https://www.youtube.com/watch?v=xutvBtrG23A

original three demo:
http://venolabs.com/three-interior-mapping/

![image](https://user-images.githubusercontent.com/6391152/221391517-899eda8c-9299-4756-b2f2-d15e99442867.png)

https://user-images.githubusercontent.com/6391152/222573534-1c0455be-6511-4a83-9b8b-fdd841315c45.mp4


