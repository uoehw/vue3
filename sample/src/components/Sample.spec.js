// @vitest-environment jsdom

import { mount } from "@vue/test-utils";
import Sample from "./Sample.vue";
import { test, describe, expect } from "vitest";

describe("Sample", () => {
  test("Test properties", () => {
    const wrapper = mount(Sample, {
      props: {
        picture: "test.jpg",
        name: "malarin",
      },
    });

    expect(
      wrapper.find("div.container div div span:first-child").text(),
    ).toEqual("malarin");

    expect(wrapper.find("div.container div img").attributes("style")).toContain(
      "background-image: url(test.jpg)",
    );
  });
});
