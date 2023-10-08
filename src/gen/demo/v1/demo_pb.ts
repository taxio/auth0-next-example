// @generated by protoc-gen-es v1.3.3 with parameter "target=ts"
// @generated from file demo/v1/demo.proto (package demo.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message demo.v1.GetMeRequest
 */
export class GetMeRequest extends Message<GetMeRequest> {
  constructor(data?: PartialMessage<GetMeRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "demo.v1.GetMeRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetMeRequest {
    return new GetMeRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetMeRequest {
    return new GetMeRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetMeRequest {
    return new GetMeRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetMeRequest | PlainMessage<GetMeRequest> | undefined, b: GetMeRequest | PlainMessage<GetMeRequest> | undefined): boolean {
    return proto3.util.equals(GetMeRequest, a, b);
  }
}

/**
 * @generated from message demo.v1.GetMeResponse
 */
export class GetMeResponse extends Message<GetMeResponse> {
  /**
   * @generated from field: string email = 1;
   */
  email = "";

  /**
   * @generated from field: string name = 2;
   */
  name = "";

  /**
   * @generated from field: string picture = 3;
   */
  picture = "";

  constructor(data?: PartialMessage<GetMeResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "demo.v1.GetMeResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "email", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "picture", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetMeResponse {
    return new GetMeResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetMeResponse {
    return new GetMeResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetMeResponse {
    return new GetMeResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetMeResponse | PlainMessage<GetMeResponse> | undefined, b: GetMeResponse | PlainMessage<GetMeResponse> | undefined): boolean {
    return proto3.util.equals(GetMeResponse, a, b);
  }
}

/**
 * @generated from message demo.v1.UpdateSettingsRequest
 */
export class UpdateSettingsRequest extends Message<UpdateSettingsRequest> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string picture = 2;
   */
  picture = "";

  constructor(data?: PartialMessage<UpdateSettingsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "demo.v1.UpdateSettingsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "picture", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateSettingsRequest {
    return new UpdateSettingsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateSettingsRequest {
    return new UpdateSettingsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateSettingsRequest {
    return new UpdateSettingsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateSettingsRequest | PlainMessage<UpdateSettingsRequest> | undefined, b: UpdateSettingsRequest | PlainMessage<UpdateSettingsRequest> | undefined): boolean {
    return proto3.util.equals(UpdateSettingsRequest, a, b);
  }
}

/**
 * @generated from message demo.v1.UpdateSettingsResponse
 */
export class UpdateSettingsResponse extends Message<UpdateSettingsResponse> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string picture = 2;
   */
  picture = "";

  constructor(data?: PartialMessage<UpdateSettingsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "demo.v1.UpdateSettingsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "picture", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateSettingsResponse {
    return new UpdateSettingsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateSettingsResponse {
    return new UpdateSettingsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateSettingsResponse {
    return new UpdateSettingsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateSettingsResponse | PlainMessage<UpdateSettingsResponse> | undefined, b: UpdateSettingsResponse | PlainMessage<UpdateSettingsResponse> | undefined): boolean {
    return proto3.util.equals(UpdateSettingsResponse, a, b);
  }
}
