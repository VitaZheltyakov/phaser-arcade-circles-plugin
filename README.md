# Phaser Arcade Circles plugin
Created by [Vitaliy Zheltyakov](mailto:vita-zhelt@yandex.ru).

Phaser is a fast, free and fun open source HTML5 game framework.
This plugin adds to framework:
* Circle vs. Circle collision
* Circle vs. Rectangle collision
* Circle-body debug render

The plugin does not reduce the performance of arcade physics.
The plugin is easy to use. It does not add new functions, but merely extends existing.

### How to add a plugin

Add to your index.html link to plugin file:
```html
<script src="js/phaser-arcade-circles-plugin.js" type="text/javascript"></script>
```

### How to use a plugin

Then use the standard function **setCircle** for the circle-body.
```
sprite1.body.setCircle(radius, offsetX, offsetY);
```
Calculation of the collision produced as usual. No further use is not necessary functions.


### Note

* Remember, this is an arcade physics. Not real physics. Therefore, some collisions may seem strange.
* Remember, that the _setCircle_ function overrides scaling and anchor point.

### License

Phaser Arcade Circles plugin is released under the [MIT License](http://opensource.org/licenses/MIT).

### Examples

The repository has 4 examples of using the plugin.