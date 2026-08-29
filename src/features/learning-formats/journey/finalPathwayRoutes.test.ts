import assert from "node:assert/strict";
import test from "node:test";

import { routeForSubject } from "./finalPathwayRoutes.ts";

test("maps recommendations only to verified subject routes", () => {
  assert.equal(routeForSubject("english"), "/subjects/english");
  assert.equal(routeForSubject("maths"), "/subjects/mathematics");
  assert.equal(routeForSubject("physics"), "/subjects/science");
  assert.equal(routeForSubject("business-studies"), "/subjects/business-studies");
});
