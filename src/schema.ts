import { S, TypedObject } from "@dxos/echo-schema";

export class Task extends TypedObject({
  typename: "example.Task",
  version: "0.1.0",
})({
  title: S.String,
  completed: S.Boolean,
}) {}
