<!-- github -->
![jsDelivr hits (GitHub)](https://img.shields.io/jsdelivr/gh/hm/kylebakerio/aframe-interior-parallax-mapping)

See these rooms? As long as you don't try to go inside them, they look fully 3d. In reality, they're just a plane with a cubemap and a shader, though. This means you can get the appearance of rooms within buildings very cheaply, a la [spiderman](https://www.youtube.com/watch?v=eX7x1mJrQJs).

To use:

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.4.1/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/kylebakerio/aframe-interior-parallax-mapping@1.0.0/interior-parallax.js"></script>
</head>
```

basic proof of concept. See index.html for a guide to use. Just include the single interior-parallax.js file to use the component.

98% a port of the work done by Mohsen Heydari, I just made it a component and changed it from .dds to supporting 6 png and equirectangular images. fwiw, I find the equirectangular image result to not be very satisfying; I think the base shader probably needs some more improvements, but maybe I just need better/different images somehow. See [here](https://github.com/mohsenheydari/three-interior-mapping/issues/1), where I reference [this video](https://youtu.be/QYvi1akO_Po?t=79) on the details on how opengl (for example) achieves the appearance of a sphere from within a cube in the case of skyboxes--probably a similar pixel sampling technique needs to be added to the shader?

original three demo:
http://venolabs.com/three-interior-mapping/

![image](https://user-images.githubusercontent.com/6391152/221391517-899eda8c-9299-4756-b2f2-d15e99442867.png)
