import { describe, expect, test } from "bun:test";
import {
  buildTheGuyserCollectionConfigFieldDescriptors,
  buildTheGuyserEntryFieldDescriptors,
  getTheGuyserFieldValue,
  setTheGuyserFieldValue,
} from "@/lib/theguyser-admin-fields";
import { getTheGuyserManifestCollectionSchema } from "@/lib/theguyser-external-project-manifest";

describe("theguyser admin field descriptors", () => {
  test("renders every manifest profile field as an editable descriptor", () => {
    const schema = getTheGuyserManifestCollectionSchema("navigation");
    const descriptors = buildTheGuyserEntryFieldDescriptors({
      collectionSlug: "navigation",
      metadata: {},
      profileData: {
        appId: "about",
        color: "bg-green-500",
        iconKey: "user",
        size: "col-span-2",
        sortOrder: 10,
        visible: true,
      },
    });

    expect(descriptors.map((descriptor) => descriptor.key)).toEqual(
      expect.arrayContaining(schema?.profileFields?.map((field) => field.key) ?? []),
    );
    expect(descriptors.find((descriptor) => descriptor.key === "visible")?.input).toBe(
      "boolean",
    );
    expect(descriptors.find((descriptor) => descriptor.key === "sortOrder")?.input).toBe(
      "number",
    );
  });

  test("groups styling controls under collapsed advanced styling", () => {
    const descriptors = buildTheGuyserEntryFieldDescriptors({
      collectionSlug: "awards",
      metadata: {},
      profileData: {
        bg: "bg-emerald-100",
        color: "text-emerald-500",
        iconKey: "visual-novel",
      },
    });

    for (const key of ["bg", "color", "iconKey"]) {
      expect(descriptors.find((descriptor) => descriptor.key === key)).toMatchObject({
        advanced: true,
        group: "Advanced styling",
        styling: true,
      });
    }
  });

  test("keeps unknown profile and metadata keys editable as additional fields", () => {
    const descriptors = buildTheGuyserEntryFieldDescriptors({
      collectionSlug: "experience",
      metadata: {
        customSeo: { title: "Draft SEO" },
      },
      profileData: {
        actionLabel: "Open",
        unknownFlag: true,
      },
    });

    expect(descriptors.find((descriptor) => descriptor.key === "unknownFlag")).toMatchObject({
      group: "Additional fields",
      input: "boolean",
      scope: "profileData",
    });
    expect(descriptors.find((descriptor) => descriptor.key === "customSeo")).toMatchObject({
      group: "Additional fields",
      input: "json",
      scope: "metadata",
    });
  });

  test("updates nested field values without dropping unrelated JSON", () => {
    const source = {
      profileData: {
        actionLabel: "Open",
        nested: { keep: true },
      },
    };
    const descriptor = buildTheGuyserEntryFieldDescriptors({
      collectionSlug: "experience",
      metadata: {},
      profileData: source.profileData,
    }).find((field) => field.key === "actionLabel");

    expect(descriptor).toBeDefined();
    const next = setTheGuyserFieldValue(source.profileData, descriptor!, "Play now");

    expect(getTheGuyserFieldValue(next, descriptor!)).toBe("Play now");
    expect(next.nested).toEqual({ keep: true });
  });

  test("exposes collection config, allowed media, and field definitions as first-class descriptors", () => {
    const schema = getTheGuyserManifestCollectionSchema("panel-content");
    const descriptors = buildTheGuyserCollectionConfigFieldDescriptors({
      config: { schema },
    });

    expect(descriptors.map((descriptor) => descriptor.key)).toEqual(
      expect.arrayContaining([
        "assetTypes",
        "blockTypes",
        "profileFields",
        "metadataFields",
      ]),
    );
    expect(descriptors.find((descriptor) => descriptor.key === "assetTypes")?.input).toBe(
      "string-array",
    );
    expect(descriptors.find((descriptor) => descriptor.key === "profileFields")?.input).toBe(
      "field-list",
    );
  });
});
