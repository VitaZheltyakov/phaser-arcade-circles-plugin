/************ Phaser Arcade Circles plugin by Vitaliy Zheltyakov **************/
(function(window, Phaser) {
	'use strict';

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsGroup
    * @private
    * @param {Phaser.Sprite} sprite - The sprite to check.
    * @param {Phaser.Group} group - The Group to check.
    * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} callbackContext - The context in which to run the callbacks.
    * @param {boolean} overlapOnly - Just run an overlap or a full collision.
    */
    Phaser.Physics.Arcade.prototype.collideSpriteVsGroup = function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0 || !sprite.body)
        {
            return;
        }

        if (this.skipQuadTree || sprite.body.skipQuadTree)
        {
            for (var i = 0; i < group.hash.length; i++)
            {
                //  Skip duff entries - we can't check a non-existent sprite or one with no body
                if (!group.hash[i] || !group.hash[i].exists || !group.hash[i].body)
                {
                    continue;
                }

                var body = {};
                body.x = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.x - group.hash[i].body.radius) : group.hash[i].body.x;
                body.y = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.y - group.hash[i].body.radius) : group.hash[i].body.y;
                body.right = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.x + group.hash[i].body.radius) : group.hash[i].body.right;
                body.bottom = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.y + group.hash[i].body.radius) : group.hash[i].body.bottom;

                //  Skip items either side of the sprite
                if (this.sortDirection === Phaser.Physics.Arcade.LEFT_RIGHT)
                {
                    if (sprite.body.right < body.x)
                    {
                        break;
                    }
                    else if (body.right < sprite.body.x)
                    {
                        continue;
                    }
                }
                else if (this.sortDirection === Phaser.Physics.Arcade.RIGHT_LEFT)
                {
                    if (sprite.body.x > body.right)
                    {
                        break;
                    }
                    else if (body.x > sprite.body.right)
                    {
                        continue;
                    }
                }
                else if (this.sortDirection === Phaser.Physics.Arcade.TOP_BOTTOM)
                {
                    if (sprite.body.bottom < body.y)
                    {
                        break;
                    }
                    else if (body.bottom < sprite.body.y)
                    {
                        continue;
                    }
                }
                else if (this.sortDirection === Phaser.Physics.Arcade.BOTTOM_TOP)
                {
                    if (sprite.body.y > body.bottom)
                    {
                        break;
                    }
                    else if (body.y > sprite.body.bottom)
                    {
                        continue;
                    }
                }

                this.collideSpriteVsSprite(sprite, group.hash[i], collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else
        {
            //  What is the sprite colliding with in the quadtree?
            this.quadTree.clear();

            this.quadTree.reset(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

            this.quadTree.populate(group);

            var items = this.quadTree.retrieve(sprite);

            for (var i = 0; i < items.length; i++)
            {
                //  We have our potential suspects, are they in this group?
                if (this.separate(sprite.body, items[i], processCallback, callbackContext, overlapOnly))
                {
                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, items[i].sprite);
                    }

                    this._total++;
                }
            }
        }

    };

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideGroupVsSelf
    * @private
    * @param {Phaser.Group} group - The Group to check.
    * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} callbackContext - The context in which to run the callbacks.
    * @param {boolean} overlapOnly - Just run an overlap or a full collision.
    * @return {boolean} True if there was a collision, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.collideGroupVsSelf = function (group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0)
        {
            return;
        }

        for (var i = 0; i < group.hash.length; i++)
        {
            //  Skip duff entries - we can't check a non-existent sprite or one with no body
            if (!group.hash[i] || !group.hash[i].exists || !group.hash[i].body)
            {
                continue;
            }

            var object1 = {};
            object1.x = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.x - group.hash[i].body.radius) : group.hash[i].body.x;
            object1.y = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.y - group.hash[i].body.radius) : group.hash[i].body.y;
            object1.right = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.x + group.hash[i].body.radius) : group.hash[i].body.right;
            object1.bottom = (group.hash[i].body.isCircle) ? (group.hash[i].body.center.y + group.hash[i].body.radius) : group.hash[i].body.bottom;
            object1.ref = group.hash[i];

            for (var j = i + 1; j < group.hash.length; j++)
            {
                //  Skip duff entries - we can't check a non-existent sprite or one with no body
                if (!group.hash[j] || !group.hash[j].exists || !group.hash[j].body)
                {
                    continue;
                }

                var object2 = {};
                object2.x = (group.hash[j].body.isCircle) ? (group.hash[j].body.center.x - group.hash[j].body.radius) : group.hash[j].body.x;
                object2.y = (group.hash[j].body.isCircle) ? (group.hash[j].body.center.y - group.hash[j].body.radius) : group.hash[j].body.y;
                object2.right = (group.hash[j].body.isCircle) ? (group.hash[j].body.center.x + group.hash[j].body.radius) : group.hash[j].body.right;
                object2.bottom = (group.hash[j].body.isCircle) ? (group.hash[j].body.center.y + group.hash[j].body.radius) : group.hash[j].body.bottom;
                object2.ref = group.hash[j];

                //  Skip items either side of the sprite
                if (this.sortDirection === Phaser.Physics.Arcade.LEFT_RIGHT)
                {
                    if (object1.right < object2.x)
                    {
                        break;
                    }
                    else if (object2.right < object1.x)
                    {
                        continue;
                    }
                }
                else if (this.sortDirection === Phaser.Physics.Arcade.RIGHT_LEFT)
                {
                    if (object1.x > object2.right)
                    {
                        continue;
                    }
                    else if (object2.x > object1.right)
                    {
                        break;
                    }
                }
                else if (this.sortDirection === Phaser.Physics.Arcade.TOP_BOTTOM)
                {
                    if (object1.bottom < object2.y)
                    {
                        continue;
                    }
                    else if (object2.bottom < object1.y)
                    {
                        break;
                    }
                }
                else if (this.sortDirection === Phaser.Physics.Arcade.BOTTOM_TOP)
                {
                    if (object1.y > object2.bottom)
                    {
                        continue;
                    }
                    else if (object2.y > object1.bottom)
                    {
                        break;
                    }
                }

                this.collideSpriteVsSprite(object1.ref, object2.ref, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

    };

    /**
    * The core separation function to separate two physics bodies.
    *
    * @private
    * @method Phaser.Physics.Arcade#separate
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body object to separate.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this function is set then the sprites will only be collided if it returns true.
    * @param {object} [callbackContext] - The context in which to run the process callback.
    * @param {boolean} overlapOnly - Just run an overlap or a full collision.
    * @return {boolean} Returns true if the bodies collided, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.separate = function (body1, body2, processCallback, callbackContext, overlapOnly) {

        if (!body1.enable || !body2.enable || !this.intersects(body1, body2))
        {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false)
        {
            return false;
        }

        // We define the behavior of bodies in a collision circle and rectangle
        // If a collision occurs in the corner points of the rectangle, the body behave like circles
        var collisionAsCircle = false;
        if (body1.isCircle !== body2.isCircle)
        {
            var rect = {};
            rect.x = (body2.isCircle) ? body1.position.x : body2.position.x;
            rect.y = (body2.isCircle) ? body1.position.y : body2.position.y;
            rect.right = (body2.isCircle) ? body1.right : body2.right;
            rect.bottom = (body2.isCircle) ? body1.bottom : body2.bottom;
            var circle = {};
            circle.x = (body1.isCircle) ? (body1.position.x + body1.radius) : (body2.position.x + body2.radius);
            circle.y = (body1.isCircle) ? (body1.position.y + body1.radius) : (body2.position.y + body2.radius);

            if (circle.y < rect.y)
            {
                if (circle.x < rect.x)
                     collisionAsCircle = true;

                if (circle.x > rect.right)
                     collisionAsCircle = true;
            }
            if (circle.y > rect.bottom)
            {
                if (circle.x < rect.x)
                    collisionAsCircle = true;

                if (circle.x > rect.right)
                    collisionAsCircle = true;
            }
        }

        //  Circle vs. Circle quick bail out
        if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
        {
            return this.separateCircle(body1, body2, overlapOnly);
        }

        var resultX = false;
        var resultY = false;

        //  Do we separate on x or y first?
        if (this.forceX || Math.abs(this.gravity.y + body1.gravity.y) < Math.abs(this.gravity.x + body1.gravity.x))
        {
            resultX = this.separateX(body1, body2, overlapOnly);

            //  Are they still intersecting? Let's do the other axis then
            if (this.intersects(body1, body2))
            {
                resultY = this.separateY(body1, body2, overlapOnly);
            }
        }
        else
        {
            resultY = this.separateY(body1, body2, overlapOnly);

            //  Are they still intersecting? Let's do the other axis then
            if (this.intersects(body1, body2))
            {
                resultX = this.separateX(body1, body2, overlapOnly);
            }
        }

        return (resultX || resultY);

    };

    /**
    * Check for intersection against two bodies.
    *
    * @method Phaser.Physics.Arcade#intersects
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body object to check.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body object to check.
    * @return {boolean} True if they intersect, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.intersects = function (body1, body2) {

        if (body1.isCircle)
        {
            if (body2.isCircle)
            {
                //  Circle vs. Circle
                return Phaser.Math.distance(body1.center.x, body1.center.y, body2.center.x, body2.center.y) <= (body1.radius + body2.radius);
            }
            else
            {
                //  Circle vs. Rect
                return this.circleBodyIntersects(body1, body2);
            }
        }
        else
        {
            if (body2.isCircle)
            {
                //  Rect vs. Circle
                return this.circleBodyIntersects(body2, body1);
            }
            else
            {
                //  Rect vs. Rect
                if (body1.right <= body2.position.x)
                {
                    return false;
                }

                if (body1.bottom <= body2.position.y)
                {
                    return false;
                }

                if (body1.position.x >= body2.right)
                {
                    return false;
                }

                if (body1.position.y >= body2.bottom)
                {
                    return false;
                }

                return true;
            }
        }

    };

    /**
    * Checks to see if a circular Body intersects with a Rectangular Body.
    *
    * @method Phaser.Physics.Arcade#circleBodyIntersects
    * @param {Phaser.Physics.Arcade.Body} circle - The Body with `isCircle` set.
    * @param {Phaser.Physics.Arcade.Body} body - The Body with `isCircle` not set (i.e. uses Rectangle shape)
    * @return {boolean} Returns true if the bodies intersect, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.circleBodyIntersects = function (circle, body) {

        var x = Phaser.Math.clamp(circle.center.x, body.left, body.right);
        var y = Phaser.Math.clamp(circle.center.y, body.top, body.bottom);

        var dx = (circle.center.x - x) * (circle.center.x - x);
        var dy = (circle.center.y - y) * (circle.center.y - y);

        return (dx + dy) <= (circle.radius * circle.radius);

    };

    /**
    * The core separation function to separate two circular physics bodies.
    *
    * @method Phaser.Physics.Arcade#separateCircle
    * @private
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate. Must have `Body.isCircle` true and a positive `radius`.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate. Must have `Body.isCircle` true and a positive `radius`.
    * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
    * @return {boolean} Returns true if the bodies were separated or overlap, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.separateCircle = function (body1, body2, overlapOnly) {

        //  Set the bounding box overlap values
        this.getOverlapX(body1, body2);
        this.getOverlapY(body1, body2);

        var angleCollision = this.angleBetweenCenters(body1, body2);

        var overlap = 0;
        if (body1.isCircle !== body2.isCircle)
        {
            var rect = {};
            rect.x = (body2.isCircle) ? body1.position.x : body2.position.x;
            rect.y = (body2.isCircle) ? body1.position.y : body2.position.y;
            rect.right = (body2.isCircle) ? body1.right : body2.right;
            rect.bottom = (body2.isCircle) ? body1.bottom: body2.bottom;
            var circle = {};
            circle.x = (body1.isCircle) ? (body1.position.x + body1.radius) : (body2.position.x + body2.radius);
            circle.y = (body1.isCircle) ? (body1.position.y + body1.radius) : (body2.position.y + body2.radius);
            circle.radius = (body1.isCircle) ? body1.radius : body2.radius;

            if ( circle.y < rect.y)
            {
                if (circle.x < rect.x)
                     overlap = Phaser.Math.distance(circle.x, circle.y, rect.x, rect.y) - circle.radius;

                if (circle.x > rect.right)
                     overlap = Phaser.Math.distance(circle.x, circle.y, rect.right, rect.y) - circle.radius;
            }
            if (circle.y > rect.bottom)
            {
                if (circle.x < rect.x)
                    overlap = Phaser.Math.distance(circle.x, circle.y, rect.x, rect.bottom) - circle.radius;
                if (circle.x > rect.right)
                    overlap = Phaser.Math.distance(circle.x, circle.y, rect.right, rect.bottom) - circle.radius;
            }
            overlap *= -1;
        }
        else overlap = (body1.radius + body2.radius) - Phaser.Math.distance(body1.center.x, body1.center.y, body2.center.x, body2.center.y);

        //  Can't separate two immovable bodies, or a body with its own custom separation logic
        if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateX || body2.customSeparateX)
        {
            //  return true if there was some overlap, otherwise false
            return (overlap !== 0);
        }

        // Transform the velocity vector to the coordinate system oriented along the direction of impact. This is done to eliminate the vertical component of the velocity
        var v1 = {
            x : body1.velocity.x * Math.cos(angleCollision) + body1.velocity.y * Math.sin(angleCollision),
            y : body1.velocity.x * Math.sin(angleCollision) - body1.velocity.y * Math.cos(angleCollision)
        }
        var v2 = {
            x : body2.velocity.x * Math.cos(angleCollision) + body2.velocity.y * Math.sin(angleCollision),
            y : body2.velocity.x * Math.sin(angleCollision) - body2.velocity.y * Math.cos(angleCollision)
        }

        // We expect the new velocity after impact
        var tempVel1 = ((body1.mass - body2.mass) * v1.x + 2 * body2.mass * v2.x) / (body1.mass + body2.mass);
        var tempVel2 = (2 * body1.mass * v1.x + (body2.mass - body1.mass) * v2.x) / (body1.mass + body2.mass);

        // We convert the vector to the original coordinate system and multiplied by factor of rebound
        if (!body1.immovable)
        {
            body1.velocity.x = (tempVel1 * Math.cos(angleCollision) - v1.y * Math.sin(angleCollision)) * body1.bounce.x;
            body1.velocity.y = (v1.y * Math.cos(angleCollision) + tempVel1 * Math.sin(angleCollision)) * body1.bounce.y;
        }
        if (!body2.immovable)
        {
            body2.velocity.x = (tempVel2 * Math.cos(angleCollision) - v2.y * Math.sin(angleCollision)) * body2.bounce.x;
            body2.velocity.y = (v2.y * Math.cos(angleCollision) + tempVel2 * Math.sin(angleCollision)) * body2.bounce.y;
        }

        // When the collision angle almost perpendicular to the total initial velocity vector (collision on a tangent) vector direction can be determined incorrectly.
        // This code fixes the problem
        if (angleCollision > 0)
        {
            if (Math.abs(angleCollision) < Math.PI/2)
            {
                if ((body1.velocity.x > 0)&&(!body1.immovable)) body1.velocity.x *= -1;
                else if ((body2.velocity.x < 0)&&(!body2.immovable)) body2.velocity.x *= -1;
                else if ((body1.velocity.y > 0)&&(!body1.immovable)) body1.velocity.y *= -1;
                else if ((body2.velocity.y < 0)&&(!body2.immovable)) body2.velocity.y *= -1;
            }
            else if (Math.abs(angleCollision) > Math.PI/2)
            {
                if ((body1.velocity.x < 0)&&(!body1.immovable)) body1.velocity.x *= -1;
                else if ((body2.velocity.x > 0)&&(!body2.immovable)) body2.velocity.x *= -1;
                else if ((body1.velocity.y < 0)&&(!body1.immovable)) body1.velocity.y *= -1;
                else if ((body2.velocity.y > 0)&&(!body2.immovable)) body2.velocity.y *= -1;
            }
        }
        if (angleCollision < 0)
        {
            if (Math.abs(angleCollision) < Math.PI/2)
            {
                if ((body1.velocity.x > 0)&&(!body1.immovable)) body1.velocity.x *= -1;
                else if ((body2.velocity.x < 0)&&(!body2.immovable)) body2.velocity.x *= -1;
                else if ((body1.velocity.y > 0)&&(!body1.immovable)) body1.velocity.y *= -1;
                else if ((body2.velocity.y < 0)&&(!body2.immovable)) body2.velocity.y *= -1;
            }
            else if (Math.abs(angleCollision) > Math.PI/2)
            {
                if ((body1.velocity.x < 0)&&(!body1.immovable)) body1.velocity.x *= -1;
                else if ((body2.velocity.x > 0)&&(!body2.immovable)) body2.velocity.x *= -1;
                else if ((body1.velocity.y < 0)&&(!body1.immovable)) body1.velocity.y *= -1;
                else if ((body2.velocity.y > 0)&&(!body2.immovable)) body2.velocity.y *= -1;
            }
        }

        if (!body1.immovable) body1.x += (body1.velocity.x * this.game.time.physicsElapsed) - overlap*Math.cos(angleCollision);
        if (!body2.immovable) body2.x += (body2.velocity.x * this.game.time.physicsElapsed) + overlap*Math.cos(angleCollision);
        if (!body1.immovable) body1.y += (body1.velocity.y * this.game.time.physicsElapsed) - overlap*Math.sin(angleCollision);
        if (!body2.immovable) body2.y += (body2.velocity.y * this.game.time.physicsElapsed) + overlap*Math.sin(angleCollision);

        return true;

    };

    /**
    * Find the distance between centers of two display objects (like Sprites).
    *
    * @method Phaser.Physics.Arcade#distanceBetweenCenters
    * @param {any} source - The Display Object to test from.
    * @param {any} target - The Display Object to test to.
    * @return {number} The distance between centers of the source and target objects.
    */
    Phaser.Physics.Arcade.prototype.distanceBetweenCenters = function (source, target) {

        var dx = source.center.x - target.center.x;
        var dy = source.center.y - target.center.y;

        return Math.sqrt(dx * dx + dy * dy);

    };

    /**
    * Find the angle in radians between centers of two display objects (like Sprites).
    *
    * @method Phaser.Physics.Arcade#angleBetweenCenters
    * @param {any} source - The Display Object to test from.
    * @param {any} target - The Display Object to test to.
    * @return {number} The angle in radians between the source and target display objects.
    */
    Phaser.Physics.Arcade.prototype.angleBetweenCenters = function (source, target) {

        var dx = target.center.x - source.center.x;
        var dy = target.center.y - source.center.y;

        return Math.atan2(dy, dx);

    };

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade.Body#checkWorldBounds
    * @protected
    */
    Phaser.Physics.Arcade.Body.prototype.checkWorldBounds = function () {

        var pos = this.position;
        var bounds = this.game.physics.arcade.bounds;
        var check = this.game.physics.arcade.checkCollision;

        var bx = (this.worldBounce) ? -this.worldBounce.x : -this.bounce.x;
        var by = (this.worldBounce) ? -this.worldBounce.y : -this.bounce.y;

        if (this.isCircle)
        {
            var bodyBounds = {};
            bodyBounds.x = this.center.x - this.radius;
            bodyBounds.y = this.center.y - this.radius;
            bodyBounds.right = this.center.x + this.radius;
            bodyBounds.bottom = this.center.y + this.radius;

            if (bodyBounds.x < bounds.x && check.left)
            {
                pos.x = bounds.x - this.halfWidth + this.radius;
                this.velocity.x *= bx;
                this.blocked.left = true;
            }
            else if (bodyBounds.right > bounds.right && check.right)
            {
                pos.x = bounds.right - this.halfWidth - this.radius;
                this.velocity.x *= bx;
                this.blocked.right = true;
            }

            if (bodyBounds.y < bounds.y && check.up)
            {
                pos.y = bounds.y - this.halfHeight + this.radius;
                this.velocity.y *= by;
                this.blocked.up = true;
            }
            else if (bodyBounds.bottom > bounds.bottom && check.down)
            {
                pos.y = bounds.bottom  - this.halfHeight - this.radius;
                this.velocity.y *= by;
                this.blocked.down = true;
            }
        }
        else
        {
            if (pos.x < bounds.x && check.left)
            {
                pos.x = bounds.x;
                this.velocity.x *= bx;
                this.blocked.left = true;
            }
            else if (this.right > bounds.right && check.right)
            {
                pos.x = bounds.right - this.width;
                this.velocity.x *= bx;
                this.blocked.right = true;
            }

            if (pos.y < bounds.y && check.up)
            {
                pos.y = bounds.y;
                this.velocity.y *= by;
                this.blocked.up = true;
            }
            else if (this.bottom > bounds.bottom && check.down)
            {
                pos.y = bounds.bottom - this.height;
                this.velocity.y *= by;
                this.blocked.down = true;
            }
        }
    };

    /**
    * Render Sprite Body.
    *
    * @method Phaser.Physics.Arcade.Body#render
    * @param {object} context - The context to render to.
    * @param {Phaser.Physics.Arcade.Body} body - The Body to render the info of.
    * @param {string} [color='rgba(0,255,0,0.4)'] - color of the debug info to be rendered. (format is css color string).
    * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
    */
    Phaser.Physics.Arcade.Body.render = function (context, body, color, filled) {

        if (filled === undefined) { filled = true; }

        color = color || 'rgba(0,255,0,0.4)';

        if (filled)
        {
            context.fillStyle = color;
            if (body.isCircle) {
              context.beginPath();
              context.arc(body.center.x - body.game.camera.x, body.center.y - body.game.camera.y, body.radius, 0, 2 * Math.PI, false);
              context.fill();
            }
            else context.fillRect(body.position.x - body.game.camera.x, body.position.y - body.game.camera.y, body.width, body.height);
        }
        else
        {
            context.strokeStyle = color;
            if (body.isCircle) {
              context.beginPath();
              context.arc(body.position.x - body.game.camera.x + body.radius, body.position.y - body.game.camera.y + body.radius, body.radius, 0, 2 * Math.PI, false);
              context.stroke();
            }
            else context.strokeRect(body.position.x - body.game.camera.x, body.position.y - body.game.camera.y, body.width, body.height);
        }

    };

}(window, Phaser));