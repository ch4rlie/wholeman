import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import { siteConfig } from "@/lib/site";

describe("/about page", () => {
  it("tells the WholeMan story and features both founders", () => {
    render(<AboutPage />);
    expect(screen.getByText(siteConfig.vision.purpose)).toBeInTheDocument();
    expect(screen.getByText("Ccowl")).toBeInTheDocument();
    expect(screen.getByText("Charlie Grove")).toBeInTheDocument();
  });
});
