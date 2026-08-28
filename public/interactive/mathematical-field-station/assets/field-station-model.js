(function attachMathematicalFieldStationModel(root) {
  'use strict';

  function towerHeight(distance, angleDegrees) {
    if (!Number.isFinite(distance) || distance <= 0) {
      throw new RangeError('distance must be a positive finite number');
    }

    if (!Number.isFinite(angleDegrees) || angleDegrees <= 0 || angleDegrees >= 90) {
      throw new RangeError('angleDegrees must be greater than 0 and less than 90');
    }

    return distance * Math.tan((angleDegrees * Math.PI) / 180);
  }

  function assertPoint(point, name) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new RangeError(`${name} must have finite x and y coordinates`);
    }
  }

  function assertNonNegativeTime(t) {
    if (!Number.isFinite(t) || t < 0) {
      throw new RangeError('time must be a non-negative finite number');
    }
  }

  function assertGravity(gravity) {
    if (!Number.isFinite(gravity) || gravity <= 0) {
      throw new RangeError('gravity must be a positive finite number');
    }
  }

  function projectileAt(config, t) {
    const { origin, velocity, gravity } = config || {};
    assertPoint(origin, 'origin');
    assertPoint(velocity, 'velocity');
    assertGravity(gravity);
    assertNonNegativeTime(t);

    return {
      x: origin.x + velocity.x * t,
      y: origin.y + velocity.y * t - 0.5 * gravity * t * t,
    };
  }

  function fallingMarkerAt(config, t) {
    const { markerInitial, gravity } = config || {};
    assertPoint(markerInitial, 'markerInitial');
    assertGravity(gravity);
    assertNonNegativeTime(t);

    return {
      x: markerInitial.x,
      y: markerInitial.y - 0.5 * gravity * t * t,
    };
  }

  function directAimVelocity(origin, target, speed) {
    assertPoint(origin, 'origin');
    assertPoint(target, 'target');
    if (!Number.isFinite(speed) || speed <= 0) {
      throw new RangeError('speed must be a positive finite number');
    }

    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) {
      throw new RangeError('origin and target must be different points');
    }

    return { x: speed * dx / distance, y: speed * dy / distance };
  }

  const CALIBRATION_CHOICES = Object.freeze(['direct', 'above', 'below']);

  function rotate(vector, angleRadians) {
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    return {
      x: vector.x * cos - vector.y * sin,
      y: vector.x * sin + vector.y * cos,
    };
  }

  function separationSquared(t, velocity, displacement) {
    const relativeX = velocity.x * t - displacement.x;
    const relativeY = velocity.y * t - displacement.y;
    return relativeX ** 2 + relativeY ** 2;
  }

  function closestApproach(choice, config) {
    if (!CALIBRATION_CHOICES.includes(choice)) {
      throw new RangeError('choice must be direct, above, or below');
    }

    const { beadOrigin, markerInitial, speed, gravity } = config || {};
    assertPoint(beadOrigin, 'beadOrigin');
    assertPoint(markerInitial, 'markerInitial');
    assertGravity(gravity);

    const directVelocity = directAimVelocity(beadOrigin, markerInitial, speed);
    const offsetDegrees = config.offsetDegrees === undefined ? 6 : config.offsetDegrees;
    if (!Number.isFinite(offsetDegrees) || offsetDegrees <= 0 || offsetDegrees >= 90) {
      throw new RangeError('offsetDegrees must be greater than 0 and less than 90');
    }

    const velocity = choice === 'direct'
      ? directVelocity
      : rotate(directVelocity, (choice === 'above' ? 1 : -1) * offsetDegrees * Math.PI / 180);
    const beadConfig = { origin: beadOrigin, velocity, gravity };
    const markerConfig = { markerInitial, gravity };
    const displacement = {
      x: markerInitial.x - beadOrigin.x,
      y: markerInitial.y - beadOrigin.y,
    };
    const directSpeedSquared = directVelocity.x ** 2 + directVelocity.y ** 2;
    const directInterceptTime = (
      displacement.x * directVelocity.x + displacement.y * directVelocity.y
    ) / directSpeedSquared;
    if (choice === 'direct') {
      const bead = projectileAt(beadConfig, directInterceptTime);
      const marker = fallingMarkerAt(markerConfig, directInterceptTime);
      return {
        distance: Math.hypot(bead.x - marker.x, bead.y - marker.y),
        time: directInterceptTime,
        bead,
        marker,
      };
    }

    const searchEnd = config.searchMaxTime === undefined ? directInterceptTime * 2 : config.searchMaxTime;
    if (!Number.isFinite(searchEnd) || searchEnd <= 0) {
      throw new RangeError('searchMaxTime must be a positive finite number');
    }

    const samples = 128;
    let bestIndex = 0;
    let bestValue = separationSquared(0, velocity, displacement);
    for (let index = 1; index <= samples; index += 1) {
      const time = searchEnd * index / samples;
      const value = separationSquared(time, velocity, displacement);
      if (value < bestValue) {
        bestValue = value;
        bestIndex = index;
      }
    }

    let low = searchEnd * Math.max(0, bestIndex - 1) / samples;
    let high = searchEnd * Math.min(samples, bestIndex + 1) / samples;
    for (let iteration = 0; iteration < 80; iteration += 1) {
      const left = low + (high - low) / 3;
      const right = high - (high - low) / 3;
      if (separationSquared(left, velocity, displacement) <= separationSquared(right, velocity, displacement)) {
        high = right;
      } else {
        low = left;
      }
    }

    const time = (low + high) / 2;
    const bead = projectileAt(beadConfig, time);
    const marker = fallingMarkerAt(markerConfig, time);
    return {
      distance: Math.hypot(bead.x - marker.x, bead.y - marker.y),
      time,
      bead,
      marker,
    };
  }

  const api = {
    towerHeight,
    projectileAt,
    fallingMarkerAt,
    directAimVelocity,
    closestApproach,
    CALIBRATION_CHOICES,
  };
  root.MathematicalFieldStationModel = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this));
