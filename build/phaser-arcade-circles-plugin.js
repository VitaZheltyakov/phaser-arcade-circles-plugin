/************ Phaser Arcade Circles plugin by Vitaliy Zheltyakov **************/
(function(window, Phaser) {
	'use strict';

    /**
    * Check for intersection against two bodies.
    *
    * @method Phaser.Physics.Arcade#intersects
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body object to check.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body object to check.
    * @return {boolean} True if they intersect, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.intersects = function (body1, body2) {
        // Circle vs. Circle
        if ((body1.isCircle)&&(body2.isCircle))
        {
          return (this.distanceBetweenCenters(body1, body2) <= (body1.radius + body2.radius));
        }
        //  Rect vs. Rect
        else if ((!body1.isCircle)&&(!body2.isCircle))
        {
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
        }
        //  Rect vs. Circle
        else if (body1.isCircle !== body2.isCircle)
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
                     return ((circle.x - rect.x) * (circle.x - rect.x) + (circle.y - rect.y) * (circle.y - rect.y)) <= circle.radius * circle.radius;

                if (circle.x > rect.right)
                     return ((circle.x - rect.right)*(circle.x - rect.right) + (circle.y - rect.y)*(circle.y - rect.y)) <= circle.radius * circle.radius;

                return (rect.y - circle.y) <= circle.radius;
            }
            if (circle.y > rect.bottom)
            {
                if (circle.x < rect.x)
                    return ((circle.x - rect.x)*(circle.x - rect.x) + (circle.y - rect.bottom)*(circle.y - rect.bottom)) <= circle.radius * circle.radius;
                if (circle.x > rect.right)
                    return ((circle.x - rect.right)*(circle.x - rect.right) + (circle.y - rect.bottom)*(circle.y - rect.bottom)) <= circle.radius * circle.radius;
                return (circle.y - rect.bottom) <= circle.radius;
            }

            if (circle.x < rect.x)
                return (rect.x - circle.x) <= circle.radius;
            if (circle.x > rect.right)
                return (circle.x - rect.right) <= circle.radius;

            return ( (circle.x - rect.x) <= circle.radius || (rect.right - circle.x) <= circle.radius || (circle.y - rect.y) <= circle.radius || (rect.bottom - circle.y) <= circle.radius);
        }

        return true;

    };

    /**
    * Calculates the horizontal overlap between two Bodies and sets their properties accordingly, including:
    * `touching.left`, `touching.right` and `overlapX`.
    *
    * @method Phaser.Physics.Arcade#getOverlapX
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
    * @return {float} Returns the amount of horizontal overlap between the two bodies.
    */
    Phaser.Physics.Arcade.prototype.getOverlapX = function (body1, body2) {

        var overlap = 0;
        var maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;
        if (body1.isCircle) maxOverlap += body1.radius;
        if (body2.isCircle) maxOverlap += body2.radius;

        if (body1.deltaX() === 0 && body2.deltaX() === 0)
        {
            //  They overlap but neither of them are moving
            body1.embedded = true;
            body2.embedded = true;
        }
        else if (body1.deltaX() > body2.deltaX())
        {
            //  Body1 is moving right and / or Body2 is moving left
            overlap = body1.right - body2.x;

            if ((overlap > maxOverlap) || body1.checkCollision.right === false || body2.checkCollision.left === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.right = true;
                body2.touching.none = false;
                body2.touching.left = true;
            }
        }
        else if (body1.deltaX() < body2.deltaX())
        {
            //  Body1 is moving left and/or Body2 is moving right
            overlap = body1.x - body2.width - body2.x;

            if ((-overlap > maxOverlap) || body1.checkCollision.left === false || body2.checkCollision.right === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.left = true;
                body2.touching.none = false;
                body2.touching.right = true;
            }
        }

        //  Resets the overlapX to zero if there is no overlap, or to the actual pixel value if there is
        body1.overlapX = overlap;
        body2.overlapX = overlap;

        return overlap;

    };

    /**
    * Calculates the vertical overlap between two Bodies and sets their properties accordingly, including:
    * `touching.up`, `touching.down` and `overlapY`.
    *
    * @method Phaser.Physics.Arcade#getOverlapY
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
    * @return {float} Returns the amount of vertical overlap between the two bodies.
    */
    Phaser.Physics.Arcade.prototype.getOverlapY = function (body1, body2) {

        var overlap = 0;
        var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;
        if (body1.isCircle) maxOverlap += body1.radius;
        if (body2.isCircle) maxOverlap += body2.radius;

        if (body1.deltaY() === 0 && body2.deltaY() === 0)
        {
            //  They overlap but neither of them are moving
            body1.embedded = true;
            body2.embedded = true;
        }
        else if (body1.deltaY() > body2.deltaY())
        {
            //  Body1 is moving down and/or Body2 is moving up
            overlap = body1.bottom - body2.y;

            if ((overlap > maxOverlap) || body1.checkCollision.down === false || body2.checkCollision.up === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.down = true;
                body2.touching.none = false;
                body2.touching.up = true;
            }
        }
        else if (body1.deltaY() < body2.deltaY())
        {
            //  Body1 is moving up and/or Body2 is moving down
            overlap = body1.y - body2.bottom;
            if ((-overlap > maxOverlap) || body1.checkCollision.up === false || body2.checkCollision.down === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.up = true;
                body2.touching.none = false;
                body2.touching.down = true;
            }
        }

        //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
        body1.overlapY = overlap;
        body2.overlapY = overlap;

        return overlap;

    };

    /**
    * The core separation function to separate two physics bodies on the x axis.
    *
    * @method Phaser.Physics.Arcade#separateX
    * @private
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
    * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
    * @return {boolean} Returns true if the bodies were separated or overlap, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.separateX = function (body1, body2, overlapOnly) {

        var overlap = this.getOverlapX(body1, body2);

        //  Can't separate two immovable bodies, or a body with its own custom separation logic
        if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateX || body2.customSeparateX)
        {
            //  return true if there was some overlap, otherwise false
            return (overlap !== 0);
        }

        // We define the behavior of bodies in a collision circle and rectangle
        // If a collision occurs in the corner points of the rectangle, the body behave like circles
        if (body1.isCircle !== body2.isCircle)
        {
            var collisionAsCircle = false;

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

        // To calculate the collision circle angle needed between bodies
        if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
        {
            var angleCollision = this.angleBetweenCenters(body1, body2);
        }

        //  Adjust their positions and velocities accordingly (if there was any overlap)
        var v1 = body1.velocity.x;
        var v2 = body2.velocity.x;

        if (!body1.immovable && !body2.immovable)
        {
            if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
            {
                body1.x -= (overlap > 0) ? -(body1.deltaAbsX() + body2.deltaAbsX()) : (body1.deltaAbsX() + body2.deltaAbsX());
                body2.x += (overlap > 0) ? (body1.deltaAbsX() + body2.deltaAbsX()) : -(body1.deltaAbsX() + body2.deltaAbsX());

                var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
                var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
                var avg = (nv1 + nv2) * 0.5;

                nv1 -= avg;
                nv2 -= avg;

                body1.velocity.x = (avg + nv1 * body1.bounce.x)*Math.cos(angleCollision)*Math.cos(angleCollision);
                body1.velocity.y += -(avg + nv1 * body1.bounce.y)*Math.cos(angleCollision)*Math.sin(angleCollision);
                body2.velocity.x = (avg + nv2 * body2.bounce.x)*Math.cos(angleCollision)*Math.cos(angleCollision);
                body2.velocity.y += (avg + nv2 * body2.bounce.y)*Math.cos(angleCollision)*Math.sin(angleCollision);
            }
            else if ( ((!body1.isCircle)&&(!body2.isCircle)) || !collisionAsCircle )
            {
                overlap *= 0.5;

                body1.x -= overlap;
                body2.x += overlap;

                var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
                var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
                var avg = (nv1 + nv2) * 0.5;

                nv1 -= avg;
                nv2 -= avg;

                body1.velocity.x = avg + nv1 * body1.bounce.x;
                body2.velocity.x = avg + nv2 * body2.bounce.x;
            }
        }
        else if (!body1.immovable)
        {
            if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
            {
                body1.x += (overlap > 0) ? -(body1.deltaAbsX() + body2.deltaAbsX()) : (body1.deltaAbsX() + body2.deltaAbsX());
                body1.velocity.x = (v2 - v1 * body1.bounce.x)*Math.cos(angleCollision)*Math.cos(angleCollision);
                body1.velocity.y += (v2 - v1 * body1.bounce.y)*Math.cos(angleCollision)*Math.sin(angleCollision);
            }
            else if ( ((!body1.isCircle)&&(!body2.isCircle)) || !collisionAsCircle )
            {
                body1.x -= overlap;
                body1.velocity.x = v2 - v1 * body1.bounce.x;

                //  This is special case code that handles things like vertically moving platforms you can ride
                if (body2.moves)
                {
                    body1.y += (body2.y - body2.prev.y) * body2.friction.y;
                }
            }
        }
        else if (!body2.immovable)
        {
            if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
            {
                body2.x += (overlap > 0) ? (body1.deltaAbsX() + body2.deltaAbsX()) : -(body1.deltaAbsX() + body2.deltaAbsX());
                body2.velocity.x = (v1 - v2 * body2.bounce.x)*Math.cos(angleCollision)*Math.cos(angleCollision);
                body2.velocity.y += (v1 - v2 * body2.bounce.y)*Math.cos(angleCollision)*Math.sin(angleCollision);
            }
            else if ( ((!body1.isCircle)&&(!body2.isCircle)) || !collisionAsCircle )
            {
                body2.x += overlap;
                body2.velocity.x = v1 - v2 * body2.bounce.x;

                //  This is special case code that handles things like vertically moving platforms you can ride
                if (body1.moves)
                {
                    body2.y += (body1.y - body1.prev.y) * body1.friction.y;
                }
            }
        }

        //  If we got this far then there WAS overlap, and separation is complete, so return true
        return true;

    };

    /**
    * The core separation function to separate two physics bodies on the y axis.
    *
    * @private
    * @method Phaser.Physics.Arcade#separateY
    * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
    * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
    * @return {boolean} Returns true if the bodies were separated or overlap, otherwise false.
    */
    Phaser.Physics.Arcade.prototype.separateY = function (body1, body2, overlapOnly) {

        var overlap = this.getOverlapY(body1, body2);

        //  Can't separate two immovable bodies, or a body with its own custom separation logic
        if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateY || body2.customSeparateY)
        {
            //  return true if there was some overlap, otherwise false
            return (overlap !== 0);
        }

        // We define the behavior of bodies in a collision circle and rectangle
        // If a collision occurs in the corner points of the rectangle, the body behave like circles
        if (body1.isCircle !== body2.isCircle)
        {
            var collisionAsCircle = false;

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

        // To calculate the collision circle angle needed between bodies
        if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
        {
            var angleCollision = this.angleBetweenCenters(body1, body2);
        }

        //  Adjust their positions and velocities accordingly (if there was any overlap)
        var v1 = body1.velocity.y;
        var v2 = body2.velocity.y;

        if (!body1.immovable && !body2.immovable)
        {
            if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
            {
                body1.y -= (overlap > 0) ? -(body1.deltaAbsY() + body2.deltaAbsY()) : (body1.deltaAbsY() + body2.deltaAbsY());
                body2.y += (overlap > 0) ? (body1.deltaAbsY() + body2.deltaAbsY()) : -(body1.deltaAbsY() + body2.deltaAbsY());

                var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
                var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
                var avg = (nv1 + nv2) * 0.5;

                nv1 -= avg;
                nv2 -= avg;

                body1.velocity.x += -(avg + nv1 * body1.bounce.x)*Math.sin(angleCollision)*Math.cos(angleCollision);
                body1.velocity.y = (avg + nv1 * body1.bounce.y)*Math.sin(angleCollision)*Math.sin(angleCollision);
                body2.velocity.x += (avg + nv2 * body2.bounce.x)*Math.sin(angleCollision)*Math.cos(angleCollision);
                body2.velocity.y = (avg + nv2 * body2.bounce.y)*Math.sin(angleCollision)*Math.sin(angleCollision);
            }
            else if ( ((!body1.isCircle)&&(!body2.isCircle)) || !collisionAsCircle )
            {
                overlap *= 0.5;

                body1.y -= overlap;
                body2.y += overlap;

                var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
                var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
                var avg = (nv1 + nv2) * 0.5;

                nv1 -= avg;
                nv2 -= avg;

                body1.velocity.y = avg + nv1 * body1.bounce.y;
                body2.velocity.y = avg + nv2 * body2.bounce.y;
            }
        }
        else if (!body1.immovable)
        {
            if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
            {
                body1.y += (overlap > 0) ? -(body1.deltaAbsY() + body2.deltaAbsY()) : (body1.deltaAbsY() + body2.deltaAbsY());
                body1.velocity.x += (v2 - v1 * body1.bounce.x)*Math.cos(angleCollision)*Math.cos(angleCollision);
                body1.velocity.y = (v2 - v1 * body1.bounce.y)*Math.cos(angleCollision)*Math.sin(angleCollision);
            }
            else if ( ((!body1.isCircle)&&(!body2.isCircle)) || !collisionAsCircle )
            {
                body1.y -= overlap;
                body1.velocity.y = v2 - v1 * body1.bounce.y;

                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (body2.moves)
                {
                    body1.x += (body2.x - body2.prev.x) * body2.friction.x;
                }
            }
        }
        else
        {
            if ( ((body1.isCircle)&&(body2.isCircle)) || collisionAsCircle )
            {
                body2.y += (overlap > 0) ? (body1.deltaAbsY() + body2.deltaAbsY()) : -(body1.deltaAbsY() + body2.deltaAbsY());
                body2.velocity.x += (v1 - v2 * body2.bounce.x)*Math.cos(angleCollision)*Math.cos(angleCollision);
                body2.velocity.y = (v1 - v2 * body2.bounce.y)*Math.cos(angleCollision)*Math.sin(angleCollision);
            }
            else if ( ((!body1.isCircle)&&(!body2.isCircle)) || !collisionAsCircle )
            {
                body2.y += overlap;
                body2.velocity.y = v1 - v2 * body2.bounce.y;

                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (body1.moves)
                {
                    body2.x += (body1.x - body1.prev.x) * body1.friction.x;
                }
            }
        }

        //  If we got this far then there WAS overlap, and separation is complete, so return true
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
                this.velocity.x *= -this.bounce.x;
                this.blocked.left = true;
            }
            else if (bodyBounds.right > bounds.right && check.right)
            {
                pos.x = bounds.right - this.halfWidth - this.radius;
                this.velocity.x *= -this.bounce.x;
                this.blocked.right = true;
            }

            if (bodyBounds.y < bounds.y && check.up)
            {
                pos.y = bounds.y - this.halfHeight + this.radius;
                this.velocity.y *= -this.bounce.y;
                this.blocked.up = true;
            }
            else if (bodyBounds.bottom > bounds.bottom && check.down)
            {
                pos.y = bounds.bottom  - this.halfHeight - this.radius;
                this.velocity.y *= -this.bounce.y;
                this.blocked.down = true;
            }
        }
        else
        {
            if (pos.x < bounds.x && check.left)
            {
                pos.x = bounds.x;
                this.velocity.x *= -this.bounce.x;
                this.blocked.left = true;
            }
            else if (this.right > bounds.right && check.right)
            {
                pos.x = bounds.right - this.width;
                this.velocity.x *= -this.bounce.x;
                this.blocked.right = true;
            }

            if (pos.y < bounds.y && check.up)
            {
                pos.y = bounds.y;
                this.velocity.y *= -this.bounce.y;
                this.blocked.up = true;
            }
            else if (this.bottom > bounds.bottom && check.down)
            {
                pos.y = bounds.bottom - this.height;
                this.velocity.y *= -this.bounce.y;
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